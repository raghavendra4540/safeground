import { config } from '../../config/env.js';
import {
  SYSTEM_PROMPT,
  buildRiskExplanationPrompt,
  buildRelocationRecommendationPrompt,
  buildEmergencyPlanPrompt,
  buildReportPrompt,
} from './prompts.js';
import {
  generateFallbackRiskExplanation,
  generateFallbackRelocationRecommendation,
  generateFallbackEmergencyPlan,
  generateFallbackReport,
} from './fallbackAI.service.js';

const isAIAvailable = () => !!config.aiApiKey;

/**
 * Call OpenAI-compatible API
 */
const callAI = async (prompt, maxTokens = 600) => {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: config.aiApiKey });

  const response = await client.chat.completions.create({
    model: config.aiModel || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.4,
  });

  return response.choices[0]?.message?.content || '';
};

/**
 * Analyze risk for a settlement
 * Architecture: deterministic engine → structured data → LLM explanation layer
 */
export const analyzeRisk = async (data) => {
  if (!isAIAvailable()) {
    return {
      explanation: generateFallbackRiskExplanation(data),
      confidence: 85,
      source: 'deterministic_engine',
      aiAvailable: false,
    };
  }

  try {
    const prompt = buildRiskExplanationPrompt(data);
    const explanation = await callAI(prompt, 600);
    return {
      explanation,
      confidence: 92,
      source: 'ai_model',
      aiAvailable: true,
      model: config.aiModel,
    };
  } catch (err) {
    console.error('AI risk analysis failed, using fallback:', err.message);
    return {
      explanation: generateFallbackRiskExplanation(data),
      confidence: 85,
      source: 'deterministic_engine_fallback',
      aiAvailable: false,
      error: err.message,
    };
  }
};

/**
 * Generate relocation recommendation
 */
export const recommendRelocation = async (data) => {
  if (!isAIAvailable()) {
    return {
      recommendation: generateFallbackRelocationRecommendation(data),
      confidence: 88,
      source: 'deterministic_engine',
      aiAvailable: false,
    };
  }

  try {
    const prompt = buildRelocationRecommendationPrompt(data);
    const recommendation = await callAI(prompt, 500);
    return {
      recommendation,
      confidence: 90,
      source: 'ai_model',
      aiAvailable: true,
    };
  } catch (err) {
    return {
      recommendation: generateFallbackRelocationRecommendation(data),
      confidence: 88,
      source: 'deterministic_engine_fallback',
      aiAvailable: false,
    };
  }
};

/**
 * Generate emergency action plan
 */
export const generateEmergencyPlan = async (data) => {
  if (!isAIAvailable()) {
    return {
      plan: generateFallbackEmergencyPlan(data),
      confidence: 82,
      source: 'deterministic_engine',
      aiAvailable: false,
    };
  }

  try {
    const prompt = buildEmergencyPlanPrompt(data);
    const plan = await callAI(prompt, 700);
    return {
      plan,
      confidence: 88,
      source: 'ai_model',
      aiAvailable: true,
    };
  } catch (err) {
    return {
      plan: generateFallbackEmergencyPlan(data),
      confidence: 82,
      source: 'deterministic_engine_fallback',
      aiAvailable: false,
    };
  }
};

/**
 * Generate full disaster management report
 */
export const generateReport = async (data) => {
  if (!isAIAvailable()) {
    return {
      content: generateFallbackReport(data),
      confidence: 85,
      source: 'deterministic_engine',
      aiAvailable: false,
    };
  }

  try {
    const prompt = buildReportPrompt(data);
    const raw = await callAI(prompt, 900);
    // Parse JSON response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const content = jsonMatch ? JSON.parse(jsonMatch[0]) : generateFallbackReport(data);
    return {
      content,
      confidence: 90,
      source: 'ai_model',
      aiAvailable: true,
    };
  } catch (err) {
    return {
      content: generateFallbackReport(data),
      confidence: 85,
      source: 'deterministic_engine_fallback',
      aiAvailable: false,
    };
  }
};

export const getAIStatus = () => ({
  available: isAIAvailable(),
  model: config.aiModel,
  mode: isAIAvailable() ? 'live' : 'fallback',
});

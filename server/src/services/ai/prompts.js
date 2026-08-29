/**
 * AI Prompt Templates
 * All prompts receive pre-calculated structured data — LLM only explains and recommends
 */

export const SYSTEM_PROMPT = `You are HazardShield AI, an expert disaster-management planning assistant integrated into the HazardShield command center. 

Your role:
- Analyze pre-calculated risk scores and structured data
- Provide clear, human-readable explanations of risk factors
- Generate actionable recommendations for disaster management officials
- Explain trade-offs between relocation options
- Never invent measurements, scores, or statistics — only interpret provided data
- Distinguish clearly between calculated metrics and qualitative recommendations
- Be concise but thorough. Use plain language suitable for emergency operations teams.
- Always structure your response with clear sections.`;

export const buildRiskExplanationPrompt = (data) => {
  const { settlement, riskResult, priorityResult, nearestSafeSites } = data;

  return `Analyze the disaster risk situation for this settlement and provide an explanation suitable for emergency management officials.

SETTLEMENT DATA:
Name: ${settlement.name}
Region: ${settlement.regionName}
Population: ${settlement.population.toLocaleString()}
Elevation: ${settlement.elevation}m

HAZARD SCORES (0-100, higher = worse):
- Flood Risk: ${settlement.floodRisk}/100
- Landslide Risk: ${settlement.landslideRisk}/100
- Cyclone/Wind Risk: ${settlement.cycloneRisk}/100
- Extreme Heat Risk: ${settlement.heatRisk}/100
- Infrastructure Vulnerability: ${settlement.infrastructureRisk}/100

CALCULATED COMPOSITE RISK: ${riskResult.score}/100 (${riskResult.level})

INFRASTRUCTURE:
- Road Accessibility: ${settlement.roadAccessibility}/100
- Healthcare Access: ${settlement.healthcareAccess}/100

VULNERABLE POPULATION:
- Children: ${settlement.children.toLocaleString()}
- Elderly: ${settlement.elderly.toLocaleString()}  
- Disabled: ${settlement.disabled.toLocaleString()}
- Low Income: ${settlement.lowIncome.toLocaleString()}
- Total Vulnerable: ${(settlement.children + settlement.elderly + settlement.disabled + (settlement.pregnantWomen || 0)).toLocaleString()}

RELOCATION PRIORITY: ${priorityResult.priorityScore}/100 (${priorityResult.priorityLevel})

NEAREST SAFE SITES:
${nearestSafeSites.slice(0, 3).map((s, i) => `${i + 1}. ${s.name} — Safety: ${s.safetyScore}/100, Available: ${(s.totalCapacity - s.occupiedCapacity).toLocaleString()} people`).join('\n')}

Please provide:
1. RISK EXPLANATION: Why is this settlement at this risk level? What are the main drivers?
2. VULNERABLE POPULATION ANALYSIS: Who is most at risk and why?
3. KEY CONCERNS: Top 3 specific concerns for emergency planners
4. RECOMMENDED ACTIONS: Immediate, short-term, and long-term recommendations
5. RELOCATION ASSESSMENT: Should this settlement be relocated? Why or why not?

Keep response focused and actionable. Total response should be 250-350 words.`;
};

export const buildRelocationRecommendationPrompt = (data) => {
  const { settlement, recommendations } = data;
  const top3 = recommendations.slice(0, 3);

  return `Analyze the following relocation options for ${settlement.name} and recommend the best course of action.

SOURCE SETTLEMENT:
Name: ${settlement.name}
Population to Relocate: ${settlement.population.toLocaleString()}
Current Risk Level: ${settlement.riskLevel} (Score: ${settlement.hazardScore}/100)

CANDIDATE RELOCATION SITES (ranked by algorithm):
${top3.map((r, i) => `
SITE ${i + 1}: ${r.site.name}
  Algorithm Rank: #${r.rank} (Score: ${r.candidateScore}/100)
  Safety Score: ${r.site.safetyScore}/100
  Available Capacity: ${r.feasibility.availableCapacity.toLocaleString()} people
  Feasible for ${settlement.population.toLocaleString()}: ${r.feasibility.feasible ? 'YES' : 'NO'}
  Distance: ${r.distance} km
  Estimated Transport Cost: ₹${r.transport.totalCost.toLocaleString()}
  Healthcare: ${r.site.healthcareScore}/100
  Road Access: ${r.site.roadAccessibility}/100
  Safety Improvement: +${r.safetyImprovement}%`).join('\n')}

Please provide:
1. RECOMMENDATION: Which site is best and why? Address trade-offs explicitly.
2. OPERATIONAL CONSIDERATIONS: Key factors planners must address
3. PHASING: If full relocation isn't feasible, recommend a phased approach
4. RISKS: What could go wrong with the top recommendation?

Keep response focused. 200-280 words.`;
};

export const buildEmergencyPlanPrompt = (data) => {
  const { settlement, riskResult, simulationResult } = data;
  const simData = simulationResult?.simulated || {};

  return `Generate an emergency action plan for ${settlement?.name || 'the affected region'}.

RISK CONTEXT:
${settlement ? `Settlement: ${settlement.name}, Population: ${settlement.population?.toLocaleString()}, Risk Level: ${riskResult?.level || 'CRITICAL'}` : 'Regional multi-hazard emergency'}
${simulationResult ? `Scenario: ${simulationResult.type?.toUpperCase()} - ${simulationResult.severity?.toUpperCase()} severity` : ''}
${simData.affectedPopulation ? `Affected Population: ${simData.affectedPopulation.toLocaleString()}` : ''}
${simData.relocationDemand ? `Relocation Demand: ${simData.relocationDemand.toLocaleString()}` : ''}
${simData.capacityGap ? `Capacity Gap: ${simData.capacityGap.toLocaleString()} people` : ''}
${simData.evacuationRoutesDamaged ? `Evacuation Routes Damaged: ${simData.evacuationRoutesDamaged}` : ''}

Generate a structured emergency action plan with:
1. IMMEDIATE ACTIONS (0-6 hours): Critical life-safety steps
2. 24-HOUR ACTIONS: Stabilization and evacuation coordination
3. 7-DAY ACTIONS: Sustained response and relocation execution  
4. LONG-TERM MITIGATION: Infrastructure and policy recommendations

For each timeframe, provide 3-4 specific, actionable items with responsible agencies where applicable.
Total response: 300-400 words.`;
};

export const buildReportPrompt = (data) => {
  const { region, stats, topSettlements, topSafeSites } = data;

  return `Generate a professional disaster management intelligence report for ${region}.

REGIONAL STATISTICS:
- Total Population at Risk: ${stats.populationAtRisk?.toLocaleString()}
- Critical Zones: ${stats.criticalZones}
- High-Risk Settlements: ${stats.highRiskSettlements}
- Safe Sites Available: ${stats.safeSitesCount}
- Total Safe Capacity: ${stats.totalSafeCapacity?.toLocaleString()}

TOP CRITICAL SETTLEMENTS:
${topSettlements.map(s => `- ${s.name}: Risk ${s.hazardScore}/100 (${s.riskLevel}), Pop: ${s.population?.toLocaleString()}`).join('\n')}

RECOMMENDED SAFE SITES:
${topSafeSites.map(s => `- ${s.name}: Safety ${s.safetyScore}/100, Available: ${(s.totalCapacity - s.occupiedCapacity)?.toLocaleString()}`).join('\n')}

Generate a report with these sections (JSON format):
{
  "executiveSummary": "2-3 sentence overview",
  "riskAssessment": "Detailed risk narrative (100 words)",
  "criticalSettlements": ["list of critical settlement names with brief notes"],
  "recommendedRelocations": ["specific relocation recommendations"],
  "safeSites": ["recommended safe sites with rationale"],
  "infrastructureGaps": ["key gaps identified"],
  "immediateActions": ["3-5 immediate actions"],
  "longTermRecommendations": ["3-5 long-term recommendations"]
}

Return only valid JSON.`;
};

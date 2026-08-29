import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, AlertTriangle, Shield, Navigation, FileText, Zap, Cpu } from 'lucide-react';
import { getSettlements } from '../services/settlement.api.js';
import { analyzeRisk, recommendSite, getEmergencyPlan, generateReport, getAIStatus } from '../services/ai.api.js';
import AIMessage from '../components/ai/AIMessage.jsx';
import AIThinking from '../components/ai/AIThinking.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';

const QUICK_ACTIONS = [
  { id: 'explain', icon: AlertTriangle, label: 'Explain Risk', color: 'text-red-400', desc: 'Why is this settlement critical?' },
  { id: 'sites', icon: Shield, label: 'Find Safer Sites', color: 'text-green-400', desc: 'Top relocation recommendations' },
  { id: 'plan', icon: Navigation, label: 'Relocation Plan', color: 'text-blue-400', desc: 'Generate full relocation strategy' },
  { id: 'emergency', icon: Zap, label: 'Emergency Plan', color: 'text-orange-400', desc: 'Immediate action plan' },
  { id: 'report', icon: FileText, label: 'Generate Report', color: 'text-purple-400', desc: 'Full regional intelligence report' },
];

const AIInsights = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getSettlements({ limit: 30 }),
      getAIStatus(),
    ]).then(([sr, ar]) => {
      setSettlements(sr.data.data);
      setAiStatus(ar.data.data);
      // Initial greeting
      setMessages([{
        role: 'ai',
        content: `Welcome to SafeGround AI Decision Support Analyst.\n\nI provide explainable disaster intelligence, multi-criteria relocation optimization, host site bottleneck detection, and actionable emergency plans for all settlements across the region.\n\nSelect a settlement on the left to begin targeted analysis.`,
        confidence: null,
        timestamp: Date.now(),
      }]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const addMessage = (role, content, confidence) => {
    setMessages(prev => [...prev, { role, content, confidence, timestamp: Date.now() }]);
  };

  const runAction = async (actionId) => {
    if (!selectedSettlement && actionId !== 'report') {
      addMessage('ai', 'Please select a settlement from the panel first.', null);
      return;
    }

    const userTexts = {
      explain: `Why is ${selectedSettlement?.name} classified as ${selectedSettlement?.riskLevel}?`,
      sites: `Find the safest relocation sites for ${selectedSettlement?.name}.`,
      plan: `Generate a relocation plan for ${selectedSettlement?.name}.`,
      emergency: `Generate an emergency action plan for ${selectedSettlement?.name}.`,
      report: `Generate a full regional risk intelligence report for Telangana.`,
    };

    addMessage('user', userTexts[actionId], null);
    setThinking(true);

    try {
      let content = '';
      let confidence = 85;

      if (actionId === 'explain') {
        const res = await analyzeRisk({ settlementId: selectedSettlement._id });
        const d = res.data.data;
        content = d.aiExplanation?.explanation || 'Analysis complete.';
        confidence = d.aiExplanation?.confidence;
      } else if (actionId === 'sites') {
        const res = await recommendSite({ settlementId: selectedSettlement._id });
        const d = res.data.data;
        content = d.aiRecommendation?.recommendation || 'Recommendation ready.';
        confidence = d.aiRecommendation?.confidence;
      } else if (actionId === 'plan') {
        const res = await recommendSite({ settlementId: selectedSettlement._id });
        const d = res.data.data;
        content = d.aiRecommendation?.recommendation || '';
        confidence = d.aiRecommendation?.confidence;
      } else if (actionId === 'emergency') {
        const res = await getEmergencyPlan({ settlementId: selectedSettlement._id });
        content = res.data.data?.plan || 'Emergency plan generated.';
        confidence = res.data.data?.confidence;
      } else if (actionId === 'report') {
        const res = await generateReport({ region: 'Telangana' });
        const c = res.data.data?.content;
        if (c) {
          content = `**REGIONAL INTELLIGENCE REPORT — TELANGANA**\n\n**Executive Summary**\n${c.executiveSummary}\n\n**Risk Assessment**\n${c.riskAssessment}\n\n**Immediate Actions**\n${c.immediateActions?.map(a => `• ${a}`).join('\n')}\n\n**Long-Term Recommendations**\n${c.longTermRecommendations?.map(r => `• ${r}`).join('\n')}`;
        }
        confidence = res.data.data?.aiMeta?.confidence;
      }

      addMessage('ai', content, confidence);
    } catch (e) {
      addMessage('ai', 'Analysis unavailable. Please check API connection and try again.', null);
    }
    setThinking(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Left panel */}
      <div className="w-72 border-r border-white/5 flex flex-col bg-navy-900/40">
        {/* AI Status */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Brain size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-200">HazardShield AI</p>
              <p className="text-xs text-gray-500">Analyst Module</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
            aiStatus?.available ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
          }`}>
            <Cpu size={12} />
            {aiStatus?.available ? `Live AI · ${aiStatus.model}` : 'Fallback Engine (no API key)'}
          </div>
        </div>

        {/* Settlement selector */}
        <div className="p-3 border-b border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Select Settlement</p>
          <div className="space-y-1 max-h-56 overflow-y-auto">
            {settlements.slice(0, 20).map(s => (
              <button key={s._id}
                onClick={() => setSelectedSettlement(s)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                  selectedSettlement?._id === s._id
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'border-transparent hover:bg-white/5 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{s.name}</span>
                  <RiskBadge level={s.riskLevel} size="xs" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-3 flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
          <div className="space-y-1.5">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.id}
                onClick={() => runAction(action.id)}
                disabled={thinking}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <action.icon size={14} className={action.color} />
                  <div>
                    <p className="text-xs font-medium text-gray-200">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-3">
          <Brain size={16} className="text-blue-400" />
          <div>
            <p className="text-sm font-semibold text-gray-200">HazardShield AI Analyst</p>
            <p className="text-xs text-gray-500">
              {selectedSettlement ? `Analyzing: ${selectedSettlement.name}` : 'No settlement selected'}
            </p>
          </div>
          {selectedSettlement && (
            <div className="ml-auto">
              <RiskBadge level={selectedSettlement.riskLevel} />
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <AIMessage key={i} role={msg.role} content={msg.content} confidence={msg.confidence} timestamp={msg.timestamp} />
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Brain size={14} className="text-blue-400" />
              </div>
              <AIThinking active />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Bottom hint */}
        <div className="px-5 py-3 border-t border-white/5 bg-navy-900/30">
          <p className="text-xs text-gray-600 text-center">
            Select a settlement + action above · AI explanations are based on pre-calculated risk scores
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

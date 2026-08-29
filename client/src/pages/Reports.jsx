import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Eye, Calendar, Shield, AlertTriangle, Loader2, X } from 'lucide-react';
import { getReports, getReportById } from '../services/report.api.js';
import { generateReport } from '../services/ai.api.js';
import { PageLoader } from '../components/common/Loader.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';
import AIThinking from '../components/ai/AIThinking.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const TYPE_LABELS = {
  risk_assessment: 'Risk Assessment',
  relocation_strategy: 'Relocation Strategy',
  flood_preparedness: 'Heat/Flood Preparedness',
  emergency_shelter: 'Emergency Shelter',
  general: 'General Report',
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [newReport, setNewReport] = useState(null);

  useEffect(() => {
    getReports().then(r => { setReports(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const viewReport = async (id) => {
    try {
      const res = await getReportById(id);
      setViewing(res.data.data);
    } catch {}
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setNewReport(null);
    try {
      const res = await generateReport({ region: 'Telangana' });
      setNewReport(res.data.data);
    } catch {}
    setGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Disaster Intelligence Reports</h1>
          <p className="text-sm text-gray-400">{reports.length} reports available</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold disabled:opacity-60"
        >
          {generating ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
          Generate AI Report
        </motion.button>
      </div>

      {/* Generating state */}
      {generating && (
        <div className="glass-card">
          <AIThinking active />
        </div>
      )}

      {/* Newly generated report */}
      {newReport && !generating && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300">Freshly Generated Report</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10">
                <Download size={12} />Download
              </button>
              <button onClick={() => setNewReport(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500"><X size={14} /></button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Executive Summary</p>
              <p className="text-sm text-gray-300">{newReport.content?.executiveSummary}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Risk Assessment</p>
              <p className="text-sm text-gray-300">{newReport.content?.riskAssessment}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Immediate Actions</p>
                <ul className="space-y-1.5">
                  {newReport.content?.immediateActions?.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-red-400 font-bold mt-0.5">•</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Long-Term Recommendations</p>
                <ul className="space-y-1.5">
                  {newReport.content?.longTermRecommendations?.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-blue-400 font-bold mt-0.5">→</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Existing reports grid */}
      {reports.length === 0 ? (
        <EmptyState icon={FileText} title="No reports found" message="Generate a report using the button above" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, i) => (
            <motion.div key={report._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText size={18} className="text-blue-400" />
                </div>
                <RiskBadge level={report.riskLevel} />
              </div>

              <h3 className="font-semibold text-gray-100 text-sm mb-1">{report.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{TYPE_LABELS[report.type] || report.type}</p>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1"><Shield size={11} />{report.region}</div>
                <div className="flex items-center gap-1"><Calendar size={11} />{new Date(report.createdAt).toLocaleDateString('en-IN')}</div>
                <div className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                  report.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}>{report.status}</div>
              </div>

              <button onClick={() => viewReport(report._id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/3 hover:bg-white/8 text-gray-300 text-xs border border-white/5 transition-colors">
                <Eye size={12} />View Report
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report viewer modal */}
      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewing(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass border border-white/10 rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 bg-navy-900/95 backdrop-blur p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white">{viewing.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{viewing.region} · {new Date(viewing.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10">
                    <Download size={12} />Download
                  </button>
                  <button onClick={() => setViewing(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400"><X size={16} /></button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {[
                  { label: 'Executive Summary', content: viewing.content?.executiveSummary },
                  { label: 'Risk Assessment', content: viewing.content?.riskAssessment },
                ].map(({ label, content }) => content && (
                  <div key={label}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
                  </div>
                ))}

                {[
                  { label: 'Critical Settlements', items: viewing.content?.criticalSettlements, color: 'text-red-400', bullet: '⚠' },
                  { label: 'Recommended Relocations', items: viewing.content?.recommendedRelocations, color: 'text-blue-400', bullet: '→' },
                  { label: 'Safe Sites', items: viewing.content?.safeSites, color: 'text-green-400', bullet: '✓' },
                  { label: 'Infrastructure Gaps', items: viewing.content?.infrastructureGaps, color: 'text-yellow-400', bullet: '!' },
                  { label: 'Immediate Actions', items: viewing.content?.immediateActions, color: 'text-orange-400', bullet: '▶' },
                  { label: 'Long-Term Recommendations', items: viewing.content?.longTermRecommendations, color: 'text-purple-400', bullet: '◆' },
                ].map(({ label, items, color, bullet }) => items?.length > 0 && (
                  <div key={label}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</h3>
                    <ul className="space-y-1.5">
                      {items.map((item, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm text-gray-300`}>
                          <span className={`${color} font-bold mt-0.5 flex-shrink-0`}>{bullet}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                  <span>Generated by: {viewing.generatedBy}</span>
                  <span>Confidence: {viewing.metadata?.confidence}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;

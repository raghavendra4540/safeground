import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, Cpu, Globe, MapPin, Check, Sparkles } from 'lucide-react';
import useDashboardStore from '../../store/dashboardStore.js';

const Topbar = ({ title = 'SafeGround AI' }) => {
  const { selectedRegion, setRegion, regions, fetchRegions } = useDashboardStore();
  const [showRegion, setShowRegion] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowRegion(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRegions = regions.filter(r =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (r.state && r.state.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (r.category && r.category.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // Group by category
  const categories = ['National', 'South India', 'Himalayan & North', 'East & Coastal', 'West India', 'East & Central'];
  const currentRegionObj = regions.find(r => r.name === selectedRegion) || { name: selectedRegion };

  return (
    <header className="h-14 bg-navy-900/90 backdrop-blur border-b border-white/5 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-30">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-200 hidden md:block">{title}</h2>

      {/* Pan-India Region selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowRegion(!showRegion)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-sm text-gray-100 font-medium transition-all shadow-sm group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Globe size={14} className="text-blue-400 group-hover:rotate-12 transition-transform" />
          <span className="max-w-[140px] truncate">{selectedRegion}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showRegion ? 'rotate-180' : ''}`} />
        </button>

        {showRegion && (
          <div className="absolute top-full mt-2 left-0 w-72 max-h-[460px] flex flex-col bg-navy-900 border border-blue-500/30 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header & Search */}
            <div className="p-2.5 border-b border-white/10 bg-navy-950/60">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <MapPin size={11} /> Select Indian Region
                </span>
                <span className="text-[10px] text-gray-400">{regions.length} Locations</span>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search state, basin or region..."
                  className="w-full pl-7 pr-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Region List */}
            <div className="overflow-y-auto flex-1 p-1.5 space-y-2">
              {filteredRegions.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No matching region found
                </div>
              ) : (
                categories.map(cat => {
                  const inCat = filteredRegions.filter(r => (r.category || 'Other') === cat);
                  if (inCat.length === 0) return null;
                  return (
                    <div key={cat} className="space-y-0.5">
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-white/[0.02] rounded">
                        {cat}
                      </div>
                      {inCat.map(r => {
                        const isSelected = r.name === selectedRegion;
                        return (
                          <button
                            key={r.name}
                            onClick={() => {
                              setRegion(r);
                              setShowRegion(false);
                              setSearchFilter('');
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                              isSelected
                                ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-gray-500'}`} />
                              <div className="truncate">
                                <p className="leading-tight truncate">{r.name}</p>
                                {r.state && r.state !== r.name && (
                                  <p className="text-[10px] text-gray-500">{r.state}</p>
                                )}
                              </div>
                            </div>
                            {isSelected && <Check size={13} className="text-blue-400 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick All-India Reset Button */}
            <div className="p-2 border-t border-white/10 bg-navy-950/80 flex items-center justify-between">
              <button
                onClick={() => {
                  setRegion('All India');
                  setShowRegion(false);
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                <Sparkles size={11} /> Reset to All India (National)
              </button>
              <span className="text-[10px] text-gray-400 font-mono">
                {currentRegionObj.center ? `${currentRegionObj.center[0].toFixed(1)}°N` : 'Live GIS'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* AI Online Status */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <Cpu size={13} className="text-blue-400" />
        <span className="text-xs font-medium text-blue-400 hidden sm:block">AI Online</span>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
        <Bell size={16} />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
};

export default Topbar;


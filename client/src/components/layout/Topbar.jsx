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

  const allRegions = regions && regions.length > 0 ? regions : PAN_INDIA_REGIONS;
  const query = searchFilter.trim().toLowerCase();

  const filteredRegions = allRegions.filter(r => {
    if (!query) return true;
    const nameMatch = r.name?.toLowerCase().includes(query);
    const stateMatch = r.state?.toLowerCase().includes(query);
    const catMatch = r.category?.toLowerCase().includes(query);
    const keyMatch = r.keywords?.toLowerCase().includes(query);
    const descMatch = r.description?.toLowerCase().includes(query);
    return Boolean(nameMatch || stateMatch || catMatch || keyMatch || descMatch);
  });

  // Dynamically extract all available categories preserving logical order
  const defaultOrder = ['National', 'South India', 'Himalayan & North', 'East & Coastal', 'West India', 'North East', 'East & Central'];
  const presentCategories = Array.from(new Set(allRegions.map(r => r.category || 'Other')));
  const categories = [
    ...defaultOrder.filter(c => presentCategories.includes(c)),
    ...presentCategories.filter(c => !defaultOrder.includes(c)),
  ];

  const currentRegionObj = allRegions.find(r => r.name === selectedRegion) || { name: selectedRegion };

  return (
    <header className="h-14 bg-navy-900/95 backdrop-blur border-b border-white/5 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-[5000]">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-200 hidden md:block">{title}</h2>

      {/* Pan-India Region selector */}
      <div className="relative z-[5001]" ref={dropdownRef}>
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
          <div className="absolute top-full mt-2 left-0 w-80 max-h-[480px] flex flex-col bg-navy-900 border border-blue-500/40 rounded-xl shadow-2xl z-[9999] overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header & Search */}
            <div className="p-2.5 border-b border-white/10 bg-navy-950/70">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <MapPin size={11} /> Select Indian Region
                </span>
                <span className="text-[10px] text-gray-400">{allRegions.length} Hotspots</span>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search state, city (e.g. Hyderabad, Kerala, Wayanad)..."
                  className="w-full pl-7 pr-7 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  autoFocus
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Region List */}
            <div className="overflow-y-auto flex-1 p-1.5 space-y-2">
              {filteredRegions.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  <p className="font-semibold text-gray-300 mb-1">No matching region found</p>
                  <p className="text-[11px] text-gray-500">Try searching "Kerala", "Telangana", "Odisha", "Assam" or "All India"</p>
                </div>
              ) : query ? (
                /* Flat search result view when user is searching */
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    {filteredRegions.length} Search {filteredRegions.length === 1 ? 'Result' : 'Results'}
                  </div>
                  {filteredRegions.map(r => {
                    const isSelected = r.name === selectedRegion;
                    return (
                      <button
                        key={r.name}
                        onClick={() => {
                          setRegion(r);
                          setShowRegion(false);
                          setSearchFilter('');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                          isSelected
                            ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                            : 'text-gray-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                          <div className="truncate">
                            <p className="leading-tight font-medium text-gray-100 truncate">{r.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {r.category || 'Region'} · {r.state || 'India'}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check size={13} className="text-blue-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Categorized view when not searching */
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
                  setSearchFilter('');
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


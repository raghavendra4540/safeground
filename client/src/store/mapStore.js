import { create } from 'zustand';

const useMapStore = create((set) => ({
  activeLayer: 'composite',
  selectedSettlement: null,
  selectedSafeSite: null,
  mapCenter: [17.385, 78.486],
  mapZoom: 7,
  showSafeSites: true,
  showSettlements: true,
  showHazardZones: true,
  showRoutes: false,
  isScanning: false,

  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setSelectedSettlement: (s) => set({ selectedSettlement: s }),
  setSelectedSafeSite: (s) => set({ selectedSafeSite: s }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  toggleSafeSites: () => set((s) => ({ showSafeSites: !s.showSafeSites })),
  toggleSettlements: () => set((s) => ({ showSettlements: !s.showSettlements })),
  toggleHazardZones: () => set((s) => ({ showHazardZones: !s.showHazardZones })),
  setShowRoutes: (v) => set({ showRoutes: v }),
  setScanning: (v) => set({ isScanning: v }),
}));

export default useMapStore;

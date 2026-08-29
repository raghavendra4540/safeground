import { create } from 'zustand';
import api from '../services/api.js';
import useMapStore from './mapStore.js';

export const PAN_INDIA_REGIONS = [
  { name: 'All India', state: 'India', center: [22.5937, 78.9629], zoom: 5, category: 'National' },
  { name: 'Telangana', state: 'Telangana', center: [17.85, 79.10], zoom: 7, category: 'South India' },
  { name: 'Kerala', state: 'Kerala', center: [10.25, 76.45], zoom: 8, category: 'South India' },
  { name: 'Odisha', state: 'Odisha', center: [20.30, 85.80], zoom: 7, category: 'East & Coastal' },
  { name: 'Assam', state: 'Assam', center: [26.20, 92.90], zoom: 7, category: 'North East' },
  { name: 'Uttarakhand', state: 'Uttarakhand', center: [30.20, 79.20], zoom: 8, category: 'Himalayan & North' },
  { name: 'Himachal Pradesh', state: 'Himachal Pradesh', center: [31.85, 77.15], zoom: 8, category: 'Himalayan & North' },
  { name: 'Maharashtra', state: 'Maharashtra', center: [18.90, 74.50], zoom: 7, category: 'West India' },
  { name: 'Gujarat', state: 'Gujarat', center: [22.80, 71.20], zoom: 7, category: 'West India' },
  { name: 'Tamil Nadu', state: 'Tamil Nadu', center: [11.12, 78.65], zoom: 7, category: 'South India' },
  { name: 'Bihar', state: 'Bihar', center: [25.65, 85.80], zoom: 7, category: 'East & Central' },
  { name: 'West Bengal', state: 'West Bengal', center: [22.98, 87.85], zoom: 7, category: 'East & Coastal' },
  { name: 'Andhra Pradesh', state: 'Andhra Pradesh', center: [15.91, 80.00], zoom: 7, category: 'South India' },
  { name: 'Rajasthan', state: 'Rajasthan', center: [26.90, 73.00], zoom: 7, category: 'West India' },
  { name: 'Delhi NCR', state: 'Delhi', center: [28.61, 77.20], zoom: 10, category: 'Himalayan & North' },
  { name: 'Karnataka', state: 'Karnataka', center: [14.50, 75.70], zoom: 7, category: 'South India' },
];

const useDashboardStore = create((set, get) => ({
  overview: null,
  riskSummary: null,
  loading: false,
  lastFetched: null,
  selectedRegion: 'All India',
  regions: PAN_INDIA_REGIONS,

  fetchRegions: async () => {
    try {
      const res = await api.get('/regions');
      if (res.data?.success && res.data.data?.length > 0) {
        const mapped = res.data.data.map(r => ({
          ...r,
          center: [r.center?.lat || 22.5937, r.center?.lng || 78.9629],
          zoom: r.defaultZoom || 7,
        }));
        set({ regions: mapped });
      }
    } catch {
      // Fallback to PAN_INDIA_REGIONS
    }
  },

  fetchOverview: async (targetRegion) => {
    const regionToFetch = targetRegion || get().selectedRegion || 'All India';
    set({ loading: true });
    try {
      const queryParam = regionToFetch === 'All India' ? '' : `?region=${encodeURIComponent(regionToFetch)}`;
      const [ov, rs] = await Promise.all([
        api.get(`/dashboard/overview${queryParam}`),
        api.get(`/dashboard/risk-summary${queryParam}`),
      ]);
      set({
        overview: ov.data.data,
        riskSummary: rs.data.data,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch {
      set({ loading: false });
    }
  },

  setRegion: (regionInput) => {
    let regionName = 'All India';
    let regionObj = null;

    if (typeof regionInput === 'string') {
      regionName = regionInput;
      regionObj = get().regions.find(
        r => r.name.toLowerCase() === regionInput.toLowerCase() ||
             r.state?.toLowerCase() === regionInput.toLowerCase()
      ) || PAN_INDIA_REGIONS.find(
        r => r.name.toLowerCase() === regionInput.toLowerCase() ||
             r.state?.toLowerCase() === regionInput.toLowerCase()
      );
    } else if (regionInput && typeof regionInput === 'object') {
      regionName = regionInput.name;
      regionObj = regionInput;
    }

    set({ selectedRegion: regionName });

    // Update map camera smoothly
    if (regionObj && regionObj.center) {
      useMapStore.getState().setMapCenter(regionObj.center);
      useMapStore.getState().setMapZoom(regionObj.zoom || (regionName === 'All India' ? 5 : 7));
    }

    // Re-fetch overview and risk summary
    get().fetchOverview(regionName);
  },
}));

export default useDashboardStore;


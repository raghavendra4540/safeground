import { create } from 'zustand';
import api from '../services/api.js';
import useMapStore from './mapStore.js';

export const PAN_INDIA_REGIONS = [
  { name: 'All India', state: 'India', keywords: 'india national entire country all overview', center: [22.5937, 78.9629], zoom: 5, category: 'National' },
  { name: 'Telangana', state: 'Telangana', keywords: 'hyderabad secunderabad warangal godavari krishna bhadrachalam telangana', center: [17.85, 79.10], zoom: 7, category: 'South India' },
  { name: 'Kerala', state: 'Kerala', keywords: 'kochi wayanad idukki kuttanad trivandrum munnar calicut kerala', center: [10.25, 76.45], zoom: 8, category: 'South India' },
  { name: 'Odisha', state: 'Odisha', keywords: 'bhubaneswar puri paradip mahanadi cyclone coastal gopalpur odisha orissa', center: [20.30, 85.80], zoom: 7, category: 'East & Coastal' },
  { name: 'Assam', state: 'Assam', keywords: 'guwahati majuli brahmaputra barak dispur silchar flood erosion assam north east', center: [26.20, 92.90], zoom: 7, category: 'North East' },
  { name: 'Uttarakhand', state: 'Uttarakhand', keywords: 'dehradun joshimath rishikesh kedarnath chamoli alaknanda landslide uttarakhand himalayas', center: [30.20, 79.20], zoom: 8, category: 'Himalayan & North' },
  { name: 'Himachal Pradesh', state: 'Himachal Pradesh', keywords: 'shimla manali kullu beas dharamsala cloudburst landslide himachal', center: [31.85, 77.15], zoom: 8, category: 'Himalayan & North' },
  { name: 'Maharashtra', state: 'Maharashtra', keywords: 'mumbai pune chiplun konkan irshalwadi ratnagiri raigad flood maharashtra', center: [18.90, 74.50], zoom: 7, category: 'West India' },
  { name: 'Gujarat', state: 'Gujarat', keywords: 'ahmedabad surat kutch morbi gandhinagar cyclone storm gujarat', center: [22.80, 71.20], zoom: 7, category: 'West India' },
  { name: 'Tamil Nadu', state: 'Tamil Nadu', keywords: 'chennai coimbatore madurai coromandel delta cauvery cyclone tamil nadu', center: [11.12, 78.65], zoom: 7, category: 'South India' },
  { name: 'Bihar', state: 'Bihar', keywords: 'patna kosi ganga bhagalpur muzaffarpur north bihar flood bihar', center: [25.65, 85.80], zoom: 7, category: 'East & Central' },
  { name: 'West Bengal', state: 'West Bengal', keywords: 'kolkata sundarbans hooghly howrah darjeeling coastal west bengal bengal', center: [22.98, 87.85], zoom: 7, category: 'East & Coastal' },
  { name: 'Andhra Pradesh', state: 'Andhra Pradesh', keywords: 'visakhapatnam vizag amaravati vijayawada godavari krishna cyclone andhra pradesh', center: [15.91, 80.00], zoom: 7, category: 'South India' },
  { name: 'Rajasthan', state: 'Rajasthan', keywords: 'jaipur thar desert barmer churu jodhpur bikaner extreme heat rajasthan', center: [26.90, 73.00], zoom: 7, category: 'West India' },
  { name: 'Delhi NCR', state: 'Delhi', keywords: 'delhi new delhi noida gurugram yamuna floodplain heat ncr', center: [28.61, 77.20], zoom: 10, category: 'Himalayan & North' },
  { name: 'Karnataka', state: 'Karnataka', keywords: 'bengaluru bangalore kodagu coorg mangalore coastal landslide karnataka', center: [14.50, 75.70], zoom: 7, category: 'South India' },
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
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const mapped = res.data.data.map(r => {
          const fallback = PAN_INDIA_REGIONS.find(p => p.name.toLowerCase() === r.name.toLowerCase()) || {};
          return {
            ...r,
            category: r.category || fallback.category || 'Other',
            keywords: `${r.name} ${r.state || ''} ${r.description || ''} ${fallback.keywords || ''}`.toLowerCase(),
            center: [r.center?.lat || fallback.center?.[0] || 22.5937, r.center?.lng || fallback.center?.[1] || 78.9629],
            zoom: r.defaultZoom || fallback.zoom || 7,
          };
        });
        set({ regions: mapped.length > 0 ? mapped : PAN_INDIA_REGIONS });
      }
    } catch {
      set({ regions: PAN_INDIA_REGIONS });
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


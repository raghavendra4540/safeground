import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import User from '../models/User.js';
import Region from '../models/Region.js';
import Settlement from '../models/Settlement.js';
import SafeSite from '../models/SafeSite.js';
import HazardZone from '../models/HazardZone.js';
import Report from '../models/Report.js';
import { regionsData } from './regionsData.js';
import { allSettlementsData, allSafeSitesData, allHazardZonesData } from './panIndiaData.js';

export const seedDatabase = async ({ clear = true } = {}) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
    console.log('✅ MongoDB ready for seeding');

    // Clear existing data if requested
    if (clear) {
      await Promise.all([
        User.deleteMany({}),
        Region.deleteMany({}),
        Settlement.deleteMany({}),
        SafeSite.deleteMany({}),
        HazardZone.deleteMany({}),
        Report.deleteMany({}),
      ]);
      console.log('🗑️  Cleared existing data');
    }

    // Seed Users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@hazardshield.ai',
        password: await bcrypt.hash('Demo@123', 12),
        role: 'admin',
      },
      {
        name: 'Analyst Singh',
        email: 'analyst@hazardshield.ai',
        password: await bcrypt.hash('Demo@123', 12),
        role: 'analyst',
      },
      {
        name: 'Viewer Rao',
        email: 'viewer@hazardshield.ai',
        password: await bcrypt.hash('Demo@123', 12),
        role: 'viewer',
      },
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed Regions
    const regions = await Region.insertMany(regionsData.map(r => ({ ...r, isDemo: true })));
    console.log(`✅ Seeded ${regions.length} regions across India`);

    const regionMap = new Map();
    regions.forEach(r => regionMap.set(r.name.toLowerCase(), r._id));
    const defaultRegionId = regions[0]._id;

    // Seed Settlements
    const settlementsWithRegion = allSettlementsData.map(s => {
      const regId = regionMap.get((s.regionName || '').toLowerCase()) || defaultRegionId;
      return {
        ...s,
        region: regId,
        totalVulnerable: (s.children || 0) + (s.elderly || 0) + (s.disabled || 0) + (s.pregnantWomen || 0),
      };
    });
    const settlements = await Settlement.insertMany(settlementsWithRegion);
    console.log(`✅ Seeded ${settlements.length} settlements across India`);

    // Seed Safe Sites
    const safeSitesWithRegion = allSafeSitesData.map(s => {
      const regId = regionMap.get((s.regionName || '').toLowerCase()) || defaultRegionId;
      return {
        ...s,
        region: regId,
      };
    });
    const safeSites = await SafeSite.insertMany(safeSitesWithRegion);
    console.log(`✅ Seeded ${safeSites.length} safe sites across India`);

    // Seed Hazard Zones
    const hazardsWithRegion = allHazardZonesData.map(h => {
      const regId = regionMap.get((h.regionName || '').toLowerCase()) || defaultRegionId;
      return {
        ...h,
        region: regId,
      };
    });
    const hazards = await HazardZone.insertMany(hazardsWithRegion);
    console.log(`✅ Seeded ${hazards.length} hazard zones across India`);

    // Seed Reports
    await Report.insertMany([
      {
        title: 'Telangana Regional Multi-Hazard Assessment 2025',
        type: 'risk_assessment',
        region: 'Telangana',
        riskLevel: 'CRITICAL',
        status: 'published',
        content: {
          executiveSummary: 'Telangana faces compound multi-hazard exposure from seasonal river flooding, extreme heatwaves, and cyclonic rainfall. An estimated 86,920 residents across 11 critical hazard polygons require priority intervention.',
          riskAssessment: 'Composite GIS risk scoring across 30 monitored settlements identifies 8 CRITICAL settlements (34,140 residents in urgent priority) and 12 HIGH risk settlements. Primary hazard drivers include Krishna-Godavari flood plains, Mahabubnagar heat corridors, and coastal-fringe cyclonic gusts.',
          criticalSettlements: ['Rampur Colony', 'Nandigama Hamlet', 'Bhadrachalam Riverside', 'Suryapet Outskirts', 'Miryalaguda Basin'],
          recommendedRelocations: ['Rampur Colony → Green Valley Zone (1,850 people)', 'Nandigama Hamlet → North Ridge Zone (1,850 people)', 'Bhadrachalam → Eastern Highlands (3,560 people)'],
          safeSites: ['Green Valley Resettlement Zone (4,600 available)', 'North Ridge Shelter Zone (5,100 available)', 'Hilltop Community Zone (2,400 available)'],
          infrastructureGaps: ['Inadequate evacuation road networks in eastern sectors', 'Limited regional healthcare surge capacity', 'Water supply constraints in 6 low-lying settlements'],
          immediateActions: ['Activate early warning sirens in Nandigama and Bhadrachalam', 'Pre-position emergency response vehicles at designated clusters', 'Issue evacuation advisories for active flood-zone settlements'],
          longTermRecommendations: ['Develop permanent infrastructure at top-tier safe host sites', 'Construct elevated access corridors for flood-prone communities', 'Conduct community evacuation preparedness drills'],
        },
        metadata: { populationAtRisk: 86920, criticalZones: 11, safeCapacity: 47830, confidence: 95 },
        generatedBy: 'SafeGround AI v1.0',
        createdBy: users[0]._id,
      },
      {
        title: 'Monsoon Season Proactive Relocation Strategy',
        type: 'relocation_strategy',
        region: 'Telangana',
        riskLevel: 'HIGH',
        status: 'published',
        content: {
          executiveSummary: 'Proactive relocation logistics and capacity allocation for 34,140 urgent priority residents across critical flood and slide hazard zones.',
          riskAssessment: 'Carrying-capacity analysis across 15 candidate host zones confirms 47,830 available net capacity, fully sufficient to absorb urgent relocation demand without overcrowding host communities.',
          criticalSettlements: ['Rampur Colony', 'Lakshmipur Village', 'Khammam Lowland', 'Nalgonda Riverside'],
          recommendedRelocations: ['Phase 1: 8 CRITICAL settlements (34,140 people) before peak monsoon', 'Phase 2: 12 HIGH monitoring settlements as buffer'],
          safeSites: ['Green Valley Zone', 'North Ridge Zone', 'Pragathi Nagar Zone', 'Hilltop Community Zone'],
          infrastructureGaps: ['Transport fleet requirement: 180 bus/truck units', 'Temporary shelter reception deficit: 1,200 modular units'],
          immediateActions: ['Issue proactive relocation advisories for urgent settlements', 'Coordinate district transport routes avoiding flood polygons', 'Prepare reception logistics at designated host sites'],
          longTermRecommendations: ['Develop permanent flood-resilient housing in host communities', 'Install IoT flood depth telemetry for real-time monitoring'],
        },
        metadata: { populationAtRisk: 86920, criticalZones: 11, safeCapacity: 47830, confidence: 92 },
        generatedBy: 'SafeGround AI v1.0',
        createdBy: users[0]._id,
      },
      {
        title: 'Emergency Host Site Carrying Capacity & Bottleneck Plan',
        type: 'emergency_shelter',
        region: 'Telangana',
        riskLevel: 'HIGH',
        status: 'published',
        content: {
          executiveSummary: 'Comprehensive carrying capacity check and resource bottleneck evaluation across 15 designated host sites.',
          riskAssessment: 'Total gross host site capacity is 65,000 with 17,170 current occupancy, leaving 47,830 net available capacity. Water supply and healthcare capacity remain the key constraint factors in 4 secondary host zones.',
          criticalSettlements: ['All 20 CRITICAL and HIGH settlements'],
          recommendedRelocations: ['Priority 1: Vulnerable populations (children, elderly, disabled, medical dependents)', 'Priority 2: General population by settlement risk score'],
          safeSites: ['All 15 designated safe sites activated with verified drinking water and road connectivity'],
          infrastructureGaps: ['Water tanker supply augmentation needed for North Ridge and Medak zones', 'Paramedic mobile teams: 25 additional staff required'],
          immediateActions: ['Mobilize medical mobile teams to top 5 safe sites', 'Deploy 220 transit vehicles for assisted community relocation', 'Establish field water filtration units at secondary host sites'],
          longTermRecommendations: ['Expand Green Valley and Hilltop zones with permanent clinics', 'Upgrade all-weather road access to western host sites'],
        },
        metadata: { populationAtRisk: 86920, criticalZones: 11, safeCapacity: 47830, confidence: 94 },
        generatedBy: 'SafeGround AI v1.0',
        createdBy: users[0]._id,
      },
      {
        title: 'Extreme Heatwave & Climate Resilience Plan',
        type: 'flood_preparedness',
        region: 'Telangana',
        riskLevel: 'HIGH',
        status: 'published',
        content: {
          executiveSummary: 'Heatwave vulnerability and mitigation strategy for vulnerable populations in south-central Telangana.',
          riskAssessment: 'Southern Telangana records summer temperatures exceeding 45°C. Over 28,000 residents in Mahabubnagar and Jadcherla corridors face elevated heat risk with limited cooling infrastructure.',
          criticalSettlements: ['Mahabubnagar Plains', 'Jadcherla Drought Zone', 'Narayanpet Market Area'],
          recommendedRelocations: ['Temporary seasonal shelter for elderly and children in elevated host zones during peak heat months'],
          safeSites: ['Elevated host sites above 500m elevation with established tree canopy and power backups'],
          infrastructureGaps: ['Cooling center deficit: 8 centers needed', 'Drinking water replenishment critical in 4 rural settlements'],
          immediateActions: ['Activate public cooling stations in high-heat settlements', 'Distribute hydration kits and electrolytic solutions', 'Issue heat warning alerts through community channels'],
          longTermRecommendations: ['Implement urban greening and tree canopy programs', 'Install solar-powered cooling and water chilling units in 10 priority centers'],
        },
        metadata: { populationAtRisk: 28400, criticalZones: 4, safeCapacity: 14500, confidence: 91 },
        generatedBy: 'SafeGround AI v1.0',
        createdBy: users[0]._id,
      },
    ]);
    console.log(`✅ Seeded 4 reports`);

    console.log('\n🎉 Database seeded successfully with SafeGround AI intelligence!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo credentials:');
    console.log('  Admin:    admin@hazardshield.ai / Demo@123');
    console.log('  Analyst:  analyst@hazardshield.ai / Demo@123');
    console.log('  Viewer:   viewer@hazardshield.ai / Demo@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return { users, regions, settlements, safeSites, hazards };
  } catch (err) {
    console.error('❌ Seed failed:', err);
    throw err;
  }
};

// Check if run directly from CLI
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('seed.js') ||
  process.argv[1].endsWith('seed')
);

if (isDirectRun) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}


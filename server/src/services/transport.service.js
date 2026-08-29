import { TRANSPORT } from '../utils/constants.js';
import { calculateDistance } from '../utils/calculateDistance.js';

/**
 * Transportation Cost Estimation Engine
 * NOTE: All values are estimated planning figures, not actual quotes
 */
export const estimateTransportCost = (population, distance, options = {}) => {
  const {
    vehicleCapacity = TRANSPORT.vehicleCapacity,
    fuelRate = TRANSPORT.fuelRatePerKm,
    laborCost = TRANSPORT.laborCostPerVehicle,
    avgSpeed = TRANSPORT.avgSpeedKmh,
  } = options;

  const vehiclesRequired = Math.ceil(population / vehicleCapacity);
  const tripsRequired = Math.ceil(population / (vehiclesRequired * vehicleCapacity));
  const totalKm = distance * 2 * tripsRequired; // round trip × trips

  const fuelCost = Math.round(totalKm * vehiclesRequired * fuelRate);
  const laborTotal = Math.round(vehiclesRequired * tripsRequired * laborCost);
  const miscCost = Math.round((fuelCost + laborTotal) * 0.1); // 10% misc
  const totalCost = fuelCost + laborTotal + miscCost;

  const travelTimeHours = distance / avgSpeed;
  const totalOperationHours = Math.round(travelTimeHours * 2 * tripsRequired + tripsRequired * 0.5); // loading/unloading

  return {
    population,
    distance,
    vehiclesRequired,
    tripsRequired,
    fuelCost,
    laborCost: laborTotal,
    miscCost,
    totalCost,
    costPerPerson: Math.round(totalCost / population),
    travelTimeMinutes: Math.round(travelTimeHours * 60),
    totalOperationHours,
    disclaimer: 'These are estimated planning values. Actual costs depend on vehicle availability, fuel prices, and route conditions.',
  };
};

export const estimateTransportFromCoords = (population, sourceLat, sourceLng, destLat, destLng, options = {}) => {
  const distance = calculateDistance(sourceLat, sourceLng, destLat, destLng);
  return {
    ...estimateTransportCost(population, distance, options),
    distance,
  };
};

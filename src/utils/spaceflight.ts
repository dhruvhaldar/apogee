import { ValidationError } from './logger';

// Spaceflight Physics Utility Functions
// Constants based on Earth standard values

export const G = 6.67430e-11; // m^3 kg^-1 s^-2
export const EARTH_MASS = 5.972e24; // kg
export const EARTH_GM = G * EARTH_MASS; // m^3 s^-2 (Standard Gravitational Parameter)
// Precompute sqrt(GM) to optimize velocity and period calculations
const SQRT_EARTH_GM = Math.sqrt(EARTH_GM);
// Precompute constant factor for orbital period: 2*pi / sqrt(GM)
const ORBITAL_PERIOD_CONSTANT = (2 * Math.PI) / SQRT_EARTH_GM;

// ⚡ Performance: Precompute unit conversion constants to eliminate runtime divisions
const SQRT_EARTH_GM_KM = SQRT_EARTH_GM / 1000; // m/s to km/s
const ORBITAL_PERIOD_CONSTANT_MINUTES = ORBITAL_PERIOD_CONSTANT / 60; // seconds to minutes

export const EARTH_RADIUS = 6371000; // m
export const EARTH_RADIUS_KM = 6371; // km
export const STANDARD_GRAVITY = 9.80665; // m/s^2

// ⚡ Performance: Precompute combined constants for km-based orbital mechanics to eliminate scaling math during execution
// v_km = sqrt(GM / (r_km * 1000)) / 1000 => SQRT_EARTH_GM_KM / sqrt(1000) / sqrt(r_km)
const ORBITAL_VELOCITY_KM_CONSTANT = SQRT_EARTH_GM_KM / Math.sqrt(1000);
// T_min = (2*pi / sqrt(GM) / 60) * (r_km * 1000)^(3/2) => ORBITAL_PERIOD_CONSTANT_MINUTES * 1000 * sqrt(1000) * r_km^(3/2)
const ORBITAL_PERIOD_KM_CONSTANT = ORBITAL_PERIOD_CONSTANT_MINUTES * 1000 * Math.sqrt(1000);
export const SOLAR_CONSTANT = 1361; // W/m^2 (at 1 AU)

// Life support constants per person per day (kg)
// Based on NASA approximate values
const OXYGEN_PER_PERSON_DAY = 0.84;
const WATER_PER_PERSON_DAY = 3.5; // drinking + food prep + hygiene - recycling not accounted for here
const FOOD_PER_PERSON_DAY = 1.8;

/**
 * Validates that a value is a finite, non-negative number.
 * @param value The value to check.
 * @param name The name of the parameter for error reporting.
 */
function validateFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new ValidationError(`${name} must be a valid non-negative number`);
  }
}

/**
 * Calculates Delta-V using the Tsiolkovsky rocket equation.
 * @param isp Specific Impulse in seconds (s)
 * @param massInitial Initial mass of the rocket (kg)
 * @param massFinal Final mass of the rocket (dry mass) (kg)
 * @returns Delta-V in m/s
 */
export function calculateDeltaV(isp: number, massInitial: number, massFinal: number): number {
  validateFinite(isp, "Specific Impulse");
  validateFinite(massInitial, "Initial Mass");
  validateFinite(massFinal, "Final Mass");

  if (massInitial === 0 || massFinal === 0 || massFinal > massInitial) {
    throw new ValidationError("Invalid mass parameters");
  }
  // deltaV = Isp * g0 * ln(m0 / mf)
  return isp * STANDARD_GRAVITY * Math.log(massInitial / massFinal);
}

/**
 * Calculates orbital velocity for a circular orbit at a given altitude.
 * @param altitude Altitude above Earth's surface (km)
 * @returns Orbital velocity in km/s
 */
export function calculateOrbitalVelocity(altitude: number): number {
  validateFinite(altitude, "Altitude");
  const r_km = EARTH_RADIUS_KM + altitude;
  return ORBITAL_VELOCITY_KM_CONSTANT / Math.sqrt(r_km);
}

/**
 * Calculates orbital period for a circular orbit at a given altitude.
 * @param altitude Altitude above Earth's surface (km)
 * @returns Orbital period in minutes
 */
export function calculateOrbitalPeriod(altitude: number): number {
  validateFinite(altitude, "Altitude");
  const r_km = EARTH_RADIUS_KM + altitude;
  return ORBITAL_PERIOD_KM_CONSTANT * r_km * Math.sqrt(r_km);
}

/**
 * Calculates both orbital velocity and period for a circular orbit at a given altitude.
 * Optimization: Shares intermediate calculations (r, sqrt(r)) to avoid redundancy.
 * @param altitude Altitude above Earth's surface (km)
 * @returns Object containing velocity (km/s) and period (minutes)
 */
export function calculateOrbitalStats(altitude: number): { velocity: number; period: number } {
  validateFinite(altitude, "Altitude");
  const r_km = EARTH_RADIUS_KM + altitude;
  const sqrtR_km = Math.sqrt(r_km);

  return {
    velocity: ORBITAL_VELOCITY_KM_CONSTANT / sqrtR_km,
    period: ORBITAL_PERIOD_KM_CONSTANT * r_km * sqrtR_km
  };
}

interface Consumables {
  oxygen: number; // kg
  water: number; // kg
  food: number; // kg
  total: number; // kg
}

/**
 * Estimates daily consumable requirements for a crew.
 * Based on NASA approximate values per person per day.
 * @param crewSize Number of crew members
 * @param durationDays Mission duration in days
 * @returns Consumables breakdown in kg
 */
export function calculateConsumables(crewSize: number, durationDays: number): Consumables {
  validateFinite(crewSize, "Crew size");
  validateFinite(durationDays, "Duration");

  const personDays = crewSize * durationDays;
  const oxygen = personDays * OXYGEN_PER_PERSON_DAY;
  const water = personDays * WATER_PER_PERSON_DAY;
  const food = personDays * FOOD_PER_PERSON_DAY;

  return {
    oxygen,
    water,
    food,
    total: oxygen + water + food
  };
}

/**
 * Estimates mission cost based on payload mass and vehicle type.
 * Simplified model.
 * @param payloadMass Mass to orbit (kg)
 * @param costPerKg Cost per kg in USD (e.g., 2700 for Falcon 9, 50000 for Shuttle/SLS legacy estimate)
 * @returns Total estimated cost in USD
 */
export function calculateMissionCost(payloadMass: number, costPerKg: number): number {
  validateFinite(payloadMass, "Payload mass");
  validateFinite(costPerKg, "Cost per kg");
  return payloadMass * costPerKg;
}

/**
 * Calculates required solar panel area for a given power requirement.
 * @param powerWatts Required power in Watts
 * @param efficiency Solar panel efficiency (0.0 to 1.0)
 * @returns Area in square meters
 */
export function calculateSolarPanelArea(powerWatts: number, efficiency: number): number {
  validateFinite(powerWatts, "Power requirements");
  validateFinite(efficiency, "Efficiency");

  if (efficiency === 0 || efficiency > 1) {
    throw new ValidationError("Efficiency must be between 0 and 1");
  }
  // Power = Area * Efficiency * SolarConstant
  // Area = Power / (Efficiency * SolarConstant)
  return powerWatts / (efficiency * SOLAR_CONSTANT);
}

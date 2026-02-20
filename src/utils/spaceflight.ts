// Spaceflight Physics Utility Functions
// Constants based on Earth standard values

export const G = 6.67430e-11; // m^3 kg^-1 s^-2
export const EARTH_MASS = 5.972e24; // kg
export const EARTH_GM = G * EARTH_MASS; // m^3 s^-2 (Standard Gravitational Parameter)
export const EARTH_RADIUS = 6371000; // m
export const STANDARD_GRAVITY = 9.80665; // m/s^2
export const SOLAR_CONSTANT = 1361; // W/m^2 (at 1 AU)

/**
 * Validates that a value is a finite, non-negative number.
 * @param value The value to check.
 * @param name The name of the parameter for error reporting.
 */
function validateFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a valid non-negative number`);
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
    throw new Error("Invalid mass parameters");
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
  const r = EARTH_RADIUS + (altitude * 1000); // Convert km to m
  // v = sqrt(GM / r)
  const v = Math.sqrt(EARTH_GM / r);
  return v / 1000; // Convert m/s to km/s
}

/**
 * Calculates orbital period for a circular orbit at a given altitude.
 * @param altitude Altitude above Earth's surface (km)
 * @returns Orbital period in minutes
 */
export function calculateOrbitalPeriod(altitude: number): number {
  validateFinite(altitude, "Altitude");
  const r = EARTH_RADIUS + (altitude * 1000); // Convert km to m
  // T = 2 * pi * sqrt(r^3 / GM)
  const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / EARTH_GM);
  return periodSeconds / 60; // Convert seconds to minutes
}

interface Consumables {
  oxygen: number; // kg
  water: number; // kg
  food: number; // kg
  total: number; // kg
}

/**
 * Estimates daily consumable requirements for a crew.
 * Based on NASA approximate values per person per day:
 * - Oxygen: 0.84 kg
 * - Water: 3.5 kg (drinking + food prep + hygiene - recycling not accounted for here)
 * - Food: 1.8 kg
 * @param crewSize Number of crew members
 * @param durationDays Mission duration in days
 * @returns Consumables breakdown in kg
 */
export function calculateConsumables(crewSize: number, durationDays: number): Consumables {
  validateFinite(crewSize, "Crew size");
  validateFinite(durationDays, "Duration");

  const OXYGEN_PER_PERSON_DAY = 0.84;
  const WATER_PER_PERSON_DAY = 3.5;
  const FOOD_PER_PERSON_DAY = 1.8;

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
    throw new Error("Efficiency must be between 0 and 1");
  }
  // Power = Area * Efficiency * SolarConstant
  // Area = Power / (Efficiency * SolarConstant)
  return powerWatts / (efficiency * SOLAR_CONSTANT);
}

import {
  calculateDeltaV,
  calculateOrbitalVelocity,
  calculateOrbitalPeriod,
  calculateConsumables,
  calculateMissionCost,
  calculateSolarPanelArea
} from './spaceflight';

describe('Spaceflight Physics Calculations', () => {
  describe('calculateDeltaV', () => {
    test('Calculates Delta-V correctly for a given Isp and mass ratio', () => {
      // Example: Isp = 300, m0 = 1000, mf = 100
      // DeltaV = 300 * 9.80665 * ln(10) ~= 6774.2
      const deltaV = calculateDeltaV(300, 1000, 100);
      expect(deltaV).toBeCloseTo(6774.2, 1);
    });

    test('Throws error for invalid mass parameters', () => {
      expect(() => calculateDeltaV(300, 100, 1000)).toThrow('Invalid mass parameters');
      expect(() => calculateDeltaV(300, 0, 100)).toThrow('Invalid mass parameters');
      expect(() => calculateDeltaV(300, 1000, 0)).toThrow('Invalid mass parameters');
    });

    test('Throws error for invalid or non-finite inputs', () => {
       expect(() => calculateDeltaV(NaN, 1000, 100)).toThrow('Specific Impulse must be a valid non-negative number');
       expect(() => calculateDeltaV(300, NaN, 100)).toThrow('Initial Mass must be a valid non-negative number');
       expect(() => calculateDeltaV(-300, 1000, 100)).toThrow('Specific Impulse must be a valid non-negative number');
    });
  });

  describe('calculateOrbitalVelocity', () => {
    test('Calculates orbital velocity for LEO (400km)', () => {
      const v = calculateOrbitalVelocity(400);
      expect(v).toBeCloseTo(7.67, 1);
    });

    test('Throws error for negative or invalid altitude', () => {
      expect(() => calculateOrbitalVelocity(-100)).toThrow('Altitude must be a valid non-negative number');
      expect(() => calculateOrbitalVelocity(NaN)).toThrow('Altitude must be a valid non-negative number');
      expect(() => calculateOrbitalVelocity(Infinity)).toThrow('Altitude must be a valid non-negative number');
    });
  });

  describe('calculateOrbitalPeriod', () => {
    test('Calculates orbital period for LEO (400km)', () => {
      const p = calculateOrbitalPeriod(400);
      expect(p).toBeCloseTo(92.4, 1);
    });

    test('Throws error for negative or invalid altitude', () => {
      expect(() => calculateOrbitalPeriod(-100)).toThrow('Altitude must be a valid non-negative number');
      expect(() => calculateOrbitalPeriod(NaN)).toThrow('Altitude must be a valid non-negative number');
    });
  });

  describe('calculateConsumables', () => {
    test('Calculates consumables for 3 crew, 10 days', () => {
      const consumables = calculateConsumables(3, 10);
      expect(consumables.oxygen).toBeCloseTo(25.2);
      expect(consumables.water).toBeCloseTo(105);
      expect(consumables.food).toBeCloseTo(54);
      expect(consumables.total).toBeCloseTo(184.2);
    });

    test('Throws error for negative or invalid inputs', () => {
      expect(() => calculateConsumables(-1, 10)).toThrow('Crew size must be a valid non-negative number');
      expect(() => calculateConsumables(3, -5)).toThrow('Duration must be a valid non-negative number');
      expect(() => calculateConsumables(NaN, 10)).toThrow('Crew size must be a valid non-negative number');
    });
  });

  describe('calculateMissionCost', () => {
    test('Calculates cost for Falcon 9 launch', () => {
      const cost = calculateMissionCost(1000, 2700);
      expect(cost).toBe(2700000);
    });

    test('Throws error for negative or invalid inputs', () => {
      expect(() => calculateMissionCost(-100, 2700)).toThrow('Payload mass must be a valid non-negative number');
      expect(() => calculateMissionCost(1000, -100)).toThrow('Cost per kg must be a valid non-negative number');
      expect(() => calculateMissionCost(NaN, 2700)).toThrow('Payload mass must be a valid non-negative number');
    });
  });

  describe('calculateSolarPanelArea', () => {
    test('Calculates area for 10kW at 20% efficiency', () => {
      const area = calculateSolarPanelArea(10000, 0.2);
      expect(area).toBeCloseTo(36.73, 1);
    });

    test('Throws error for negative or invalid inputs', () => {
      expect(() => calculateSolarPanelArea(-100, 0.2)).toThrow('Power requirements must be a valid non-negative number');
      expect(() => calculateSolarPanelArea(10000, 1.5)).toThrow('Efficiency must be between 0 and 1');
      expect(() => calculateSolarPanelArea(10000, 0)).toThrow('Efficiency must be between 0 and 1');
      expect(() => calculateSolarPanelArea(NaN, 0.2)).toThrow('Power requirements must be a valid non-negative number');
    });
  });
});

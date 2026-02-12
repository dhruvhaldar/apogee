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
    });
  });

  describe('calculateOrbitalVelocity', () => {
    test('Calculates orbital velocity for LEO (400km)', () => {
      const v = calculateOrbitalVelocity(400);
      // v = sqrt(GM/r)
      // r = 6371 + 400 = 6771 km = 6771000 m
      // v = sqrt(3.986e14 / 6771000) ~= 7672 m/s = 7.672 km/s
      expect(v).toBeCloseTo(7.67, 1);
    });

    test('Throws error for negative altitude', () => {
      expect(() => calculateOrbitalVelocity(-100)).toThrow('Altitude must be non-negative');
    });
  });

  describe('calculateOrbitalPeriod', () => {
    test('Calculates orbital period for LEO (400km)', () => {
      const p = calculateOrbitalPeriod(400);
      // T = 2*pi*sqrt(r^3/GM)
      // r = 6771000 m
      // T ~= 5545 s ~= 92.4 min
      expect(p).toBeCloseTo(92.4, 1);
    });

    test('Throws error for negative altitude', () => {
      expect(() => calculateOrbitalPeriod(-100)).toThrow('Altitude must be non-negative');
    });
  });

  describe('calculateConsumables', () => {
    test('Calculates consumables for 3 crew, 10 days', () => {
      const consumables = calculateConsumables(3, 10);
      // O2: 3 * 10 * 0.84 = 25.2
      // Water: 3 * 10 * 3.5 = 105
      // Food: 3 * 10 * 1.8 = 54
      expect(consumables.oxygen).toBeCloseTo(25.2);
      expect(consumables.water).toBeCloseTo(105);
      expect(consumables.food).toBeCloseTo(54);
      expect(consumables.total).toBeCloseTo(184.2);
    });

    test('Throws error for negative crew size or duration', () => {
      expect(() => calculateConsumables(-1, 10)).toThrow('Crew size and duration must be non-negative');
      expect(() => calculateConsumables(3, -5)).toThrow('Crew size and duration must be non-negative');
    });
  });

  describe('calculateMissionCost', () => {
    test('Calculates cost for Falcon 9 launch', () => {
      const cost = calculateMissionCost(1000, 2700);
      expect(cost).toBe(2700000);
    });

    test('Throws error for negative payload or cost', () => {
      expect(() => calculateMissionCost(-100, 2700)).toThrow('Payload mass and cost must be non-negative');
      expect(() => calculateMissionCost(1000, -100)).toThrow('Payload mass and cost must be non-negative');
    });
  });

  describe('calculateSolarPanelArea', () => {
    test('Calculates area for 10kW at 20% efficiency', () => {
      // 10000 W / (0.2 * 1361) = 36.73 m^2
      const area = calculateSolarPanelArea(10000, 0.2);
      expect(area).toBeCloseTo(36.73, 1);
    });

    test('Throws error for negative power', () => {
      expect(() => calculateSolarPanelArea(-100, 0.2)).toThrow('Power requirements must be non-negative');
    });
  });
});

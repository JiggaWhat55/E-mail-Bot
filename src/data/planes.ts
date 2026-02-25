import type { PlaneType } from '../types';

export const PLANE_TYPES: PlaneType[] = [
  {
    id: 'prop-1',
    model: 'Cessna 408 SkyCourier',
    range: 1600,
    capacity: 19,
    speed: 370,
    purchaseCost: 5000000,
    operatingCost: 2,
  },
  {
    id: 'reg-1',
    model: 'ATR 72-600',
    range: 1500,
    capacity: 70,
    speed: 510,
    purchaseCost: 20000000,
    operatingCost: 5,
  },
  {
    id: 'nb-1',
    model: 'Airbus A320neo',
    range: 6300,
    capacity: 180,
    speed: 840,
    purchaseCost: 110000000,
    operatingCost: 12,
  },
  {
    id: 'wb-1',
    model: 'Boeing 787-9',
    range: 14000,
    capacity: 290,
    speed: 900,
    purchaseCost: 290000000,
    operatingCost: 25,
  },
  {
    id: 'vl-1',
    model: 'Airbus A380-800',
    range: 15000,
    capacity: 550,
    speed: 900,
    purchaseCost: 445000000,
    operatingCost: 50,
  },
];

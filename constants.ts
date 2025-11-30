import { Generator } from './types';

export const INITIAL_GENERATORS: Generator[] = [
  {
    id: 'stardust_collector',
    name: 'Stardust Collector',
    description: 'Automated drones that gather trace cosmic dust.',
    baseCost: 15,
    baseProduction: 0.5,
    count: 0,
    icon: '✨',
    color: 'text-yellow-200',
  },
  {
    id: 'asteroid_miner',
    name: 'Asteroid Miner',
    description: 'Drills extracting heavy metals from space rocks.',
    baseCost: 100,
    baseProduction: 4,
    count: 0,
    icon: '🪨',
    color: 'text-gray-400',
  },
  {
    id: 'nebula_condenser',
    name: 'Nebula Condenser',
    description: 'Compresses gas clouds into tangible matter.',
    baseCost: 1100,
    baseProduction: 22,
    count: 0,
    icon: '🌫️',
    color: 'text-purple-400',
  },
  {
    id: 'star_forge',
    name: 'Star Forge',
    description: 'A megastructure that births stars to harvest fusion byproducts.',
    baseCost: 12000,
    baseProduction: 95,
    count: 0,
    icon: '☀️',
    color: 'text-orange-400',
  },
  {
    id: 'black_hole_siphon',
    name: 'Black Hole Siphon',
    description: 'Extracts matter from the event horizon of singularites.',
    baseCost: 130000,
    baseProduction: 450,
    count: 0,
    icon: '⚫',
    color: 'text-indigo-500',
  },
  {
    id: 'galactic_engine',
    name: 'Galactic Engine',
    description: 'Moves entire galaxies to collide and harvest the debris.',
    baseCost: 1400000,
    baseProduction: 2800,
    count: 0,
    icon: '🌌',
    color: 'text-pink-500',
  },
];

export const SAVE_KEY = 'cosmic_genesis_save_v1';
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
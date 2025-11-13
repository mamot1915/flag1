import type { Country } from './types';
import { 
  SaudiFlag, CNFlag, GermanyFlag, IRFlag, FranceFlag, IndiaFlag, USFlag, BrazilFlag, CanadaFlag,
  RussiaFlag, GBFlag, JapanFlag, ItalyFlag, SKFlag, AUFlag, ESFlag
} from './components/icons/Flags';

export const COUNTRIES: Country[] = [
  { 
    code: 'SA', 
    name: 'Saudi Arabia', 
    FlagComponent: SaudiFlag, 
    barColor: 'bg-green-700' 
  },
  { 
    code: 'CN', 
    name: 'China', 
    FlagComponent: CNFlag, 
    barColor: 'bg-red-600' 
  },
  {
    code: 'IR',
    name: 'Iran',
    FlagComponent: IRFlag,
    barColor: 'bg-blue-600'
  },
  { 
    code: 'US', 
    name: 'United States', 
    FlagComponent: USFlag, 
    barColor: 'bg-blue-800' 
  },
  { 
    code: 'DE', 
    name: 'Germany', 
    FlagComponent: GermanyFlag, 
    barColor: 'bg-red-600' 
  },
  { 
    code: 'IN', 
    name: 'India', 
    FlagComponent: IndiaFlag, 
    barColor: 'bg-orange-500'
  },
  {
    code: 'CA',
    name: 'Canada',
    FlagComponent: CanadaFlag,
    barColor: 'bg-red-600'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    FlagComponent: GBFlag,
    barColor: 'bg-blue-800'
  },
  {
    code: 'KR',
    name: 'South Korea',
    FlagComponent: SKFlag,
    barColor: 'bg-blue-800'
  }
];

export const PRELOADED_EMOJIS: string[] = [];

export const SELECTABLE_COLORS: string[] = [
  'bg-red-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-yellow-500',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-gray-800'
];

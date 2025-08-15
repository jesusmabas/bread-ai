import React from 'react';

export enum FlourType {
  BREAD = 'bread',
  HIGH_GLUTEN = 'high-gluten',
  ALL_PURPOSE = 'all-purpose',
  WHOLE_WHEAT = 'whole-wheat',
  PIZZA_00 = 'pizza-00',
}

export enum YeastType {
  INSTANT = 'instant',
  ACTIVE_DRY = 'active-dry',
  FRESH = 'fresh',
  SOURDOUGH = 'sourdough',
}

export enum StarterActivity {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast',
}

export enum OvenProfile {
    STANDARD_HOME = 'standard-home',
    CONVECTION = 'convection',
    BAKING_STEEL = 'baking-steel',
    BAKING_STONE = 'baking-stone',
    WOOD_FIRED = 'wood-fired',
}

export enum PrefermentType {
  POOLISH = 'poolish',
  BIGA = 'biga',
}

export interface Preferment {
  enabled: boolean;
  type: PrefermentType;
  flourPct: number; // % of total flour
  hydration: number; // % hydration of the preferment
  yeastPct: number; // % of yeast on preferment's flour
  fermentationHours: number;
  fermentationTemp: number;
}

export interface ColdFermentation {
  enabled: boolean;
  durationHours: number;
  temperature: number; // °C
}

export interface BakingParameters {
  flourAmount: number;
  flourType: FlourType;
  hydration: number;
  yeastAmount: number;
  yeastType: YeastType;
  sourdoughStarterActivity?: StarterActivity;
  salt: number;
  sugar: number;
  fat: number;
  temperature: number;
  q10: number;
  t_ref: number;
  ovenProfile: OvenProfile;
  preferment: Preferment;
  coldFermentation: ColdFermentation;
  bakeTimeTarget: string; // ISO format string
}

export interface FermentationTime {
  duration: string;
  notes: string;
}

export interface ColdFermentationInfo {
    suitability: boolean;
    description: string;
    timelineAdjustments: string;
}

export interface AIAnalysisResult {
  overview: string;
  bulkFermentation: FermentationTime;
  finalProof: FermentationTime;
  coldProof?: FermentationTime;
  coldFermentation?: ColdFermentationInfo;
  timeline: {
    step: string;
    details: string;
    startTime?: string;
    endTime?: string;
  }[];
  proTips: string[];
}


export interface AIPlanResult {
    bakingParameters: Omit<BakingParameters, 'flourAmount' | 'q10' | 't_ref'>;
    yieldParameters: Pick<YieldParameters, 'numPieces' | 'pieceWeight'>;
    analysis: AIAnalysisResult;
}


export enum BakingStyle {
  COUNTRY_LOAF = 'country-loaf',
  BAGUETTE = 'baguette',
  CIABATTA = 'ciabatta',
  WHOLE_WHEAT = 'whole-wheat',
  FOCACCIA = 'focaccia',
  NEAPOLITAN_PIZZA = 'neapolitan-pizza',
  ROMAN_PIZZA = 'roman-pizza',
  NY_PIZZA = 'ny-pizza',
  PAN_PIZZA = 'pan-pizza',
}

export interface YieldParameters {
    mode: 'weight' | 'shape';
    numPieces: number;
    pieceWeight: number; // for weight mode
    shape: 'round' | 'rect'; // for shape mode
    diameter: number; // for round shape
    length: number; // for rect shape
    width: number; // for rect shape
    thicknessFactor: number; // g/cm^2
}

export interface Preset extends Partial<BakingParameters> {
    name: string;
    description: string;
    icon: React.FC<{className?: string}>;
    pieceWeight?: number;
    numPieces?: number;
}

export type UnitSystem = 'metric' | 'imperial';

export enum GuidedCrumb {
  TIGHT = 'tight',
  MEDIUM = 'medium',
  AIRY = 'airy',
}

export enum GuidedCrust {
  SOFT = 'soft',
  CRISPY = 'crispy',
  RUSTIC = 'rustic',
}

export enum GuidedLeavening {
  QUICK_YEAST = 'quick-yeast',
  BALANCED = 'balanced',
  SLOW_SOURDOUGH = 'slow-sourdough',
}

export interface GuidedChoices {
    crumb: GuidedCrumb;
    crust: GuidedCrust;
    leavening: GuidedLeavening;
}

export interface SavedRecipe {
    id: string;
    name: string;
    notes: string;
    createdAt: string;
    params: BakingParameters;
    yieldParams: YieldParameters;
    guidedChoices: GuidedChoices;
}
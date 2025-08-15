import {
  BakingParameters,
  FlourType,
  YeastType,
  StarterActivity,
} from '../types';

// Factors based on common baking principles and user-provided formula.
const FLOUR_FACTORS = {
  [FlourType.HIGH_GLUTEN]: 1.2,
  [FlourType.BREAD]: 1.0,
  [FlourType.ALL_PURPOSE]: 0.9,
  [FlourType.WHOLE_WHEAT]: 0.85,
  [FlourType.PIZZA_00]: 0.95, // Finely milled, ferments efficiently
};

const YEAST_TYPE_FACTORS = {
    [YeastType.INSTANT]: 1.0,
    [YeastType.ACTIVE_DRY]: 1.15, // Slower start, so needs slightly more time
    [YeastType.FRESH]: 1.0, // Potency difference is handled by normalizing the amount.
    [YeastType.SOURDOUGH]: 1.0, // Sourdough logic is handled separately
};

// These factors modify time. > 1 means slower, < 1 means faster.
const STARTER_ACTIVITY_FACTORS = {
    [StarterActivity.SLOW]: 1.2,
    [StarterActivity.NORMAL]: 1.0,
    [StarterActivity.FAST]: 0.8,
};

export interface CalculatedBakingMetrics {
  bulkFermentationHours: number;
  finalProofHours: number;
}


export const calculateBakingMetrics = (params: BakingParameters): CalculatedBakingMetrics => {
    const T_BASE_HOURS = 2.5; // 150 minutes for a standard loaf
    const T_REF_DEFAULT = 24; // Common reference temp for calculations if not provided

    // 1. Temperature Factor using Q10 model
    const tempFactor = Math.pow(params.q10, ((params.t_ref || T_REF_DEFAULT) - params.temperature) / 10);

    // 2. Leavening Factor
    let leaveningFactor: number;
    if (params.yeastType === YeastType.SOURDOUGH) {
        const SOURDOUGH_SQRT_SLOWDOWN_FACTOR = 8; 
        const baseAmountFactor = (1 / Math.sqrt(params.yeastAmount)) * SOURDOUGH_SQRT_SLOWDOWN_FACTOR;
        const activityFactor = STARTER_ACTIVITY_FACTORS[params.sourdoughStarterActivity!];
        leaveningFactor = baseAmountFactor * activityFactor;
    } else {
        let yeastPotencyAmount = params.yeastAmount;
        if (params.yeastType === YeastType.FRESH) {
            yeastPotencyAmount = params.yeastAmount / 3;
        }
        if (yeastPotencyAmount <= 0) yeastPotencyAmount = 0.001;
        const baseAmountFactor = 1 / Math.sqrt(yeastPotencyAmount);
        const typeFactor = YEAST_TYPE_FACTORS[params.yeastType];
        leaveningFactor = baseAmountFactor * typeFactor;
    }
    
    // 3. Flour Factor
    const flourFactor = FLOUR_FACTORS[params.flourType];

    // 4. Hydration Factor
    const hydrationFactor = Math.pow(0.98, (params.hydration - 65) / 5);

    // 5. Salt Factor
    const saltFactor = 1 + (params.salt - 2) * 0.05;

    // 6. Sugar Factor
    const sugarFactor = params.sugar <= 5
        ? 1 - params.sugar * 0.02
        : 1 + (params.sugar - 5) * 0.03;

    // 7. Fat Factor
    const fatFactor = 1 + params.fat * 0.02;
    
    // 8. Preferment factor (reduces bulk time)
    const prefermentFactor = params.preferment.enabled 
        ? 1 - (params.preferment.flourPct / 100) * 0.8 // 80% reduction based on % flour prefermented
        : 1;

    // Calculate Final Bulk Fermentation Time
    let bulkFermentationHours = T_BASE_HOURS *
        tempFactor *
        leaveningFactor *
        flourFactor *
        hydrationFactor *
        saltFactor *
        sugarFactor *
        fatFactor *
        prefermentFactor;

    // Final Proof is typically shorter, unless cold fermenting
    let finalProofHours: number;

    if(params.coldFermentation.enabled) {
        // Final proof is the warm up time, e.g. 2-3 hours.
        finalProofHours = 2.5; 
        
        // With cold ferment, bulk is often shorter
        bulkFermentationHours *= 0.7; 
    } else {
        finalProofHours = bulkFermentationHours * 0.75;
    }
    
    return {
      bulkFermentationHours,
      finalProofHours
    };
}
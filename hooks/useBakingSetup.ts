



import { useState, useMemo, useEffect } from 'react';
import {
  BakingParameters,
  YieldParameters,
  GuidedChoices,
  BakingStyle,
  UnitSystem,
  FlourType,
  YeastType,
  StarterActivity,
  OvenProfile,
  GuidedCrumb,
  GuidedCrust,
  GuidedLeavening,
  Preferment,
  ColdFermentation,
  PrefermentType,
  WorkSchedule,
} from '../types';
import { PRESETS, GUIDED_CRUMB_OPTIONS, GUIDED_CRUST_OPTIONS, GUIDED_LEAVENING_OPTIONS, FLOUR_OPTIONS, PREFERMENT_TYPE_OPTIONS } from '../constants';
import { ouncesToGrams, parseNumber } from '../utils';
import { useLocalization } from '../contexts/LocalizationContext';
import { TranslationKey } from '../i18n/locales';

const initialPreset = PRESETS[BakingStyle.COUNTRY_LOAF];
const { name, description, icon, pieceWeight, numPieces, ...initialBakingParams } = initialPreset;

const initialParams: BakingParameters = {
  flourAmount: 1000,
  temperature: 24,
  q10: 2.2,
  t_ref: 24,
  preferment: {
      enabled: false,
      type: PrefermentType.POOLISH,
      flourPct: 20,
      hydration: 100,
      yeastPct: 0.2,
      fermentationHours: 12,
      fermentationTemp: 22,
  },
  coldFermentation: {
      enabled: false,
      durationHours: 24,
      temperature: 4,
  },
  workSchedule: {
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
      days: [0, 1, 2, 3, 4, 5, 6],
  },
  bakeTimeTarget: '',
  ...initialBakingParams,
} as BakingParameters;

const initialYieldParams: YieldParameters = {
  mode: 'weight',
  numPieces: 1,
  pieceWeight: 900,
  shape: 'round',
  diameter: 30,
  length: 0,
  width: 0,
  thicknessFactor: 0.25
};

const initialGuidedChoices: GuidedChoices = {
  crumb: GuidedCrumb.MEDIUM,
  crust: GuidedCrust.CRISPY,
  leavening: GuidedLeavening.SLOW_SOURDOUGH,
};

export type CalculatorMode = 'ai' | 'formula';

export const useBakingSetup = () => {
  const { t } = useLocalization();
  const [params, setParams] = useState<BakingParameters>(initialParams);
  const [yieldParams, setYieldParams] = useState<YieldParameters>(initialYieldParams);
  const [guidedChoices, setGuidedChoices] = useState<GuidedChoices>(initialGuidedChoices);
  const [activePreset, setActivePreset] = useState<BakingStyle>(BakingStyle.COUNTRY_LOAF);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [mode, setMode] = useState<'simple' | 'pro'>('simple');
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('ai');


  useEffect(() => {
    let totalWeight = 0;
    if (yieldParams.mode === 'weight') {
      totalWeight = yieldParams.numPieces * yieldParams.pieceWeight;
    } else {
      let area = 0;
      if (yieldParams.shape === 'round') {
        area = Math.PI * Math.pow(yieldParams.diameter / 2, 2);
      } else {
        area = yieldParams.length * yieldParams.width;
      }
      totalWeight = yieldParams.numPieces * (area * yieldParams.thicknessFactor);
    }

    let totalPercentage = 1 + (params.hydration / 100) + (params.salt / 100) + (params.sugar / 100) + (params.fat / 100);
    
    // Leavening agent weight percentage
    if (params.yeastType === YeastType.SOURDOUGH) {
        // Sourdough starter is typically ~50% flour, 50% water. Its total weight is part of the dough.
        // It replaces some flour and water, so it's already accounted for in the hydration calculation.
        // But its total weight must be included in the total dough weight calculation.
        // Baker's percentage for starter is flour weight + water weight.
        totalPercentage += params.yeastAmount / 100;
    } else {
        totalPercentage += (params.yeastAmount / 100);
    }

    if (totalWeight <= 0 || totalPercentage <= 0.1) {
        setParams(p => ({ ...p, flourAmount: 0 }));
        return;
    }

    // Adjust for starter composition
    let flourAmount;
    if (params.yeastType === YeastType.SOURDOUGH) {
        // If starter is X% of flour weight, total weight is:
        // F + H*F + Salt*F + Starter*F = TotalWeight
        // F * (1 + H + Salt + Starter) = TotalWeight
        // Starter itself is 0.5F + 0.5W. Total hydration includes water from starter.
        // Total_Weight = F_total + W_total + Salt_total ...
        // F_total = F_new + F_starter = F_new + (Starter_percent * F_total * 0.5)
        // W_total = W_new + W_starter = W_new + (Starter_percent * F_total * 0.5)
        // Let's use the standard baker's math approach where starter is an ingredient.
        // Total % = 100% (flour) + hydration% + salt% + starter% ...
        // FlourAmount = TotalWeight / (Total % / 100)
        flourAmount = Math.round(totalWeight / totalPercentage);
    } else {
        flourAmount = Math.round(totalWeight / totalPercentage);
    }


    setParams(p => ({ ...p, flourAmount }));
  }, [yieldParams, params.hydration, params.salt, params.sugar, params.fat, params.yeastAmount, params.yeastType]);


  const handleParamChange = (field: keyof BakingParameters, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
    setActivePreset(null as any);
  };
  
  const handleAdvancedChange = (
      category: 'preferment' | 'coldFermentation',
      field: keyof Preferment | keyof ColdFermentation,
      value: any
  ) => {
      setParams(p => {
          const newParams = { ...p };
          const categoryParams = { ...newParams[category] };
          (categoryParams as any)[field] = value;
          (newParams as any)[category] = categoryParams;
          
          if(category === 'preferment' && field === 'type') {
             newParams.preferment.hydration = PREFERMENT_TYPE_OPTIONS[value as PrefermentType].defaultHydration;
          }

          return newParams;
      });
      setActivePreset(null as any);
  };

  const handleWorkScheduleChange = (field: keyof WorkSchedule, value: any) => {
      setParams(p => ({
          ...p,
          workSchedule: {
              ...p.workSchedule,
              [field]: value,
          },
      }));
      setActivePreset(null as any);
  };


  const handleSliderChange = (field: keyof BakingParameters, e: React.ChangeEvent<HTMLInputElement>) => {
    handleParamChange(field, parseFloat(e.target.value));
  };

  const handleSelectChange = (field: keyof BakingParameters, e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setActivePreset(null as any);
    if (field === 'yeastType') {
      const newYeastType = value as YeastType;
      if (newYeastType === YeastType.SOURDOUGH) {
        setParams(prev => ({ ...prev, yeastType: newYeastType, yeastAmount: 20, sourdoughStarterActivity: StarterActivity.NORMAL }));
      } else if (params.yeastType === YeastType.SOURDOUGH) {
        setParams(prev => ({ ...prev, yeastType: newYeastType, yeastAmount: 1 }));
      } else {
        setParams(prev => ({ ...prev, yeastType: newYeastType }));
      }
    } else {
      setParams(prev => ({ ...prev, [field]: value as any }));
    }
  };

  const handleYieldChange = (field: keyof YieldParameters, value: string | number) => {
    const numericValue = parseNumber(value);
    setActivePreset(null as any);
    if (unitSystem === 'imperial' && field === 'pieceWeight') {
        setYieldParams(prev => ({...prev, pieceWeight: ouncesToGrams(numericValue), mode: 'weight'}));
    } else {
        setYieldParams(prev => ({...prev, [field]: numericValue, mode: 'weight'}));
    }
  };

  const handlePresetSelect = (key: BakingStyle) => {
    setActivePreset(key);
    const { name, description, icon, pieceWeight, numPieces, ...bakingParams } = PRESETS[key];
    setParams(p => ({ 
        ...p, 
        ...bakingParams, 
        preferment: { ...p.preferment, enabled: false}, 
        coldFermentation: { ...p.coldFermentation, enabled: false },
        bakeTimeTarget: ''
    }));
    if (pieceWeight !== undefined && numPieces !== undefined) {
        setYieldParams(yp => ({ ...yp, mode: 'weight', pieceWeight, numPieces }));
    }
  };

  const handleGuidedSetupChange = (type: 'crumb' | 'crust' | 'leavening', value: GuidedCrumb | GuidedCrust | GuidedLeavening) => {
      setGuidedChoices(prev => ({ ...prev, [type]: value as any }));
      setActivePreset(null as any);
      
      let newParams: Partial<BakingParameters> = {};
      
      switch (type) {
          case 'crumb':
              newParams = GUIDED_CRUMB_OPTIONS[value as GuidedCrumb].params;
              break;
          case 'crust':
              newParams = GUIDED_CRUST_OPTIONS[value as GuidedCrust].params;
              break;
          case 'leavening':
              newParams = GUIDED_LEAVENING_OPTIONS[value as GuidedLeavening].params;
              break;
      }

      setParams(p => ({ ...p, ...newParams }));
  };

  const ingredientWeights = useMemo(() => {
    const totalFlour = params.flourAmount;
    if (!totalFlour || isNaN(totalFlour) || totalFlour <= 0) return null;

    let prefermentIngredients: { flour: number; water: number; yeast: number; total: number } | null = null;
    let finalDoughFlour = totalFlour;
    let finalDoughWater = totalFlour * (params.hydration / 100);
    
    if (params.preferment.enabled) {
        const flour = totalFlour * (params.preferment.flourPct / 100);
        const water = flour * (params.preferment.hydration / 100);
        // Yeast for preferment is calculated on preferment's flour, not total flour
        const yeast = flour * (params.preferment.yeastPct / 100);
        prefermentIngredients = {
            flour,
            water,
            yeast,
            total: flour + water + yeast
        };
        finalDoughFlour -= flour;
        finalDoughWater -= water;
    }

    const finalDoughSalt = totalFlour * (params.salt / 100);
    const finalDoughSugar = totalFlour * (params.sugar / 100);
    const finalDoughFat = totalFlour * (params.fat / 100);

    let finalDoughLeavening = 0;
    // This is for leavening added to the FINAL DOUGH, not what's in the preferment.
    if (params.yeastType === YeastType.SOURDOUGH) {
      // In a preferment context, this would be starter added to final dough.
      // If no preferment, it's the total starter.
      finalDoughLeavening = totalFlour * (params.yeastAmount / 100);
    } else {
      // Commercial yeast added to the final dough.
      finalDoughLeavening = totalFlour * (params.yeastAmount / 100);
    }

    const finalDoughWeight = finalDoughFlour + finalDoughWater + finalDoughSalt + finalDoughLeavening + finalDoughSugar + finalDoughFat + (prefermentIngredients?.total ?? 0);

    return { 
        preferment: prefermentIngredients,
        finalDough: {
            flour: finalDoughFlour,
            water: finalDoughWater,
            salt: finalDoughSalt,
            leavening: finalDoughLeavening,
            sugar: finalDoughSugar,
            fat: finalDoughFat,
        },
        total: finalDoughWeight,
    };
  }, [params]);

   const doughInsights = useMemo(() => {
        if (!ingredientWeights) return null;

        const totalFlour = params.flourAmount;
        const totalWater = totalFlour * (params.hydration / 100);
        const salt = totalFlour * (params.salt / 100);
        
        const { hydration, fat: fatPercent, flourType } = params;
        const warnings: string[] = [];

        // Validations & Warnings
        if (hydration > 85) {
            warnings.push(t('doughInsights.warnings.highHydration'));
        }
        if (params.salt > 3.5) {
            warnings.push(t('doughInsights.warnings.highSalt'));
        }
        if (params.yeastType === YeastType.SOURDOUGH && !params.preferment.enabled) {
            const waterInStarterAsPctOfTotalFlour = (params.yeastAmount / 2) / 100;
            const freshWaterAsPctOfTotalFlour = (hydration / 100) - waterInStarterAsPctOfTotalFlour;
            if (freshWaterAsPctOfTotalFlour < 0) {
                warnings.push(t('doughInsights.warnings.negativeWater'));
            }
        }
        if (ingredientWeights.finalDough.water < 0) {
            warnings.push(t("doughInsights.warnings.prefermentWater"))
        }
        if (params.coldFermentation.enabled && params.coldFermentation.durationHours > 72) {
            warnings.push(t("doughInsights.warnings.longColdFerment"));
        }

        // Final Salinity
        const finalSalinity = (salt / (totalFlour + totalWater)) * 100;
        let salinityAdviceKey: TranslationKey = 'doughInsights.salinity.normal';
        if (finalSalinity > 2.2 && (flourType === FlourType.PIZZA_00 || flourType === FlourType.HIGH_GLUTEN)) {
            salinityAdviceKey = 'doughInsights.salinity.high';
        } else if (finalSalinity < 1.8) {
             salinityAdviceKey = 'doughInsights.salinity.low';
        }

        const absorptionAdjustments: Partial<Record<FlourType, number>> = {
            [FlourType.WHOLE_WHEAT]: 10,
            [FlourType.HIGH_GLUTEN]: 2,
            [FlourType.BREAD]: 0,
            [FlourType.ALL_PURPOSE]: -5,
            [FlourType.PIZZA_00]: -5,
        };
        const apparentHydration = hydration - (absorptionAdjustments[flourType] || 0);
        let hydrationFeelAdviceKey: TranslationKey;
        if (apparentHydration > 80) {
            hydrationFeelAdviceKey = 'doughInsights.hydrationFeel.very_wet';
        } else if (apparentHydration > 72) {
            hydrationFeelAdviceKey = 'doughInsights.hydrationFeel.manageable';
        } else if (apparentHydration < 65) {
            hydrationFeelAdviceKey = 'doughInsights.hydrationFeel.firm';
        } else {
            hydrationFeelAdviceKey = 'doughInsights.hydrationFeel.balanced';
        }

        let extensibilityScore = 0;
        extensibilityScore += (hydration - 70) * 4;
        extensibilityScore += fatPercent * 5;
        if (flourType === FlourType.HIGH_GLUTEN || flourType === FlourType.BREAD) extensibilityScore -= 20;
        if (flourType === FlourType.ALL_PURPOSE || flourType === FlourType.PIZZA_00) extensibilityScore += 10;
        if (flourType === FlourType.WHOLE_WHEAT) extensibilityScore -= 10;
        if (params.preferment.enabled && params.preferment.type === PrefermentType.POOLISH) extensibilityScore += 20;
        if (params.preferment.enabled && params.preferment.type === PrefermentType.BIGA) extensibilityScore -= 15;


        let extensibilityAdviceKey: TranslationKey = 'doughInsights.extensibilityMessages.balanced';
        if (extensibilityScore > 40) extensibilityAdviceKey = 'doughInsights.extensibilityMessages.high';
        if (extensibilityScore < -40) extensibilityAdviceKey = 'doughInsights.extensibilityMessages.low';
        
        return {
            finalSalinity: finalSalinity,
            salinityAdvice: t(salinityAdviceKey),
            extensibilityScore: Math.max(-100, Math.min(100, extensibilityScore)),
            extensibilityAdvice: t(extensibilityAdviceKey),
            hydrationFeel: t(hydrationFeelAdviceKey),
            warnings,
        };
    }, [ingredientWeights, params, t]);

  return {
    params, setParams,
    yieldParams, setYieldParams,
    guidedChoices, setGuidedChoices,
    activePreset, setActivePreset,
    unitSystem, setUnitSystem,
    mode, setMode,
    calculatorMode, setCalculatorMode,
    handleParamChange,
    handleSliderChange,
    handleSelectChange,
    handleYieldChange,
    handlePresetSelect,
    handleGuidedSetupChange,
    handleAdvancedChange,
    handleWorkScheduleChange,
    ingredientWeights,
    doughInsights,
  };
};
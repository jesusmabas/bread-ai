import { useState } from 'react';
import { BakingParameters, AIAnalysisResult, YieldParameters, BakingStyle } from '../types';
import { getBakingAnalysis, getAIPlanFromQuery } from '../services/geminiService';
import { calculateBakingMetrics } from '../services/bakingCalculator';
import { TranslationKey } from '../i18n/locales';
import { formatHoursToRangeString } from '../utils';
import { CalculatorMode } from './useBakingSetup';

interface UseBakingPlannerProps {
    params: BakingParameters;
    setParams: React.Dispatch<React.SetStateAction<BakingParameters>>;
    setYieldParams: React.Dispatch<React.SetStateAction<YieldParameters>>;
    setActivePreset: React.Dispatch<React.SetStateAction<BakingStyle | null>>;
    language: 'en' | 'es';
    t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
    calculatorMode: CalculatorMode;
}

export const useBakingPlanner = ({
    params,
    setParams,
    setYieldParams,
    setActivePreset,
    language,
    t,
    calculatorMode
}: UseBakingPlannerProps) => {
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [naturalQuery, setNaturalQuery] = useState("");

    const handleCalculate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const metrics = calculateBakingMetrics(params);

            if (calculatorMode === 'ai') {
                const analysis = await getBakingAnalysis(params, metrics, language);
                setResult(analysis);
            } else {
                // Formula mode: Create a local result object
                const formulaResult: AIAnalysisResult = {
                    overview: t('results.formulaOverview'),
                    bulkFermentation: {
                        duration: formatHoursToRangeString(metrics.bulkFermentationHours),
                        notes: t('results.formulaNotes.bulk'),
                    },
                    finalProof: {
                        duration: formatHoursToRangeString(metrics.finalProofHours),
                        notes: t('results.formulaNotes.proof'),
                    },
                    timeline: [
                        { step: t('timeline.steps.mixing'), details: t('timeline.details.mixing') },
                        { step: t('timeline.steps.bulk'), details: t('timeline.details.bulk') },
                        { step: t('timeline.steps.shaping'), details: t('timeline.details.shaping') },
                        { step: t('timeline.steps.proofing'), details: t('timeline.details.proofing') },
                        { step: t('timeline.steps.baking'), details: t('timeline.details.baking') },
                    ],
                    proTips: [t('results.formulaProTip')],
                };
                 if (params.coldFermentation.enabled) {
                    formulaResult.coldProof = {
                        duration: `${params.coldFermentation.durationHours}h`,
                        notes: t('results.formulaNotes.cold'),
                    };
                    // Adjust timeline for cold proof
                    formulaResult.timeline.splice(3, 0, {
                        step: t('timeline.steps.cold'),
                        details: t('timeline.details.cold', { hours: params.coldFermentation.durationHours })
                    });
                }
                setResult(formulaResult);
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(t('errors.unknown' as TranslationKey));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleNaturalQuery = async () => {
        if (!naturalQuery || calculatorMode === 'formula') return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const aiPlan = await getAIPlanFromQuery(naturalQuery, language);
            const { bakingParameters, yieldParameters, analysis } = aiPlan;

            setParams(p => ({ ...p, ...bakingParameters }));
            setYieldParams(yp => ({
                ...yp,
                mode: 'weight',
                numPieces: yieldParameters.numPieces,
                pieceWeight: yieldParameters.pieceWeight,
            }));
            setResult(analysis);
            setActivePreset(null);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(t('errors.aiPlan' as TranslationKey));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        result,
        setResult,
        isLoading,
        error,
        naturalQuery,
        setNaturalQuery,
        handleCalculate,
        handleNaturalQuery,
    };
};
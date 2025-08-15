import { useState } from 'react';
import * as chrono from 'chrono-node';
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

/**
 * Pre-processes a Spanish query to convert ambiguous time expressions 
 * (e.g., "8 de la tarde") into an unambiguous 24-hour format (e.g., "20:00")
 * to ensure accurate parsing by chrono-node.
 * @param query The user's natural language query.
 * @returns The processed query string.
 */
const spanishTimeHeuristics = (query: string): string => {
    // This regex looks for patterns like "a las 8 de la tarde" or "la 1 de la tarde"
    const regex = /\b(a\s+las|las|la)\s+(\d{1,2})\s+de\s+la\s+(tarde|noche)\b/gi;
    
    return query.replace(regex, (match, prefix, hourStr) => {
        let hour = parseInt(hourStr, 10);
        // "1 de la tarde" is 13:00. "12 de la tarde" is 12:00 and is not modified.
        if (hour >= 1 && hour <= 11) {
             hour += 12;
        }
        // Return the prefix and the 24-hour format time, e.g., "a las 20:00"
        return `${prefix} ${hour}:00`;
    });
};


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
            let processedQuery = naturalQuery;
            if (language === 'es') {
                processedQuery = spanishTimeHeuristics(naturalQuery);
            }
            
            const parser = language === 'es' ? chrono.es : chrono.en;
            const parsedDate = parser.parseDate(processedQuery, new Date(), { forwardDate: true });
            
            let precalculatedBakeTime: string | undefined = undefined;
            if (parsedDate) {
                precalculatedBakeTime = parsedDate.toISOString();
            }

            // IMPORTANT: Pass the original query to the AI for context, but the pre-calculated time for accuracy.
            const aiPlan = await getAIPlanFromQuery(naturalQuery, language, precalculatedBakeTime);
            const { bakingParameters, yieldParameters, analysis } = aiPlan;

            if (bakingParameters.bakeTimeTarget) {
                const d = new Date(bakingParameters.bakeTimeTarget);
                if (!isNaN(d.getTime())) {
                    // Format for datetime-local input: YYYY-MM-DDTHH:mm
                    const year = d.getFullYear();
                    const month = (d.getMonth() + 1).toString().padStart(2, '0');
                    const day = d.getDate().toString().padStart(2, '0');
                    const hours = d.getHours().toString().padStart(2, '0');
                    const minutes = d.getMinutes().toString().padStart(2, '0');
                    bakingParameters.bakeTimeTarget = `${year}-${month}-${day}T${hours}:${minutes}`;
                } else {
                    bakingParameters.bakeTimeTarget = ''; // Clear if invalid date
                }
            }

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

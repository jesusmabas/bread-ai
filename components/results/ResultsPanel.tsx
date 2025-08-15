import React from 'react';
import { AIAnalysisResult, BakingParameters, UnitSystem } from '../../types';
import { TranslationKey } from '../../i18n/locales';
import { useLocalization } from '../../contexts/LocalizationContext';
import { parseDurationToHours } from '../../utils';
import LoadingState from '../LoadingState';
import { Icon } from '../Icon';
import { BakingSchedule } from '../timeline/BakingSchedule';
import { LiveTimeline } from '../timeline/LiveTimeline';
import { PrintableTimeline } from '../timeline/PrintableTimeline';
import FermentationCurveChart from '../FermentationCurveChart';
import { CalculatorMode } from '../../hooks/useBakingSetup';
import { PrintableIngredients } from './PrintableIngredients';

interface ResultsPanelProps {
    isLoading: boolean;
    error: string | null;
    result: AIAnalysisResult | null;
    setRescueModalOpen: (isOpen: boolean) => void;
    calculatorMode: CalculatorMode;
    ingredientWeights: any;
    unitSystem: UnitSystem;
    params: BakingParameters;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ isLoading, error, result, setRescueModalOpen, calculatorMode, ingredientWeights, unitSystem, params }) => {
    const { t } = useLocalization();
    
    if (isLoading) return <LoadingState />;
    if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert"><p className="font-bold">{t('common.error')}</p><p>{error}</p></div>;
    if (!result) return null;
    
    const hasColdProof = !!result.coldProof;
    const bulkHours = parseDurationToHours(result.bulkFermentation.duration);
    const proofHours = parseDurationToHours(result.finalProof.duration);
    const coldProofHours = hasColdProof ? parseDurationToHours(result.coldProof!.duration) : 0;
    const canShowChart = bulkHours > 0 && proofHours > 0;
    const isTimelineSchedulable = result.timeline?.every(item => item.startTime) ?? false;

    const title = calculatorMode === 'ai' ? t('results.titleAI') : t('results.titleFormula');

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8 animate-fade-in printable-area">
            <PrintableIngredients
                ingredientWeights={ingredientWeights}
                unitSystem={unitSystem}
                params={params}
            />
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-amber-900 flex items-center print-title"><Icon icon="fa-solid fa-wand-magic-sparkles" className="mr-2 text-amber-500 no-print"/>{title}</h2>
                    <p className="mt-2 text-gray-700">{result.overview}</p>
                </div>
                 <button onClick={() => window.print()} className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors no-print" aria-label={t('common.print')}>
                    <Icon icon="fa-solid fa-print" className="text-gray-700 text-2xl"/>
                 </button>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-${hasColdProof ? '3' : '2'} gap-4`}>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 flex items-center"><Icon icon="fa-solid fa-clock" className="mr-2 text-xl"/>{t('results.bulkFermentation')}</h3>
                  <p className="text-2xl font-bold text-amber-900 mt-1">{result.bulkFermentation.duration}</p>
                  <p className="text-sm text-gray-600 mt-1">{result.bulkFermentation.notes}</p>
                </div>
                {hasColdProof && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 flex items-center"><Icon icon="fa-solid fa-snowflake" className="mr-2 text-xl"/>{t('results.coldProof' as TranslationKey)}</h3>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{result.coldProof!.duration}</p>
                      <p className="text-sm text-gray-600 mt-1">{result.coldProof!.notes}</p>
                    </div>
                )}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-800 flex items-center"><Icon icon="fa-solid fa-clock" className="mr-2 text-xl"/>{t('results.finalProof')}</h3>
                    <p className="text-2xl font-bold text-amber-900 mt-1">{result.finalProof.duration}</p>
                    <p className="text-sm text-gray-600 mt-1">{result.finalProof.notes}</p>
                </div>
            </div>

            {calculatorMode === 'ai' && result.coldFermentation?.suitability && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 no-print">
                    <h3 className="font-semibold text-blue-800 flex items-center"><Icon icon="fa-solid fa-snowflake" className="mr-2 text-xl"/>{t('results.coldFermentation.title')}</h3>
                    <p className="text-sm text-blue-700 mt-2">{result.coldFermentation.description}</p>
                    <div className="mt-3 pt-3 border-t border-blue-200/50">
                        <p className="text-sm text-gray-800"><strong className="font-semibold">{t('results.coldFermentation.instructions')}:</strong> {result.coldFermentation.timelineAdjustments}</p>
                    </div>
                </div>
            )}
            
            {isTimelineSchedulable
                ? <BakingSchedule timeline={result.timeline} />
                : <LiveTimeline timeline={result.timeline} />
            }
            <PrintableTimeline timeline={result.timeline} />

            
            {calculatorMode === 'ai' && (
              <div className="pt-6 mt-6 border-t border-gray-200 border-dashed no-print">
                  <button 
                      onClick={() => setRescueModalOpen(true)} 
                      className="w-full flex items-center justify-center gap-3 p-3 text-base font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                      <Icon icon="fa-solid fa-circle-question" className="text-xl" />
                      {t('timeline.getHelp')}
                  </button>
              </div>
            )}
            
            
            {canShowChart && !isTimelineSchedulable && (
              <div className="pt-4 no-print">
                <h3 className="text-xl font-semibold text-amber-900 mb-4 flex items-center"><Icon icon="fa-solid fa-chart-line" className="mr-2 text-amber-600"/>{t('results.fermentationCurve')}</h3>
                <FermentationCurveChart bulkHours={bulkHours} proofHours={proofHours} coldProofHours={coldProofHours} />
              </div>
            )}
            
             <div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3 flex items-center print-section-title"><Icon icon="fa-solid fa-lightbulb" className="mr-2 text-yellow-500 no-print"/>{t('results.proTips')}</h3>
                <ul className="space-y-2">{result.proTips.map((tip, index) => (<li key={index} className="flex items-start"><Icon icon="fa-solid fa-chevron-right" className="text-amber-500 mt-1 mr-2 flex-shrink-0 no-print"/><span className="text-gray-700 print-checklist-item">{tip}</span></li>))}</ul>
            </div>
        </div>
    );
}
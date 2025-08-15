import React from 'react';
import { BakingParameters, YeastType, UnitSystem } from '../../types';
import { FLOUR_OPTIONS, YEAST_OPTIONS, STARTER_ACTIVITY_OPTIONS, OVEN_PROFILE_OPTIONS } from '../../constants';
import { useLocalization } from '../../contexts/LocalizationContext';
import { TranslationKey } from '../../i18n/locales';
import { gramsToOunces } from '../../utils';
import InputSlider from '../InputSlider';
import Tooltip from '../Tooltip';
import { Icon } from '../Icon';
import { CalculatorMode } from '../../hooks/useBakingSetup';

interface DoughParametersPanelProps {
    params: BakingParameters;
    mode: 'simple' | 'pro';
    setMode: React.Dispatch<React.SetStateAction<'simple' | 'pro'>>;
    calculatorMode: CalculatorMode;
    setCalculatorMode: (mode: CalculatorMode) => void;
    unitSystem: UnitSystem;
    handleSelectChange: (field: keyof BakingParameters, e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSliderChange: (field: keyof BakingParameters, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleParamChange: (field: keyof BakingParameters, value: any) => void;
    setDDTModalOpen: (isOpen: boolean) => void;
    ingredientWeights: any; // Simplified for brevity
    doughInsights: any; // Simplified for brevity
}


export const DoughParametersPanel: React.FC<DoughParametersPanelProps> = ({
    params, mode, setMode, calculatorMode, setCalculatorMode, unitSystem, handleSelectChange, handleSliderChange, handleParamChange,
    setDDTModalOpen, ingredientWeights, doughInsights
}) => {
    const { t } = useLocalization();

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-amber-900 flex items-center"><Icon icon="fa-solid fa-scale-balanced" className="mr-2"/>{t('params.title')}</h2><div className="flex items-center gap-2"><span className={`text-sm font-medium ${mode === 'simple' ? 'text-amber-700' : 'text-gray-400'}`}>{t('params.mode.simple')}</span><button onClick={()=>setMode(m => m === 'simple' ? 'pro' : 'simple')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mode === 'pro' ? 'bg-amber-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mode === 'pro' ? 'translate-x-6' : 'translate-x-1'}`}/></button><span className={`text-sm font-medium ${mode === 'pro' ? 'text-amber-700' : 'text-gray-400'}`}>{t('params.mode.pro')}</span></div></div>
            <div className="space-y-5">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('params.flourType')}</label><select value={params.flourType} onChange={(e) => handleSelectChange('flourType', e)} className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500">{Object.keys(FLOUR_OPTIONS).map((key) => (<option key={key} value={key}>{t(`flourTypes.${key}` as TranslationKey)}</option>))}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('params.leaveningAgent')}</label><select value={params.yeastType} onChange={(e) => handleSelectChange('yeastType', e)} className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500">{Object.keys(YEAST_OPTIONS).map((key) => (<option key={key} value={key}>{t(`yeastTypes.${key}` as TranslationKey)}</option>))}</select></div>
                {params.yeastType === YeastType.SOURDOUGH && (<div className="pl-4 border-l-4 border-amber-200 animate-fade-in"><Tooltip text={t('tooltips.starterActivity')}><label className="flex items-center text-sm font-medium text-gray-700 mb-2">{t('params.starterActivity')} <Icon icon="fa-solid fa-circle-info" className="ml-1.5 text-gray-400"/></label></Tooltip><select value={params.sourdoughStarterActivity} onChange={(e) => handleSelectChange('sourdoughStarterActivity', e)} className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500">{Object.keys(STARTER_ACTIVITY_OPTIONS).map((key) => (<option key={key} value={key}>{t(`starterActivities.${key}` as TranslationKey)}</option>))}</select></div>)}
                <InputSlider label={t('params.hydration')} value={params.hydration} onChange={(e) => handleSliderChange('hydration', e)} min={50} max={100} step={1} unit="%" unitSystem={unitSystem}/>
                <InputSlider label={t('params.salt')} value={params.salt} onChange={(e) => handleSliderChange('salt', e)} min={0} max={5} step={0.1} unit="%" unitSystem={unitSystem}/>
                <InputSlider label={t('params.ambientTemp')} value={params.temperature} onChange={(e) => handleSliderChange('temperature', e)} min={18} max={32} step={1} unit="°C" unitSystem={unitSystem} />
                <InputSlider label={params.yeastType === YeastType.SOURDOUGH ? t('params.starter') : t('params.yeast')} value={params.yeastAmount} onChange={(e) => handleSliderChange('yeastAmount', e)} min={params.yeastType === YeastType.SOURDOUGH ? 5 : 0.1} max={params.yeastType === YeastType.SOURDOUGH ? 40 : 2.5} step={params.yeastType === YeastType.SOURDOUGH ? 1 : 0.1} unit="%" unitSystem={unitSystem}/>
                
                {mode === 'pro' && (
                    <div className="space-y-5 pt-4 border-t border-dashed animate-fade-in">
                        <InputSlider label={t('params.sugar')} value={params.sugar} onChange={(e) => handleSliderChange('sugar', e)} min={0} max={10} step={0.5} unit="%" unitSystem={unitSystem}/>
                        <InputSlider label={t('params.fat')} value={params.fat} onChange={(e) => handleSliderChange('fat', e)} min={0} max={10} step={0.5} unit="%" unitSystem={unitSystem}/>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t('params.ovenProfile')}</label>
                          <select value={params.ovenProfile} onChange={(e) => handleSelectChange('ovenProfile', e)} className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                            {Object.keys(OVEN_PROFILE_OPTIONS).map((key) => (<option key={key} value={key}>{t(`ovenProfiles.${key}` as TranslationKey)}</option>))}
                          </select>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Tooltip text={t('tooltips.ddt')}><span className="flex items-center">{t('params.ddt.title')} <Icon icon="fa-solid fa-circle-info" className="ml-1.5 text-gray-400" /></span></Tooltip>
                            </h3>
                             <button onClick={() => setDDTModalOpen(true)} className="w-full flex items-center justify-center gap-2 p-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200">
                                <Icon icon="fa-solid fa-calculator" /> {t('params.ddt.button')}
                            </button>
                            <div className="pt-2">
                                 <h3 className="font-semibold text-gray-700 mb-3"><Tooltip text={t('tooltips.q10')}><span className="flex items-center">{t('params.advancedModel.title')} <Icon icon="fa-solid fa-circle-info" className="ml-1.5 text-gray-400"/></span></Tooltip></h3>
                                <InputSlider label={t('params.advancedModel.q10')} value={params.q10} onChange={e => handleParamChange('q10', parseFloat(e.target.value))} min={1.5} max={3} step={0.1} unit="" unitSystem={unitSystem}/>
                                <InputSlider label={t('params.advancedModel.tRef')} value={params.t_ref} onChange={e => handleParamChange('t_ref', parseFloat(e.target.value))} min={18} max={28} step={1} unit="°C" unitSystem={unitSystem}/>
                            </div>
                        </div>
                    </div>
                )}
                 <div className="mt-4 pt-5 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('calculatorEngine.label')}</label>
                    <div className="flex space-x-2 rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setCalculatorMode('formula')}
                            className={`w-full p-2 text-sm font-semibold rounded-md transition-all ${calculatorMode === 'formula' ? 'bg-white text-amber-900 shadow' : 'text-gray-600'}`}
                        >
                            {t('calculatorEngine.formula')}
                        </button>
                        <button
                            onClick={() => setCalculatorMode('ai')}
                            className={`w-full p-2 text-sm font-semibold rounded-md transition-all ${calculatorMode === 'ai' ? 'bg-white text-amber-900 shadow' : 'text-gray-600'}`}
                        >
                            {t('calculatorEngine.ai')}
                        </button>
                    </div>
                </div>
                
                {ingredientWeights && (
                  <div className="mt-6 pt-6 border-t border-gray-200 print:hidden">
                     {ingredientWeights.preferment && (
                         <div className="mb-4">
                            <h3 className="text-lg font-semibold text-amber-900 mb-3">{t('ingredients.preferment.title')}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="font-medium text-gray-700">{t('ingredients.flour')}:</div><div className="text-right font-mono font-semibold text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.flour.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.flour).toFixed(1)}oz`}</div>
                                <div className="font-medium text-gray-700">{t('ingredients.water')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.water.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.water).toFixed(1)}oz`}</div>
                                <div className="font-medium text-gray-700">{t('params.yeast')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.yeast.toFixed(2)}g` : `${gramsToOunces(ingredientWeights.preferment.yeast).toFixed(3)}oz`}</div>
                                <div className="col-span-2 mt-2 pt-2 border-t border-dashed"></div>
                                <div className="font-bold text-gray-800">{t('ingredients.preferment.total' as TranslationKey)}:</div><div className="text-right font-bold font-mono text-amber-900">{unitSystem === 'metric' ? `${ingredientWeights.preferment.total.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.total).toFixed(1)}oz`}</div>
                            </div>
                         </div>
                     )}
                    <h3 className="text-lg font-semibold text-amber-900 mb-3">{ingredientWeights.preferment ? t('ingredients.finalDough.title') : t('ingredients.title')}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {ingredientWeights.preferment && <><div className="font-medium text-gray-700">{t('ingredients.preferment.asIngredient')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.total.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.total).toFixed(1)}oz`}</div></>}
                      <div className="font-medium text-gray-700">{t('ingredients.flour')}:</div><div className="text-right font-mono font-semibold text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.flour.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.finalDough.flour).toFixed(1)}oz`}</div>
                      <div className="font-medium text-gray-700">{t('ingredients.water')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.water.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.finalDough.water).toFixed(1)}oz`}</div>
                      <div className="font-medium text-gray-700">{params.yeastType === YeastType.SOURDOUGH ? t('params.starter') : t('params.yeast')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.leavening.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.leavening).toFixed(2)}oz`}</div>
                      <div className="font-medium text-gray-700">{t('ingredients.salt')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.salt.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.salt).toFixed(2)}oz`}</div>
                      {params.sugar > 0 && <>
                        <div className="font-medium text-gray-700">{t('ingredients.sugar')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.sugar.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.sugar).toFixed(2)}oz`}</div>
                      </>}
                      {params.fat > 0 && <>
                        <div className="font-medium text-gray-700">{t('ingredients.fat')}:</div><div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.fat.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.fat).toFixed(2)}oz`}</div>
                      </>}
                      <div className="col-span-2 mt-2 pt-2 border-t border-dashed"></div>
                      <div className="font-bold text-gray-800">{t('ingredients.total')}:</div><div className="text-right font-bold font-mono text-amber-900">{unitSystem === 'metric' ? `${ingredientWeights.total.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.total).toFixed(1)}oz`}</div>
                    </div>
                  </div>
                )}
                
                 {doughInsights && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <h3 className="text-lg font-semibold text-amber-900">{t('doughInsights.title')}</h3>

                        {doughInsights.warnings && doughInsights.warnings.length > 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg space-y-2">
                                {doughInsights.warnings.map((warning, index) => (
                                    <div key={index} className="flex items-start text-sm text-yellow-800">
                                        <Icon icon="fa-solid fa-triangle-exclamation" className="mr-2 mt-0.5 flex-shrink-0 text-yellow-500 text-xl" />
                                        <span>{warning}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                <span>{t('doughInsights.finalSalinity')}</span>
                                <span className="font-semibold text-amber-900">{doughInsights.finalSalinity}%</span>
                            </div>
                             <p className="text-xs text-gray-500 mt-1">{doughInsights.salinityAdvice}</p>
                        </div>

                         {doughInsights.hydrationFeel && (
                            <div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                    <span>{t('doughInsights.hydrationFeel.title')}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{doughInsights.hydrationFeel}</p>
                            </div>
                        )}

                        <div>
                             <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
                                <span>{t('doughInsights.elasticity')}</span>
                                <span>{t('doughInsights.extensibility')}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                                <div className="absolute top-0 h-full w-2 bg-amber-600 rounded-full shadow" style={{ left: `calc(${((doughInsights.extensibilityScore + 100) / 200) * 100}% - 4px)` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{doughInsights.extensibilityAdvice}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
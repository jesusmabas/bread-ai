
import React from 'react';
import { BakingParameters, Preferment, ColdFermentation, UnitSystem, PrefermentType } from '../../types';
import { PREFERMENT_TYPE_OPTIONS } from '../../constants';
import { useLocalization } from '../../contexts/LocalizationContext';
import { TranslationKey } from '../../i18n/locales';
import InputSlider from '../InputSlider';
import { SparklesIcon } from '../Icons';

interface AdvancedTechniquesPanelProps {
    params: BakingParameters;
    handleAdvancedChange: (category: 'preferment' | 'coldFermentation', field: keyof Preferment | keyof ColdFermentation, value: any) => void;
    handleParamChange: (field: keyof BakingParameters, value: any) => void;
    unitSystem: UnitSystem;
}

export const AdvancedTechniquesPanel: React.FC<AdvancedTechniquesPanelProps> = ({ params, handleAdvancedChange, handleParamChange, unitSystem }) => {
    const { t } = useLocalization();

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2"><SparklesIcon className="text-amber-500"/>{t('advanced.title')}</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label htmlFor="preferment-enabled" className="font-medium text-gray-700">{t('advanced.preferment.label')}</label>
                    <input id="preferment-enabled" type="checkbox" checked={params.preferment.enabled} onChange={e => handleAdvancedChange('preferment', 'enabled', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"/>
                </div>
                {params.preferment.enabled && (
                    <div className="pl-4 border-l-4 border-amber-200 space-y-4 animate-fade-in py-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('advanced.preferment.type')}</label><select value={params.preferment.type} onChange={e => handleAdvancedChange('preferment', 'type', e.target.value as PrefermentType)} className="w-full p-2 bg-white border border-gray-300 rounded-md">{Object.keys(PREFERMENT_TYPE_OPTIONS).map(key => <option key={key} value={key}>{t(`prefermentTypes.${key}.name` as TranslationKey)}</option>)}</select></div>
                        <InputSlider label={t('advanced.preferment.flourPct')} value={params.preferment.flourPct} onChange={e => handleAdvancedChange('preferment', 'flourPct', parseFloat(e.target.value))} min={10} max={50} step={1} unit="%" unitSystem={unitSystem}/>
                        <InputSlider label={t('advanced.preferment.hydration')} value={params.preferment.hydration} onChange={e => handleAdvancedChange('preferment', 'hydration', parseFloat(e.target.value))} min={50} max={110} step={1} unit="%" unitSystem={unitSystem}/>
                        <InputSlider label={t('advanced.preferment.yeastPct')} value={params.preferment.yeastPct} onChange={e => handleAdvancedChange('preferment', 'yeastPct', parseFloat(e.target.value))} min={0.1} max={1} step={0.05} unit="%" unitSystem={unitSystem}/>
                         <InputSlider label={t('advanced.preferment.fermentationHours')} value={params.preferment.fermentationHours} onChange={e => handleAdvancedChange('preferment', 'fermentationHours', parseFloat(e.target.value))} min={4} max={24} step={1} unit="h" unitSystem={unitSystem}/>
                         <InputSlider label={t('advanced.preferment.fermentationTemp')} value={params.preferment.fermentationTemp} onChange={e => handleAdvancedChange('preferment', 'fermentationTemp', parseFloat(e.target.value))} min={15} max={30} step={1} unit="°C" unitSystem={unitSystem}/>
                    </div>
                )}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label htmlFor="cold-ferm-enabled" className="font-medium text-gray-700">{t('advanced.coldFermentation.label')}</label>
                    <input id="cold-ferm-enabled" type="checkbox" checked={params.coldFermentation.enabled} onChange={e => handleAdvancedChange('coldFermentation', 'enabled', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"/>
                </div>
                 {params.coldFermentation.enabled && (
                    <div className="pl-4 border-l-4 border-blue-200 space-y-4 animate-fade-in py-4">
                        <InputSlider label={t('advanced.coldFermentation.durationHours')} value={params.coldFermentation.durationHours} onChange={e => handleAdvancedChange('coldFermentation', 'durationHours', parseFloat(e.target.value))} min={8} max={72} step={1} unit="h" unitSystem={unitSystem}/>
                        <InputSlider label={t('advanced.coldFermentation.temperature')} value={params.coldFermentation.temperature} onChange={e => handleAdvancedChange('coldFermentation', 'temperature', parseFloat(e.target.value))} min={2} max={10} step={0.5} unit="°C" unitSystem={unitSystem}/>
                    </div>
                )}
                 <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('advanced.bakeTimeTarget')}</label>
                    <input type="datetime-local" value={params.bakeTimeTarget} onChange={e => handleParamChange('bakeTimeTarget', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md"/>
                </div>
            </div>
        </div>
    );
};

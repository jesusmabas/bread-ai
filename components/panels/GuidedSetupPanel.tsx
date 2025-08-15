import React from 'react';
import { GuidedChoices, GuidedCrumb, GuidedCrust, GuidedLeavening } from '../../types';
import { GUIDED_CRUMB_OPTIONS, GUIDED_CRUST_OPTIONS, GUIDED_LEAVENING_OPTIONS } from '../../constants';
import { useLocalization } from '../../contexts/LocalizationContext';
import { TranslationKey } from '../../i18n/locales';
import { Icon } from '../Icon';

interface GuidedSetupPanelProps {
    guidedChoices: GuidedChoices;
    handleGuidedSetupChange: (type: 'crumb' | 'crust' | 'leavening', value: GuidedCrumb | GuidedCrust | GuidedLeavening) => void;
}

export const GuidedSetupPanel: React.FC<GuidedSetupPanelProps> = ({ guidedChoices, handleGuidedSetupChange }) => {
    const { t } = useLocalization();
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center"><Icon icon="fa-solid fa-ruler-combined" className="mr-2 text-amber-600"/>{t('guided.title')}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('guided.crumb.label')}</label>
                    <select value={guidedChoices.crumb} onChange={(e) => handleGuidedSetupChange('crumb', e.target.value as GuidedCrumb)} className="w-full p-2 bg-white border border-gray-300 rounded-md">
                        {Object.keys(GUIDED_CRUMB_OPTIONS).map((key) => (<option key={key} value={key}>{t(`guided.crumb.options.${key}` as TranslationKey)}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('guided.crust.label')}</label>
                    <select value={guidedChoices.crust} onChange={(e) => handleGuidedSetupChange('crust', e.target.value as GuidedCrust)} className="w-full p-2 bg-white border border-gray-300 rounded-md">
                        {Object.keys(GUIDED_CRUST_OPTIONS).map((key) => (<option key={key} value={key}>{t(`guided.crust.options.${key}` as TranslationKey)}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('guided.leavening.label')}</label>
                    <select value={guidedChoices.leavening} onChange={(e) => handleGuidedSetupChange('leavening', e.target.value as GuidedLeavening)} className="w-full p-2 bg-white border border-gray-300 rounded-md">
                        {Object.keys(GUIDED_LEAVENING_OPTIONS).map((key) => (<option key={key} value={key}>{t(`guided.leavening.options.${key}` as TranslationKey)}</option>))}
                    </select>
                </div>
            </div>
        </div>
    );
};
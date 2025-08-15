import React from 'react';
import { BakingStyle, Preset } from '../../types';
import { PRESETS } from '../../constants';
import { useLocalization } from '../../contexts/LocalizationContext';
import { TranslationKey } from '../../i18n/locales';
import Tooltip from '../Tooltip';

interface PresetSelectorPanelProps {
    activePreset: BakingStyle | null;
    handlePresetSelect: (key: BakingStyle) => void;
}

const PresetButton: React.FC<{
    presetKey: BakingStyle, 
    preset: Preset, 
    isActive: boolean,
    handlePresetSelect: (key: BakingStyle) => void
}> = ({presetKey, preset, isActive, handlePresetSelect}) => {
    const { t } = useLocalization();
    const name = t(`presets.${presetKey}.name` as TranslationKey);
    const description = t(`presets.${presetKey}.description` as TranslationKey);

    return (
        <Tooltip text={description}>
            <button onClick={() => handlePresetSelect(presetKey)} className={`h-24 w-full flex flex-col items-center justify-center p-2 text-center rounded-lg border-2 transition-all duration-200 ${isActive ? 'bg-amber-100 border-amber-500 shadow-md' : 'bg-white hover:bg-amber-50 hover:border-amber-300 border-gray-200'}`}>
                <preset.icon className={`mx-auto text-2xl mb-1.5 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
                <span className={`text-xs font-semibold ${isActive ? 'text-amber-900' : 'text-gray-700'}`}>{name}</span>
            </button>
        </Tooltip>
    );
}

export const PresetSelectorPanel: React.FC<PresetSelectorPanelProps> = ({ activePreset, handlePresetSelect }) => {
    const { t } = useLocalization();
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">{t('presets.title')}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {Object.entries(PRESETS).map(([key, preset]) => 
                    <PresetButton 
                        key={key} 
                        presetKey={key as BakingStyle} 
                        preset={preset} 
                        isActive={activePreset === key}
                        handlePresetSelect={handlePresetSelect}
                    />
                )}
            </div>
        </div>
    );
};
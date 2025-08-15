import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { Icon } from '../Icon';

interface NaturalLanguagePlannerPanelProps {
    naturalQuery: string;
    setNaturalQuery: (query: string) => void;
    handleNaturalQuery: () => void;
    isLoading: boolean;
    disabled: boolean;
}

export const NaturalLanguagePlannerPanel: React.FC<NaturalLanguagePlannerPanelProps> = ({
    naturalQuery, setNaturalQuery, handleNaturalQuery, isLoading, disabled
}) => {
    const { t } = useLocalization();

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
             {disabled && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg text-center">
                     <Icon icon="fa-solid fa-wand-magic-sparkles" className="text-amber-500 text-3xl"/>
                     <p className="font-semibold text-amber-900 mt-2">{t('planner.proFeature.title')}</p>
                     <p className="text-xs text-gray-600 mt-1 px-4">{t('planner.proFeature.description')}</p>
                </div>
            )}
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center"><Icon icon="fa-solid fa-wand-magic-sparkles" className="mr-2 text-amber-600"/>{t('planner.title')}</h2>
            <div className="space-y-3">
                <textarea
                    rows={3}
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    placeholder={t('planner.placeholder')}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    disabled={disabled}
                />
                 <button onClick={handleNaturalQuery} disabled={isLoading || disabled} className="w-full flex items-center justify-center gap-2 p-3 font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed">
                    {isLoading ? t('planner.button.loading') : t('planner.button.default')}
                </button>
            </div>
        </div>
    );
};
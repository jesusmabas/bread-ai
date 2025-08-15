
import React from 'react';
import { YieldParameters, UnitSystem } from '../../types';
import { gramsToOunces } from '../../utils';
import { useLocalization } from '../../contexts/LocalizationContext';

interface YieldSizerPanelProps {
    yieldParams: YieldParameters;
    handleYieldChange: (field: keyof YieldParameters, value: string | number) => void;
    flourAmount: number;
    unitSystem: UnitSystem;
}

export const YieldSizerPanel: React.FC<YieldSizerPanelProps> = ({ yieldParams, handleYieldChange, flourAmount, unitSystem }) => {
    const { t } = useLocalization();
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">{t('yield.title')}</h2>
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <label className="font-medium text-gray-700">{t('yield.totalFlour')}:</label>
                        <span className="text-xl font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-md">
                            {unitSystem === 'imperial' ? `${gramsToOunces(flourAmount).toFixed(1)}oz` : `${flourAmount}g`}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('yield.pieces')}</label>
                            <input type="number" value={yieldParams.numPieces} onChange={e=>handleYieldChange('numPieces', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('yield.weightPerPiece')} ({unitSystem === 'metric' ? 'g' : 'oz'})</label>
                            <input type="number" step={unitSystem === 'imperial' ? '0.1' : '1'} value={unitSystem === 'metric' ? yieldParams.pieceWeight : gramsToOunces(yieldParams.pieceWeight).toFixed(1)} onChange={e=>handleYieldChange('pieceWeight', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

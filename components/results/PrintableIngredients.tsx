
import React from 'react';
import { BakingParameters, UnitSystem, YeastType } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';
import { TranslationKey } from '../../i18n/locales';
import { gramsToOunces } from '../../utils';

interface PrintableIngredientsProps {
    ingredientWeights: any;
    unitSystem: UnitSystem;
    params: BakingParameters;
}

export const PrintableIngredients: React.FC<PrintableIngredientsProps> = ({ ingredientWeights, unitSystem, params }) => {
    const { t } = useLocalization();

    if (!ingredientWeights) return null;

    return (
        <div className="hidden print:block mb-6">
            {ingredientWeights.preferment && (
                <div className="mb-4">
                    <h2 className="print-section-title">{t('ingredients.preferment.title')}</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                        <div className="font-medium text-gray-700">{t('ingredients.flour')}:</div>
                        <div className="text-right font-mono font-semibold text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.flour.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.flour).toFixed(1)}oz`}</div>
                        <div className="font-medium text-gray-700">{t('ingredients.water')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.water.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.water).toFixed(1)}oz`}</div>
                        <div className="font-medium text-gray-700">{t('params.yeast')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.yeast.toFixed(2)}g` : `${gramsToOunces(ingredientWeights.preferment.yeast).toFixed(3)}oz`}</div>
                        <div className="col-span-2 mt-2 pt-2 border-t border-dashed"></div>
                        <div className="font-bold text-gray-800">{t('ingredients.preferment.total' as TranslationKey)}:</div>
                        <div className="text-right font-bold font-mono text-amber-900">{unitSystem === 'metric' ? `${ingredientWeights.preferment.total.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.total).toFixed(1)}oz`}</div>
                    </div>
                </div>
            )}

            <div>
                 <h2 className="print-section-title">{ingredientWeights.preferment ? t('ingredients.finalDough.title') : t('ingredients.title')}</h2>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                      {ingredientWeights.preferment && <>
                          <div className="font-medium text-gray-700">{t('ingredients.preferment.asIngredient')}:</div>
                          <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.preferment.total.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.preferment.total).toFixed(1)}oz`}</div>
                      </>}
                      <div className="font-medium text-gray-700">{t('ingredients.flour')}:</div>
                      <div className="text-right font-mono font-semibold text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.flour.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.finalDough.flour).toFixed(1)}oz`}</div>
                      <div className="font-medium text-gray-700">{t('ingredients.water')}:</div>
                      <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.water.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.finalDough.water).toFixed(1)}oz`}</div>
                      <div className="font-medium text-gray-700">{params.yeastType === YeastType.SOURDOUGH ? t('params.starter') : t('params.yeast')}:</div>
                      <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.leavening.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.leavening).toFixed(2)}oz`}</div>
                      <div className="font-medium text-gray-700">{t('ingredients.salt')}:</div>
                      <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.salt.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.salt).toFixed(2)}oz`}</div>
                      {params.sugar > 0 && <>
                        <div className="font-medium text-gray-700">{t('ingredients.sugar')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.sugar.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.sugar).toFixed(2)}oz`}</div>
                      </>}
                      {params.fat > 0 && <>
                        <div className="font-medium text-gray-700">{t('ingredients.fat')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${ingredientWeights.finalDough.fat.toFixed(1)}g` : `${gramsToOunces(ingredientWeights.finalDough.fat).toFixed(2)}oz`}</div>
                      </>}
                      <div className="col-span-2 mt-2 pt-2 border-t border-dashed"></div>
                      <div className="font-bold text-gray-800">{t('ingredients.total')}:</div>
                      <div className="text-right font-bold font-mono text-amber-900">{unitSystem === 'metric' ? `${ingredientWeights.total.toFixed(0)}g` : `${gramsToOunces(ingredientWeights.total).toFixed(1)}oz`}</div>
                    </div>
            </div>
        </div>
    );
};

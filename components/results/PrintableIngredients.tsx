

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
    const { t, formatNumber } = useLocalization();

    if (!ingredientWeights) return null;

    return (
        <div className="hidden print:block mb-6">
            {ingredientWeights.preferment && (
                <div className="mb-4">
                    <h2 className="print-section-title">{t('ingredients.preferment.title')}</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                        <div className="font-medium text-gray-700">{t('ingredients.flour')}:</div>
                        <div className="text-right font-mono font-semibold text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.preferment.flour, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.preferment.flour), {maximumFractionDigits: 1})}oz`}</div>
                        <div className="font-medium text-gray-700">{t('ingredients.water')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.preferment.water, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.preferment.water), {maximumFractionDigits: 1})}oz`}</div>
                        <div className="font-medium text-gray-700">{t('params.yeast')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.preferment.yeast, {maximumFractionDigits: 2})}g` : `${formatNumber(gramsToOunces(ingredientWeights.preferment.yeast), {maximumFractionDigits: 3})}oz`}</div>
                        <div className="col-span-2 mt-2 pt-2 border-t border-dashed"></div>
                        <div className="font-bold text-gray-800">{t('ingredients.preferment.total' as TranslationKey)}:</div>
                        <div className="text-right font-bold font-mono text-amber-900">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.preferment.total, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.preferment.total), {maximumFractionDigits: 1})}oz`}</div>
                    </div>
                </div>
            )}

            <div>
                 <h2 className="print-section-title">{ingredientWeights.preferment ? t('ingredients.finalDough.title') : t('ingredients.title')}</h2>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                      {ingredientWeights.preferment && <>
                          <div className="font-medium text-gray-700">{t('ingredients.preferment.asIngredient')}:</div>
                          <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.preferment.total, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.preferment.total), {maximumFractionDigits: 1})}oz`}</div>
                      </>}
                      <div className="font-medium text-gray-700">{t('ingredients.flour')}:</div>
                      <div className="text-right font-mono font-semibold text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.finalDough.flour, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.finalDough.flour), {maximumFractionDigits: 1})}oz`}</div>
                      <div className="font-medium text-gray-700">{t('ingredients.water')}:</div>
                      <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.finalDough.water, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.finalDough.water), {maximumFractionDigits: 1})}oz`}</div>
                      <div className="font-medium text-gray-700">{params.yeastType === YeastType.SOURDOUGH ? t('params.starter') : t('params.yeast')}:</div>
                      <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.finalDough.leavening, {maximumFractionDigits: 1})}g` : `${formatNumber(gramsToOunces(ingredientWeights.finalDough.leavening), {maximumFractionDigits: 2})}oz`}</div>
                      <div className="font-medium text-gray-700">{t('ingredients.salt')}:</div>
                      <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.finalDough.salt, {maximumFractionDigits: 1})}g` : `${formatNumber(gramsToOunces(ingredientWeights.finalDough.salt), {maximumFractionDigits: 2})}oz`}</div>
                      {params.sugar > 0 && <>
                        <div className="font-medium text-gray-700">{t('ingredients.sugar')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.finalDough.sugar, {maximumFractionDigits: 1})}g` : `${formatNumber(gramsToOunces(ingredientWeights.finalDough.sugar), {maximumFractionDigits: 2})}oz`}</div>
                      </>}
                      {params.fat > 0 && <>
                        <div className="font-medium text-gray-700">{t('ingredients.fat')}:</div>
                        <div className="text-right font-mono text-gray-800">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.finalDough.fat, {maximumFractionDigits: 1})}g` : `${formatNumber(gramsToOunces(ingredientWeights.finalDough.fat), {maximumFractionDigits: 2})}oz`}</div>
                      </>}
                      <div className="col-span-2 mt-2 pt-2 border-t border-dashed"></div>
                      <div className="font-bold text-gray-800">{t('ingredients.total')}:</div>
                      <div className="text-right font-bold font-mono text-amber-900">{unitSystem === 'metric' ? `${formatNumber(ingredientWeights.total, {maximumFractionDigits: 0})}g` : `${formatNumber(gramsToOunces(ingredientWeights.total), {maximumFractionDigits: 1})}oz`}</div>
                    </div>
            </div>
        </div>
    );
};
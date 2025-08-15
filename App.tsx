import React, { useState } from 'react';
import { useLocalization } from './contexts/LocalizationContext';
import { useBakingSetup } from './hooks/useBakingSetup';
import { useBakingPlanner } from './hooks/useBakingPlanner';
import { useRecipeStorage } from './hooks/useRecipeStorage';

import { Header } from './components/layout/Header';
import { NaturalLanguagePlannerPanel } from './components/panels/NaturalLanguagePlannerPanel';
import { GuidedSetupPanel } from './components/panels/GuidedSetupPanel';
import { PresetSelectorPanel } from './components/panels/PresetSelectorPanel';
import { YieldSizerPanel } from './components/panels/YieldSizerPanel';
import { AdvancedTechniquesPanel } from './components/panels/AdvancedTechniquesPanel';
import { DoughParametersPanel } from './components/panels/DoughParametersPanel';
import { ResultsPanel } from './components/results/ResultsPanel';
import DDTCalculator from './components/DDTCalculator';
import { RescueModal } from './components/modals/RescueModal';
import { SaveRecipeModal } from './components/modals/SaveRecipeModal';
import { ViewRecipesModal } from './components/modals/ViewRecipesModal';
import { Icon } from './components/Icon';

const App: React.FC = () => {
    const { t, language, setLanguage } = useLocalization();

    const [isDDTModalOpen, setDDTModalOpen] = useState(false);
    const [isRescueModalOpen, setRescueModalOpen] = useState(false);

    const bakingSetup = useBakingSetup();
    const { params, yieldParams, setParams, setYieldParams, calculatorMode } = bakingSetup;

    const bakingPlanner = useBakingPlanner({
        params,
        setParams,
        setYieldParams,
        setActivePreset: bakingSetup.setActivePreset,
        language,
        t,
        calculatorMode
    });
    const { result, isLoading, error } = bakingPlanner;

    const recipeStorage = useRecipeStorage({
        params,
        yieldParams,
        guidedChoices: bakingSetup.guidedChoices,
        setParams,
        setYieldParams,
        setGuidedChoices: bakingSetup.setGuidedChoices,
        setResult: bakingPlanner.setResult,
        t,
    });
    const { isRecipesModalOpen, setRecipesModalOpen } = recipeStorage;

    return (
        <div className="min-h-screen bg-stone-50 text-gray-800">
            <Header
                onMyRecipesClick={() => setRecipesModalOpen(true)}
                language={language}
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'es')}
                unitSystem={bakingSetup.unitSystem}
                onUnitSystemChange={bakingSetup.setUnitSystem}
            />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <NaturalLanguagePlannerPanel
                            naturalQuery={bakingPlanner.naturalQuery}
                            setNaturalQuery={bakingPlanner.setNaturalQuery}
                            handleNaturalQuery={bakingPlanner.handleNaturalQuery}
                            isLoading={isLoading}
                            disabled={calculatorMode === 'formula'}
                        />
                        <GuidedSetupPanel
                            guidedChoices={bakingSetup.guidedChoices}
                            handleGuidedSetupChange={bakingSetup.handleGuidedSetupChange}
                        />
                        <PresetSelectorPanel
                            activePreset={bakingSetup.activePreset}
                            handlePresetSelect={bakingSetup.handlePresetSelect}
                        />
                        <YieldSizerPanel
                            yieldParams={yieldParams}
                            handleYieldChange={bakingSetup.handleYieldChange}
                            flourAmount={params.flourAmount}
                            unitSystem={bakingSetup.unitSystem}
                        />
                        <AdvancedTechniquesPanel
                            params={params}
                            handleAdvancedChange={bakingSetup.handleAdvancedChange}
                            handleParamChange={bakingSetup.handleParamChange}
                            unitSystem={bakingSetup.unitSystem}
                        />
                        <DoughParametersPanel
                            params={params}
                            mode={bakingSetup.mode}
                            setMode={bakingSetup.setMode}
                            calculatorMode={calculatorMode}
                            setCalculatorMode={bakingSetup.setCalculatorMode}
                            unitSystem={bakingSetup.unitSystem}
                            handleSelectChange={bakingSetup.handleSelectChange}
                            handleSliderChange={bakingSetup.handleSliderChange}
                            handleParamChange={bakingSetup.handleParamChange}
                            setDDTModalOpen={setDDTModalOpen}
                            ingredientWeights={bakingSetup.ingredientWeights}
                            doughInsights={bakingSetup.doughInsights}
                        />
                         <div className="flex items-center gap-3">
                            <button
                              onClick={bakingPlanner.handleCalculate}
                              disabled={isLoading}
                              className="w-full flex items-center justify-center gap-2 p-4 text-lg font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-400 disabled:bg-amber-400 disabled:cursor-wait transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              <Icon icon="fa-solid fa-chart-line" />
                              {isLoading ? t('mainButton.loading') : t('mainButton.default')}
                            </button>
                            <button onClick={() => { recipeStorage.setRecipeToSave({name: '', notes: ''}); recipeStorage.setIsSaveModalOpen(true); }} className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors" aria-label={t('recipes.save.title')}>
                              <Icon icon="fa-solid fa-floppy-disk" className="text-gray-700 text-2xl"/>
                            </button>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <ResultsPanel
                            isLoading={isLoading}
                            error={error}
                            result={result}
                            setRescueModalOpen={setRescueModalOpen}
                            calculatorMode={calculatorMode}
                            ingredientWeights={bakingSetup.ingredientWeights}
                            unitSystem={bakingSetup.unitSystem}
                            params={params}
                        />
                    </div>
                </div>
            </main>
            {isDDTModalOpen && <DDTCalculator ambientTemp={params.temperature} onClose={() => setDDTModalOpen(false)} unitSystem={bakingSetup.unitSystem} />}
            <RescueModal isOpen={isRescueModalOpen} onClose={() => setRescueModalOpen(false)} params={params} />
            <SaveRecipeModal
                isOpen={recipeStorage.isSaveModalOpen}
                onClose={() => recipeStorage.setIsSaveModalOpen(false)}
                recipeToSave={recipeStorage.recipeToSave}
                setRecipeToSave={recipeStorage.setRecipeToSave}
                handleSaveRecipe={recipeStorage.handleSaveRecipe}
            />
            <ViewRecipesModal
                isOpen={isRecipesModalOpen}
                onClose={() => setRecipesModalOpen(false)}
                {...recipeStorage}
            />
        </div>
    );
};

export default App;
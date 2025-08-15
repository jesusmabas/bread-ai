import React, { useState, useEffect } from 'react';
import {
  BakingParameters,
  YieldParameters,
  GuidedChoices,
  SavedRecipe,
  AIAnalysisResult,
} from '../types';
import { TranslationKey } from '../i18n/locales';

interface UseRecipeStorageProps {
    params: BakingParameters;
    yieldParams: YieldParameters;
    guidedChoices: GuidedChoices;
    setParams: React.Dispatch<React.SetStateAction<BakingParameters>>;
    setYieldParams: React.Dispatch<React.SetStateAction<YieldParameters>>;
    setGuidedChoices: React.Dispatch<React.SetStateAction<GuidedChoices>>;
    setResult: React.Dispatch<React.SetStateAction<AIAnalysisResult | null>>;
    t: (key: TranslationKey, replacements?: Record<string, string | number>) => any;
}

export const useRecipeStorage = ({
    params,
    yieldParams,
    guidedChoices,
    setParams,
    setYieldParams,
    setGuidedChoices,
    setResult,
    t,
}: UseRecipeStorageProps) => {
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [isRecipesModalOpen, setRecipesModalOpen] = useState(false);
    const [recipeToSave, setRecipeToSave] = useState<{ name: string, notes: string }>({ name: '', notes: '' });
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    useEffect(() => {
        try {
            const storedRecipes = localStorage.getItem('panaderia_recipes');
            if (storedRecipes) {
                setSavedRecipes(JSON.parse(storedRecipes));
            }
        } catch (e) {
            console.error("Failed to load recipes from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('panaderia_recipes', JSON.stringify(savedRecipes));
        } catch (e) {
            console.error("Failed to save recipes to localStorage", e);
        }
    }, [savedRecipes]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeData = urlParams.get('recipe');
        if (recipeData) {
            try {
                const decoded = atob(recipeData);
                const { params: loadedParams, yieldParams: loadedYield, guidedChoices: loadedGuided } = JSON.parse(decoded);
                setParams(loadedParams);
                setYieldParams(loadedYield);
                setGuidedChoices(loadedGuided);
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error("Failed to parse recipe from URL", e);
                alert(t('errors.urlLoadFailed'));
            }
        }
    }, [setParams, setYieldParams, setGuidedChoices, t]);

    const handleSaveRecipe = () => {
        if (!recipeToSave.name) return;
        const newRecipe: SavedRecipe = {
            id: crypto.randomUUID(),
            name: recipeToSave.name,
            notes: recipeToSave.notes,
            createdAt: new Date().toISOString(),
            params,
            yieldParams,
            guidedChoices,
        };
        setSavedRecipes(prev => [newRecipe, ...prev]);
        setIsSaveModalOpen(false);
        setRecipeToSave({ name: '', notes: '' });
    };

    const handleLoadRecipe = (recipe: SavedRecipe) => {
        setParams(recipe.params);
        setYieldParams(recipe.yieldParams);
        setGuidedChoices(recipe.guidedChoices);
        setRecipesModalOpen(false);
        setResult(null);
    };

    const handleDeleteRecipe = (id: string) => {
        if (window.confirm(t('recipes.deleteConfirm'))) {
            setSavedRecipes(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleCloneRecipe = (recipe: SavedRecipe) => {
        handleLoadRecipe(recipe);
        setRecipeToSave({ name: t('recipes.cloneName', { name: recipe.name }), notes: recipe.notes });
        setIsSaveModalOpen(true);
    };

    const handleExportRecipe = (recipe: SavedRecipe) => {
        const dataStr = JSON.stringify(recipe, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${recipe.name.replace(/\s/g, '_')}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportRecipes = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                const importedRecipe = JSON.parse(text as string) as SavedRecipe;
                if (importedRecipe.id && importedRecipe.name && importedRecipe.params) {
                    if (!savedRecipes.some(r => r.id === importedRecipe.id)) {
                        setSavedRecipes(prev => [importedRecipe, ...prev]);
                        alert(t('recipes.importSuccess', { name: importedRecipe.name }));
                    } else {
                        alert(t('recipes.importDuplicate', { name: importedRecipe.name }));
                    }
                } else {
                    throw new Error(t('errors.invalidRecipeFile'));
                }
            } catch (err) {
                alert(`${t('errors.importFailed')} ${err instanceof Error ? err.message : ''}`);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleShareRecipe = (recipe: SavedRecipe) => {
        const dataToShare = { params: recipe.params, yieldParams: recipe.yieldParams, guidedChoices: recipe.guidedChoices };
        const base64 = btoa(JSON.stringify(dataToShare));
        const url = `${window.location.origin}${window.location.pathname}?recipe=${base64}`;
        navigator.clipboard.writeText(url).then(() => {
            alert(t('recipes.shareLink.success'));
        }, () => {
            alert(`${t('recipes.shareLink.fail')} \n` + url);
        });
    };

    return {
        savedRecipes,
        isRecipesModalOpen, setRecipesModalOpen,
        isSaveModalOpen, setIsSaveModalOpen,
        recipeToSave, setRecipeToSave,
        handleSaveRecipe,
        handleLoadRecipe,
        handleDeleteRecipe,
        handleCloneRecipe,
        handleExportRecipe,
        handleImportRecipes,
        handleShareRecipe,
    };
};
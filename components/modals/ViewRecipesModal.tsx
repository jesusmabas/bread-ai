import React from 'react';
import { SavedRecipe } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

interface ViewRecipesModalProps {
    isOpen: boolean;
    onClose: () => void;
    savedRecipes: SavedRecipe[];
    handleLoadRecipe: (recipe: SavedRecipe) => void;
    handleCloneRecipe: (recipe: SavedRecipe) => void;
    handleShareRecipe: (recipe: SavedRecipe) => void;
    handleExportRecipe: (recipe: SavedRecipe) => void;
    handleDeleteRecipe: (id: string) => void;
    handleImportRecipes: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ViewRecipesModal: React.FC<ViewRecipesModalProps> = ({
    isOpen,
    onClose,
    savedRecipes,
    handleLoadRecipe,
    handleCloneRecipe,
    handleShareRecipe,
    handleExportRecipe,
    handleDeleteRecipe,
    handleImportRecipes
}) => {
    const { t } = useLocalization();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h2 className="text-xl font-bold text-amber-900">{t('header.myRecipes')}</h2>
                    <div className="flex gap-2">
                        <label htmlFor="import-recipe" className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
                           <Icon icon="fa-solid fa-upload" /> {t('common.import')}
                        </label>
                        <input type="file" id="import-recipe" accept=".json" onChange={handleImportRecipes} className="hidden"/>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                    </div>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {savedRecipes.length > 0 ? savedRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800">{recipe.name}</h3>
                                    <p className="text-sm text-gray-500 italic mt-1">{recipe.notes || t('recipes.noNotes')}</p>
                                    <p className="text-xs text-gray-400 mt-2">{t('recipes.savedOn', { date: new Date(recipe.createdAt).toLocaleDateString() })}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Tooltip text={t('common.load')}><button onClick={() => handleLoadRecipe(recipe)} className="p-2 hover:bg-amber-100 rounded-md"><Icon icon="fa-solid fa-database" className="text-amber-700 text-lg"/></button></Tooltip>
                                    <Tooltip text={t('common.clone')}><button onClick={() => handleCloneRecipe(recipe)} className="p-2 hover:bg-blue-100 rounded-md"><Icon icon="fa-solid fa-copy" className="text-blue-700 text-lg"/></button></Tooltip>
                                    <Tooltip text={t('common.share')}><button onClick={() => handleShareRecipe(recipe)} className="p-2 hover:bg-purple-100 rounded-md"><Icon icon="fa-solid fa-share-from-square" className="text-purple-700 text-lg"/></button></Tooltip>
                                    <Tooltip text={t('common.download')}><button onClick={() => handleExportRecipe(recipe)} className="p-2 hover:bg-green-100 rounded-md"><Icon icon="fa-solid fa-download" className="text-green-700 text-lg"/></button></Tooltip>
                                    <Tooltip text={t('common.delete')}><button onClick={() => handleDeleteRecipe(recipe.id)} className="p-2 hover:bg-red-100 rounded-md"><Icon icon="fa-solid fa-trash" className="text-red-700 text-lg"/></button></Tooltip>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-8">{t('recipes.empty')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
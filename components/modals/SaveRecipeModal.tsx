
import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';

interface SaveRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipeToSave: { name: string; notes: string };
    setRecipeToSave: React.Dispatch<React.SetStateAction<{ name: string; notes: string }>>;
    handleSaveRecipe: () => void;
}

export const SaveRecipeModal: React.FC<SaveRecipeModalProps> = ({ isOpen, onClose, recipeToSave, setRecipeToSave, handleSaveRecipe }) => {
    const { t } = useLocalization();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-amber-900 mb-4">{t('recipes.save.title')}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700 mb-1">{t('recipes.save.nameLabel')}</label>
                        <input type="text" id="recipe-name" value={recipeToSave.name} onChange={e => setRecipeToSave(p => ({...p, name: e.target.value}))} placeholder={t('recipes.save.namePlaceholder')} className="w-full p-2 bg-white border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="recipe-notes" className="block text-sm font-medium text-gray-700 mb-1">{t('recipes.save.notesLabel')}</label>
                        <textarea id="recipe-notes" rows={3} value={recipeToSave.notes} onChange={e => setRecipeToSave(p => ({...p, notes: e.target.value}))} placeholder={t('recipes.save.notesPlaceholder')} className="w-full p-2 bg-white border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">{t('common.cancel')}</button>
                        <button onClick={handleSaveRecipe} className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700">{t('common.save')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


import React, { useState } from 'react';
import { BakingParameters } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';
import { AlertTriangleIcon, SparklesIcon, LightbulbIcon, ChevronRightIcon } from '../Icons';
import { getRescueAdvice } from '../../services/geminiService';

interface RescueModalProps {
    isOpen: boolean;
    onClose: () => void;
    params: BakingParameters;
}

export const RescueModal: React.FC<RescueModalProps> = ({ isOpen, onClose, params }) => {
    const { t, language } = useLocalization();
    const [problem, setProblem] = useState("");
    const [advice, setAdvice] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetAdvice = async () => {
        if (!problem) {
            setError(t('rescueModal.error.noProblem'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setAdvice(null);
        try {
            const result = await getRescueAdvice(params, problem, language);
            setAdvice(result.advice);
        } catch (e) {
            setError(e instanceof Error ? e.message : t('errors.unknown'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClose = () => {
        setProblem("");
        setAdvice(null);
        setError(null);
        setIsLoading(false);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-amber-900 flex items-center"><AlertTriangleIcon className="mr-2 text-red-500" />{t('rescueModal.title')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('rescueModal.subtitle')}</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="problem-desc" className="block text-sm font-medium text-gray-700 mb-1">{t('rescueModal.problemLabel')}</label>
                        <textarea 
                            id="problem-desc"
                            rows={3}
                            value={problem}
                            onChange={e => setProblem(e.target.value)}
                            placeholder={t('rescueModal.problemPlaceholder')}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                     <button onClick={handleGetAdvice} disabled={isLoading} className="w-full flex items-center justify-center gap-2 p-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400">
                        {isLoading ? <><SparklesIcon className="animate-pulse" size={20}/>{t('rescueModal.button.loading')}</> : <><LightbulbIcon size={20}/>{t('rescueModal.button.default')}</>}
                    </button>
                </div>

                {error && <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg"><p className="font-bold">{t('common.error')}</p><p>{error}</p></div>}
                
                {advice && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-amber-900 mb-3">{t('rescueModal.resultsTitle')}</h3>
                        <ul className="space-y-3">
                            {advice.map((tip, index) => (
                                <li key={index} className="flex items-start p-3 bg-amber-50 rounded-lg">
                                    <ChevronRightIcon className="text-amber-500 mt-1 mr-2 flex-shrink-0"/>
                                    <span className="text-gray-800">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

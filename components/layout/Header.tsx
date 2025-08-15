
import React, { useState } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { UnitSystem } from '../../types';
import { WheatIcon, DatabaseIcon, GlobeIcon, MenuIcon, XIcon } from '../Icons';

const LanguageSelector: React.FC<{ language: string; onChange: (lang: string) => void; }> = ({ language, onChange }) => (
    <div className="relative">
      <select
        value={language}
        onChange={e => onChange(e.target.value)}
        className="appearance-none cursor-pointer bg-gray-100 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
      <GlobeIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
);

const UnitToggle: React.FC<{ unitSystem: UnitSystem; onChange: (system: UnitSystem) => void; }> = ({ unitSystem, onChange }) => (
    <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-full">
        <button onClick={() => onChange('metric')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${unitSystem === 'metric' ? 'bg-white text-amber-700 shadow' : 'bg-transparent text-gray-500'}`}>
            g / °C
        </button>
        <button onClick={() => onChange('imperial')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${unitSystem === 'imperial' ? 'bg-white text-amber-700 shadow' : 'bg-transparent text-gray-500'}`}>
            oz / °F
        </button>
    </div>
);


interface HeaderProps {
    onMyRecipesClick: () => void;
    language: 'en' | 'es';
    onLanguageChange: (language: string) => void;
    unitSystem: UnitSystem;
    onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMyRecipesClick, language, onLanguageChange, unitSystem, onUnitSystemChange }) => {
    const { t } = useLocalization();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center flex-shrink-0">
                        <WheatIcon className="h-8 w-8 text-amber-600 mr-2 sm:mr-3" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-amber-900 truncate">{t('header.title')}</h1>
                            <p className="text-sm text-gray-600 hidden sm:block">{t('header.subtitle')}</p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={onMyRecipesClick} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200">
                            <DatabaseIcon size={16} /> {t('header.myRecipes')}
                        </button>
                        <UnitToggle unitSystem={unitSystem} onChange={onUnitSystemChange} />
                        <LanguageSelector language={language} onChange={onLanguageChange} />
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="p-2 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-4 space-y-3 sm:px-3 bg-white shadow-lg border-t border-gray-100">
                        <button
                            onClick={() => { onMyRecipesClick(); setIsMobileMenuOpen(false); }}
                            className="w-full text-left flex items-center gap-3 px-3 py-2 text-base font-semibold text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200"
                        >
                            <DatabaseIcon size={20} />
                            {t('header.myRecipes')}
                        </button>
                        <div className="flex justify-between items-center py-2 px-3 border-t border-gray-200/60">
                            <LanguageSelector language={language} onChange={onLanguageChange} />
                            <UnitToggle unitSystem={unitSystem} onChange={onUnitSystemChange} />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

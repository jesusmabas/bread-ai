import React, { useState, useMemo } from 'react';
import { FRICTION_FACTORS } from '../constants';
import InputSlider from './InputSlider';
import { UnitSystem } from '../types';
import { celsiusToFahrenheit } from '../utils';
import { useLocalization } from '../contexts/LocalizationContext';

interface DDTCalculatorProps {
  ambientTemp: number;
  onClose: () => void;
  unitSystem: UnitSystem;
}

const DDTCalculator: React.FC<DDTCalculatorProps> = ({ ambientTemp, onClose, unitSystem }) => {
  const { t, formatNumber } = useLocalization();
  const [ddtParams, setDdtParams] = useState({
    targetTemp: 25,
    flourTemp: ambientTemp,
    prefermentTemp: 25,
    usePreferment: false,
    frictionType: 'spiral',
    nFactor: 3,
  });

  const handleSliderChange = (field: keyof typeof ddtParams, e: React.ChangeEvent<HTMLInputElement>) => {
     setDdtParams(prev => ({ ...prev, [field]: parseFloat(e.target.value) }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     setDdtParams(prev => ({ ...prev, frictionType: e.target.value }));
  };

  const calculatedWaterTemp = useMemo(() => {
    const { targetTemp, flourTemp, prefermentTemp, usePreferment, frictionType, nFactor } = ddtParams;
    const friction = FRICTION_FACTORS[frictionType].value;
    
    const n = usePreferment ? nFactor + 1 : nFactor;

    const otherTemps = ambientTemp + flourTemp + friction + (usePreferment ? prefermentTemp : 0);
    
    return (n * targetTemp) - otherTemps;
  }, [ddtParams, ambientTemp]);
  
  const frictionOptions = useMemo(() => (
    Object.entries(FRICTION_FACTORS).map(([key, { value }]) => ({
      key,
      name: t(`frictionFactors.${key}` as any),
      value
    }))
  ), [t]);


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-amber-900">{t('ddt.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">{t('ddt.description')}</p>
        
        <div className="space-y-5">
            <InputSlider label={t('ddt.desiredTemp')} value={ddtParams.targetTemp} onChange={e => handleSliderChange('targetTemp', e)} min={20} max={30} step={0.5} unit="°C" unitSystem={unitSystem} />
            <InputSlider label={t('ddt.flourTemp')} value={ddtParams.flourTemp} onChange={e => handleSliderChange('flourTemp', e)} min={10} max={35} step={0.5} unit="°C" unitSystem={unitSystem}/>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('ddt.mixerFriction')}</label>
                <select value={ddtParams.frictionType} onChange={handleSelectChange} className="w-full p-2 bg-white border border-gray-300 rounded-md">
                    {frictionOptions.map(({ key, name, value }) => (
                        <option key={key} value={key}>{name} (~{value}°C)</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <label htmlFor="usePreferment" className="text-sm font-medium text-gray-700">{t('ddt.usePreferment')}</label>
                <input 
                    id="usePreferment"
                    type="checkbox" 
                    checked={ddtParams.usePreferment} 
                    onChange={e => setDdtParams(p => ({...p, usePreferment: e.target.checked}))}
                    className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
            </div>

            {ddtParams.usePreferment && (
                <div className="pl-4 border-l-4 border-amber-200 animate-fade-in">
                    <InputSlider label={t('ddt.prefermentTemp')} value={ddtParams.prefermentTemp} onChange={e => handleSliderChange('prefermentTemp', e)} min={4} max={30} step={0.5} unit="°C" unitSystem={unitSystem}/>
                </div>
            )}

            <InputSlider label={t('ddt.nFactor')} value={ddtParams.nFactor} onChange={e => handleSliderChange('nFactor', e)} min={2} max={4} step={1} unit="" unitSystem={unitSystem}/>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm font-medium text-gray-600">{t('ddt.requiredWaterTemp')}</p>
            <p className="text-5xl font-bold text-amber-600 my-2">
                {unitSystem === 'metric' 
                    ? `${formatNumber(calculatedWaterTemp, {maximumFractionDigits: 1})}°C`
                    : `${formatNumber(celsiusToFahrenheit(calculatedWaterTemp), {maximumFractionDigits: 1})}°F`
                }
            </p>
        </div>
        
      </div>
    </div>
  );
};

export default DDTCalculator;
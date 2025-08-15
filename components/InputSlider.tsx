import React, { useState, useEffect } from 'react';
import { UnitSystem } from '../types';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '../utils';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unitSystem: UnitSystem;
}

const InputSlider: React.FC<InputSliderProps> = ({ label, value, min, max, step, unit, onChange, unitSystem }) => {
  const isImperialTemp = unitSystem === 'imperial' && unit === '°C';

  const displayValue = isImperialTemp ? celsiusToFahrenheit(value) : value;
  const displayMin = isImperialTemp ? celsiusToFahrenheit(min) : min;
  const displayMax = isImperialTemp ? celsiusToFahrenheit(max) : max;
  const displayUnit = isImperialTemp ? '°F' : unit;
  const rangeStep = isImperialTemp ? 1 : step;
  const numberInputStep = isImperialTemp ? 1 : step;
  
  const inputId = `slider-text-input-${label.replace(/\s+/g, '-')}`;

  // Local state for the text input to allow for intermediate values (e.g., "5.")
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    const inputIsFocused = document.activeElement?.id === inputId;
    // Only update text field from props if it's not being actively edited.
    if (!inputIsFocused) {
      const precision = unit.includes('%') || !isImperialTemp ? 1 : 0;
      setTextValue(displayValue.toFixed(precision));
    }
  }, [displayValue, unit, isImperialTemp, inputId]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseFloat(e.target.value);
    const event = {
        target: { value: (isImperialTemp ? fahrenheitToCelsius(sliderValue) : sliderValue).toString() }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const commitTextChange = (inputValue: string) => {
    let numericValue = parseFloat(inputValue);

    if (isNaN(numericValue)) {
        // if invalid, reset to the last valid value from props
        const precision = unit.includes('%') || !isImperialTemp ? 1 : 0;
        setTextValue(displayValue.toFixed(precision));
        return;
    }

    // Clamp value
    const clampedValue = Math.max(displayMin, Math.min(displayMax, numericValue));
    
    const event = {
        target: { value: (isImperialTemp ? fahrenheitToCelsius(clampedValue) : clampedValue).toString() }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    commitTextChange(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        commitTextChange((e.target as HTMLInputElement).value);
        (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
        <label htmlFor={inputId}>{label}</label>
        <div className="flex items-center gap-1">
            <input
                id={inputId}
                type="number"
                value={textValue}
                min={displayMin}
                max={displayMax}
                step={numberInputStep}
                onChange={handleTextChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-20 text-right font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-md py-1 px-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          <span className="font-semibold text-gray-600 w-4 text-left">{displayUnit}</span>
        </div>
      </div>
      <input
        aria-label={label}
        type="range"
        min={displayMin}
        max={displayMax}
        step={rangeStep}
        value={displayValue}
        onChange={handleRangeChange}
        className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
      />
    </div>
  );
};

export default InputSlider;

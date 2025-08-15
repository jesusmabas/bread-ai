/**
 * Formats a given number of hours into a readable time range string (e.g., "2h 45m - 3h 30m").
 * The range is calculated as ±15% of the input hours.
 * @param hours The base duration in hours.
 * @returns A formatted string representing the time range.
 */
export const formatHoursToRangeString = (hours: number): string => {
  const minHours = hours * 0.85;
  const maxHours = hours * 1.15;

  const format = (h: number) => {
    if (h <= 0) return "0m";
    const totalMinutes = Math.round(h * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0 && mins > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (hrs > 0) {
      return `${hrs}h`;
    }
    return `${mins}m`;
  };

  return `${format(minHours)} - ${format(maxHours)}`;
};


/**
 * Parses a duration string (e.g., "2h 58m - 4h 1m") into a single average number of hours for charting.
 * @param durationStr The string to parse.
 * @returns The average duration in hours.
 */
export const parseDurationToHours = (durationStr: string): number => {
  if (!durationStr) return 0;
  
  const timeParts = durationStr.split(' - ');
  
  let totalHours = 0;
  let count = 0;

  for (const part of timeParts) {
    let hoursInPart = 0;
    const hourMatch = part.match(/(\d+)\s*h/);
    const minMatch = part.match(/(\d+)\s*m/);

    if (hourMatch) {
      hoursInPart += parseInt(hourMatch[1], 10);
    }
    if (minMatch) {
      hoursInPart += parseInt(minMatch[1], 10) / 60;
    }
    
    if (hoursInPart > 0) {
        totalHours += hoursInPart;
        count++;
    }
  }

  return count > 0 ? totalHours / count : 0;
};

/**
 * Parses a string that may contain a comma as a decimal separator into a number.
 * @param value The string or number to parse.
 * @returns A number, or NaN if parsing fails.
 */
export const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return NaN;
    if (value.trim() === '') return 0; // Handle empty string as 0 for user-friendliness
    return parseFloat(value.replace(',', '.'));
};


// --- Unit Conversion Utilities ---

export const celsiusToFahrenheit = (c: number): number => c * 9 / 5 + 32;
export const fahrenheitToCelsius = (f: number): number => (f - 32) * 5 / 9;
export const gramsToOunces = (g: number): number => g / 28.3495;
export const ouncesToGrams = (oz: number): number => oz * 28.3495;
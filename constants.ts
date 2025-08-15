import { FlourType, YeastType, StarterActivity, BakingStyle, Preset, GuidedCrumb, GuidedCrust, GuidedLeavening, BakingParameters, OvenProfile, PrefermentType } from './types';
import { LoafIcon, BaguetteIcon, CiabattaIcon, WheatIcon, FocacciaIcon, PizzaIcon } from './components/Icons';

export const FLOUR_OPTIONS = {
  [FlourType.HIGH_GLUTEN]: { name: 'High-Gluten (13-14% protein)', description: 'Ideal for bagels, NY-style pizza, and long fermentations.' },
  [FlourType.BREAD]: { name: 'Bread Flour (11-13% protein)', description: 'The standard for artisan breads, providing good structure.' },
  [FlourType.PIZZA_00]: { name: '`00` Pizza Flour (12-13% protein)', description: 'Finely milled Italian flour for Neapolitan pizza.'},
  [FlourType.ALL_PURPOSE]: { name: 'All-Purpose (9-11% protein)', description: 'Versatile, but may result in a slightly denser crumb.' },
  [FlourType.WHOLE_WHEAT]: { name: 'Whole Wheat / Rye', description: 'Contains bran and germ, which can speed up fermentation.' },
};

export const YEAST_OPTIONS = {
  [YeastType.INSTANT]: { name: 'Instant Dry Yeast' },
  [YeastType.ACTIVE_DRY]: { name: 'Active Dry Yeast' },
  [YeastType.FRESH]: { name: 'Fresh Yeast' },
  [YeastType.SOURDOUGH]: { name: 'Sourdough Starter' },
};

export const STARTER_ACTIVITY_OPTIONS = {
  [StarterActivity.SLOW]: { name: 'Slow (doubles in >8h at 24°C)' },
  [StarterActivity.NORMAL]: { name: 'Normal (doubles in 4-6h at 24°C)' },
  [StarterActivity.FAST]: { name: 'Fast (doubles in <4h at 24°C)' },
};

export const PREFERMENT_TYPE_OPTIONS: Record<PrefermentType, { name: string; description: string; defaultHydration: number; }> = {
    [PrefermentType.POOLISH]: { name: 'Poolish', description: 'A wet (100% hydration) sponge that adds extensibility and flavor.', defaultHydration: 100 },
    [PrefermentType.BIGA]: { name: 'Biga', description: 'A stiff (50-60% hydration) preferment that adds strength and a tangy flavor.', defaultHydration: 60 },
};

export const GUIDED_CRUMB_OPTIONS: Record<GuidedCrumb, {name: string; description: string; params: Partial<BakingParameters>}> = {
  [GuidedCrumb.TIGHT]: { name: 'Soft & Tight', description: 'Lower hydration (62-68%). Easier to handle, good for sandwich loaves.', params: { hydration: 65 } },
  [GuidedCrumb.MEDIUM]: { name: 'Medium & Regular', description: 'Medium hydration (70-76%). A versatile, all-purpose crumb.', params: { hydration: 73 } },
  [GuidedCrumb.AIRY]: { name: 'Open & Airy', description: 'High hydration (78-85%+). Challenging but rewarding, typical of Ciabatta.', params: { hydration: 80 } },
};

export const GUIDED_CRUST_OPTIONS: Record<GuidedCrust, {name: string; description: string; params: Partial<BakingParameters>}> = {
    [GuidedCrust.SOFT]: { name: 'Soft & Tender', description: 'Achieved with lower salt and some enrichment (sugar/fat).', params: { salt: 1.8, sugar: 2, fat: 2 } },
    [GuidedCrust.CRISPY]: { name: 'Crispy', description: 'A standard lean dough with moderate salt.', params: { salt: 2.2, sugar: 0, fat: 0 } },
    [GuidedCrust.RUSTIC]: { name: 'Dark & Rustic', description: 'Higher salt promotes a deeply colored, flavorful crust.', params: { salt: 2.5, sugar: 0, fat: 0 } },
};

export const GUIDED_LEAVENING_OPTIONS: Record<GuidedLeavening, {name: string; description: string; params: Partial<BakingParameters>}> = {
  [GuidedLeavening.QUICK_YEAST]: { name: 'Quick (Yeast)', description: 'Faster fermentation using commercial yeast.', params: { yeastType: YeastType.INSTANT, yeastAmount: 1.2 } },
  [GuidedLeavening.BALANCED]: { name: 'Balanced', description: 'A mild sourdough flavor, often called a "hybrid" approach.', params: { yeastType: YeastType.SOURDOUGH, yeastAmount: 15, sourdoughStarterActivity: StarterActivity.NORMAL } },
  [GuidedLeavening.SLOW_SOURDOUGH]: { name: 'Slow & Complex (Sourdough)', description: 'Classic, slow sourdough fermentation for maximum flavor.', params: { yeastType: YeastType.SOURDOUGH, yeastAmount: 25, sourdoughStarterActivity: StarterActivity.NORMAL } },
};


// Typical friction gain in °C for different mixing methods
export const FRICTION_FACTORS: Record<string, {name: string, value: number}> = {
  manual: { name: 'Manual / Hand Mix', value: 1 },
  spiral: { name: 'Spiral Mixer', value: 9 },
  planetary: { name: 'Planetary Mixer', value: 14 },
};

export const OVEN_PROFILE_OPTIONS: Record<OvenProfile, { name: string; description: string; }> = {
    [OvenProfile.STANDARD_HOME]: { name: 'Standard Home Oven', description: 'Standard bake/roast setting. Heat comes from bottom/top elements.' },
    [OvenProfile.CONVECTION]: { name: 'Convection / Fan Oven', description: 'Uses a fan to circulate air, cooks faster and more evenly.' },
    [OvenProfile.BAKING_STEEL]: { name: 'Baking Steel', description: 'High thermal conductivity, great for pizza and hearth breads. Requires long preheat.' },
    [OvenProfile.BAKING_STONE]: { name: 'Baking Stone', description: 'Retains heat well, mimics a traditional bread oven. Requires long preheat.' },
    [OvenProfile.WOOD_FIRED]: { name: 'Wood-Fired Oven', description: 'Extremely high temperatures (450°C+), ideal for Neapolitan pizza.' },
};

export const PRESETS: Record<BakingStyle, Preset> = {
    [BakingStyle.COUNTRY_LOAF]: {
        name: 'Country Loaf',
        icon: LoafIcon,
        description: 'Classic sourdough loaf with an open crumb and crispy crust.',
        flourType: FlourType.BREAD,
        hydration: 75,
        yeastType: YeastType.SOURDOUGH,
        yeastAmount: 20,
        sourdoughStarterActivity: StarterActivity.NORMAL,
        salt: 2,
        sugar: 0,
        fat: 0,
        pieceWeight: 900,
        numPieces: 2,
        ovenProfile: OvenProfile.BAKING_STONE,
    },
    [BakingStyle.BAGUETTE]: {
        name: 'Baguette',
        icon: BaguetteIcon,
        description: 'A lean, crispy French classic. Requires gentle handling.',
        flourType: FlourType.BREAD,
        hydration: 68,
        yeastType: YeastType.INSTANT,
        yeastAmount: 0.8,
        salt: 2,
        sugar: 0,
        fat: 0,
        pieceWeight: 350,
        numPieces: 4,
        ovenProfile: OvenProfile.BAKING_STONE,
    },
    [BakingStyle.CIABATTA]: {
        name: 'Ciabatta',
        icon: CiabattaIcon,
        description: 'A very high hydration Italian bread with large, irregular holes.',
        flourType: FlourType.BREAD,
        hydration: 85,
        yeastType: YeastType.INSTANT,
        yeastAmount: 0.6,
        salt: 2.2,
        sugar: 0,
        fat: 0,
        pieceWeight: 500,
        numPieces: 2,
        ovenProfile: OvenProfile.BAKING_STONE,
    },
    [BakingStyle.WHOLE_WHEAT]: {
        name: 'Whole Wheat',
        icon: WheatIcon,
        description: 'A nutritious loaf using whole grain flour, which ferments faster.',
        flourType: FlourType.WHOLE_WHEAT,
        hydration: 80,
        yeastType: YeastType.SOURDOUGH,
        yeastAmount: 25,
        sourdoughStarterActivity: StarterActivity.NORMAL,
        salt: 2,
        sugar: 1,
        fat: 0,
        pieceWeight: 850,
        numPieces: 2,
        ovenProfile: OvenProfile.BAKING_STONE,
    },
    [BakingStyle.FOCACCIA]: {
        name: 'Focaccia',
        icon: FocacciaIcon,
        description: 'Pillowy, dimpled Italian flatbread, rich with olive oil.',
        flourType: FlourType.ALL_PURPOSE,
        hydration: 80,
        yeastType: YeastType.INSTANT,
        yeastAmount: 1.2,
        salt: 2,
        sugar: 0,
        fat: 5,
        pieceWeight: 800,
        numPieces: 1,
        ovenProfile: OvenProfile.STANDARD_HOME,
    },
    [BakingStyle.NEAPOLITAN_PIZZA]: {
        name: 'Neapolitan',
        icon: PizzaIcon,
        description: 'Soft, tender, and foldable with a puffy "cornicione". Baked hot and fast.',
        flourType: FlourType.PIZZA_00,
        hydration: 62,
        yeastType: YeastType.FRESH,
        yeastAmount: 0.2,
        salt: 2.8,
        sugar: 0,
        fat: 0,
        pieceWeight: 260,
        numPieces: 4,
        ovenProfile: OvenProfile.WOOD_FIRED,
    },
    [BakingStyle.ROMAN_PIZZA]: {
        name: 'Roman Pizza',
        icon: FocacciaIcon,
        description: 'Crispy, airy "pizza in pala". High hydration and long, cold fermentation.',
        flourType: FlourType.BREAD,
        hydration: 80,
        yeastType: YeastType.SOURDOUGH,
        yeastAmount: 15,
        sourdoughStarterActivity: StarterActivity.NORMAL,
        salt: 2.5,
        sugar: 0,
        fat: 2,
        pieceWeight: 400,
        numPieces: 2,
        ovenProfile: OvenProfile.BAKING_STEEL,
    },
    [BakingStyle.NY_PIZZA]: {
        name: 'NY Style',
        icon: PizzaIcon,
        description: 'Large, thin, foldable slices. Often contains sugar and oil for tenderness.',
        flourType: FlourType.HIGH_GLUTEN,
        hydration: 63,
        yeastType: YeastType.INSTANT,
        yeastAmount: 0.5,
        salt: 2.5,
        sugar: 2,
        fat: 2,
        pieceWeight: 350,
        numPieces: 3,
        ovenProfile: OvenProfile.BAKING_STEEL,
    },
    [BakingStyle.PAN_PIZZA]: {
        name: 'Pan Pizza',
        icon: FocacciaIcon,
        description: 'Thick, chewy, and crispy with a fried-like bottom crust. "Al taglio" style.',
        flourType: FlourType.BREAD,
        hydration: 70,
        yeastType: YeastType.INSTANT,
        yeastAmount: 1.5,
        salt: 2,
        sugar: 0,
        fat: 4,
        pieceWeight: 500,
        numPieces: 2,
        ovenProfile: OvenProfile.STANDARD_HOME,
    },
};
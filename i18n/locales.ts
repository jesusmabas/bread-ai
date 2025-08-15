

export const en = {
    header: {
        title: "Bread AI",
        subtitle: "Your intelligent baking assistant.",
        myRecipes: "My recipes"
    },
    common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        clone: "Clone",
        share: "Share",
        download: "Download",
        import: "Import",
        load: "Load",
        print: "Print",
        error: "Error",
        daysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    planner: {
        title: "Natural language planner",
        placeholder: [
            "I want to bake two 900g country loaves for Sunday morning.",
            "Plan a high-hydration ciabatta. I'm only free between 6 PM and 10 PM on weekdays.",
            "Four 280g Neapolitan pizzas with a 24-hour cold ferment. My kitchen is 22°C.",
            "A simple focaccia using instant yeast, ready in about 5 hours.",
            "Sourdough baguette recipe, but I need to use a poolish preferment."
        ],
        button: {
            default: "Create plan with AI",
            loading: "Thinking..."
        },
        proFeature: {
            title: "Pro feature",
            description: "Switch to the AI Baker to create plans from natural language."
        }
    },
    guided: {
        title: "Guided setup",
        crumb: {
            label: "Desired crumb",
            options: {
                tight: "Soft & tight",
                medium: "Medium & regular",
                airy: "Open & airy"
            }
        },
        crust: {
            label: "Desired crust",
            options: {
                soft: "Soft & tender",
                crispy: "Crispy",
                rustic: "Dark & rustic"
            }
        },
        leavening: {
            label: "Leavening pace",
            options: {
                "quick-yeast": "Quick (yeast)",
                balanced: "Balanced",
                "slow-sourdough": "Slow & complex (sourdough)"
            }
        }
    },
    presets: {
        title: "Quick start: Choose a style",
        "country-loaf": { name: "Country loaf", description: "Classic sourdough loaf with an open crumb and crispy crust." },
        baguette: { name: "Baguette", description: "A lean, crispy French classic. Requires gentle handling." },
        ciabatta: { name: "Ciabatta", description: "A very high hydration Italian bread with large, irregular holes." },
        "whole-wheat": { name: "Whole wheat", description: "A nutritious loaf using whole grain flour, which ferments faster." },
        focaccia: { name: "Focaccia", description: "Pillowy, dimpled Italian flatbread, rich with olive oil." },
        "neapolitan-pizza": { name: "Neapolitan", description: "Soft, tender, and foldable with a puffy 'cornicione'. Baked hot and fast." },
        "roman-pizza": { name: "Roman pizza", description: "Crispy, airy 'pizza in pala'. High hydration and long, cold fermentation." },
        "ny-pizza": { name: "NY style", description: "Large, thin, foldable slices. Often contains sugar and oil for tenderness." },
        "pan-pizza": { name: "Pan pizza", description: "Thick, chewy, and crispy with a fried-like bottom crust. 'Al taglio' style." }
    },
    yield: {
        title: "Yield & sizing",
        totalFlour: "Total flour",
        pieces: "Pieces",
        weightPerPiece: "Weight/piece"
    },
    advanced: {
        title: "Advanced techniques",
        preferment: {
            label: "Use preferment (poolish/biga)",
            type: "Type",
            flourPct: "% flour in preferment",
            hydration: "Preferment hydration",
            yeastPct: "% yeast (on preferment flour)",
            fermentationHours: "Preferment fermentation time",
            fermentationTemp: "Preferment fermentation temp"
        },
        coldFermentation: {
            label: "Use cold fermentation",
            durationHours: "Duration",
            temperature: "Fridge temperature"
        },
        bakeTimeTarget: "Target bake time",
        workSchedule: {
            label: "Active baking hours",
            description: "Define a window for active tasks like mixing and shaping. The AI will use passive fermentation (especially cold) to bridge time outside this window.",
            startTime: "Start time",
            endTime: "End time",
            availableDays: "Available days"
        }
    },
    params: {
        title: "Dough parameters",
        mode: { simple: "Simple", pro: "Pro" },
        flourType: "Flour type",
        leaveningAgent: "Leavening agent",
        starterActivity: "Starter activity",
        hydration: "Hydration",
        salt: "Salt",
        ambientTemp: "Ambient temp",
        starter: "Starter",
        yeast: "Yeast",
        sugar: "Sugar",
        fat: "Fat",
        ovenProfile: "Oven profile",
        ddt: {
            title: "Water temp calculator (DDT)",
            button: "Open DDT calculator"
        },
        advancedModel: {
            title: "Advanced fermentation model",
            q10: "Q10 factor",
            tRef: "Reference temp (T_ref)"
        }
    },
    ingredients: {
        title: "Total ingredients",
        preferment: {
            title: "Preferment ingredients",
            asIngredient: "Preferment",
            total: "Total preferment"
        },
        finalDough: {
            title: "Final dough ingredients"
        },
        flour: "Flour",
        water: "Water",
        salt: "Salt",
        sugar: "Sugar",
        fat: "Fat",
        total: "Total Dough"
    },
    doughInsights: {
        title: "Dough insights",
        finalSalinity: "Final salinity",
        salinity: {
            normal: "This salinity level is well-balanced for flavor and fermentation.",
            high: "High salinity typical for pizza; can slightly tighten gluten.",
            low: "Low salinity; may result in a faster fermentation and less flavor."
        },
        elasticity: "Elasticity",
        extensibility: "Extensibility",
        extensibilityMessages: {
            balanced: "A balanced dough, suitable for most shaping.",
            high: "Very extensible dough. Handle gently to maintain strength; consider adding folds.",
            low: "Very elastic dough. Ensure adequate rest periods before shaping to prevent tearing."
        },
        hydrationFeel: {
            title: "Dough feel (apparent hydration)",
            balanced: "Dough should have a balanced, manageable feel.",
            very_wet: "Expect a very wet and slack dough, which can be tricky to handle but may yield an open crumb.",
            manageable: "Dough will be sticky but manageable with wet hands or a scraper.",
            firm: "Dough will be firm and easy to handle, likely resulting in a tighter crumb."
        },
        warnings: {
            highHydration: "High hydration (>85%) can be challenging. Expect a very wet dough.",
            highSalt: "High salt level (>3.5%) can significantly slow fermentation and tighten the dough.",
            negativeWater: "The amount of starter is very high compared to the overall hydration. This will result in negative fresh water. Please increase hydration or reduce starter percentage.",
            prefermentWater: "Water in preferment exceeds total recipe water. Increase overall hydration or decrease preferment hydration/amount.",
            longColdFerment: "Cold fermentation over 72 hours increases the risk of excessive acidity and gluten degradation."
        }
    },
    yeastAid: {
        title: "Visual guide:",
        scantHalfTsp: "approx. a scant 1/2 tsp",
        quarterTsp: "approx. 1/4 tsp",
        generousEighthTsp: "approx. a generous 1/8 tsp",
        eighthTsp: "approx. 1/8 tsp",
        pinch: "a good pinch (like for salt)",
        fewGrains: "just a few grains"
    },
    calculatorEngine: {
        label: "Plan generator",
        ai: "AI baker (pro)",
        formula: "Formula (free)"
    },
    mainButton: {
        default: "Generate plan",
        loading: "Analyzing..."
    },
    results: {
        titleAI: "AI baking analysis",
        titleFormula: "Formula-based plan",
        bulkFermentation: "Bulk fermentation",
        finalProof: "Final proof",
        coldProof: "Cold fermentation",
        fermentationCurve: "Fermentation curve",
        proTips: "Pro tips",
        coldFermentation: {
            title: "Cold fermentation tip",
            instructions: "Instructions"
        },
        formulaOverview: "This plan is generated using a deterministic formula based on your parameters. For personalized tips, a detailed timeline, and qualitative analysis, switch to the AI Baker (Pro) engine.",
        formulaNotes: {
            bulk: "Wait for the dough to increase in volume and show some bubbles on the surface.",
            proof: "The dough should look puffy and spring back slowly when poked gently.",
            cold: "The dough will rise slowly in the fridge, developing flavor."
        },
        formulaProTip: "Switch to the AI Baker for pro-tips tailored to your specific ingredients and oven!"
    },
    timeline: {
        liveTitle: "Live timeline",
        printTitle: "Timeline checklist",
        getHelp: "My dough seems off... Get help!",
        status: {
            done: "Done",
            markComplete: "Mark complete",
            start: "Start"
        },
        schedule: {
            title: "Baking schedule"
        },
        steps: {
            mixing: "Mixing",
            bulk: "Bulk fermentation",
            shaping: "Shaping",
            proofing: "Final proofing",
            cold: "Cold fermentation",
            baking: "Baking"
        },
        details: {
            mixing: "Combine ingredients as per recipe. Develop gluten to the desired windowpane stage.",
            bulk: "Let the dough ferment at the specified ambient temperature, performing folds if necessary.",
            shaping: "Gently pre-shape and then final shape the dough into its desired form.",
            proofing: "Let the shaped dough proof until it passes the poke test.",
            cold: "Place shaped dough in the refrigerator for {hours} hours.",
            baking: "Preheat your oven and bake according to the recipe's instructions for temperature and steam."
        }
    },
    rescueModal: {
        title: "Dough rescue mode",
        subtitle: "Get AI-powered help for your dough emergency.",
        problemLabel: "Describe the problem:",
        problemPlaceholder: "e.g., 'My dough has barely risen after 3 hours' or 'It's super sticky and spread out after shaping.'",
        button: {
            default: "Get rescue advice",
            loading: "Analyzing..."
        },
        resultsTitle: "Here's what you can try:",
        error: {
            noProblem: "Please describe the problem with your dough."
        }
    },
    recipes: {
        save: {
            title: "Save recipe",
            nameLabel: "Recipe name",
            namePlaceholder: "e.g., My Favorite Country Loaf",
            notesLabel: "Notes / version",
            notesPlaceholder: "e.g., Used Caputo Pizzeria flour, lot 08/2025. Reduced hydration to 72%."
        },
        noNotes: "No notes for this version.",
        savedOn: "Saved on: {date}",
        deleteConfirm: "Are you sure you want to delete this recipe?",
        cloneName: "{name} (copy)",
        importSuccess: "Recipe \"{name}\" imported successfully!",
        importDuplicate: "Recipe \"{name}\" is already in your library.",
        empty: "You haven't saved any recipes yet. Create a recipe and click the 'Save' icon to get started!",
        shareLink: {
            success: "Shareable link copied to clipboard!",
            fail: "Failed to copy link. Please copy it manually:"
        }
    },
    ddt: {
        title: "Water temp calculator (DDT)",
        description: "Calculate the required water temperature to hit your Desired Dough Temperature (DDT).",
        desiredTemp: "Desired dough temp",
        flourTemp: "Flour temp",
        mixerFriction: "Mixer friction",
        usePreferment: "Using preferment?",
        prefermentTemp: "Preferment temp",
        nFactor: "N-factor (thermal masses)",
        requiredWaterTemp: "Required water temperature:"
    },
    loading: {
        title: "Activating AI baker...",
        messages: [
            "Consulting the master bakers...",
            "Analyzing your dough's potential...",
            "Calculating the perfect rise...",
            "Warming up the proofer...",
            "Unlocking fermentation secrets...",
        ]
    },
    tooltips: {
        starterActivity: "Sourdough activity is crucial. Judge based on how long your starter takes to double in volume after feeding at room temperature.",
        ddt: "Calculate the required water temperature to achieve your desired final dough temperature.",
        q10: "Adjust the scientific model for fermentation. Q10 is the rate of fermentation change for every 10°C."
    },
    flourTypes: {
        "high-gluten": "High-gluten (13-14% protein)",
        bread: "Bread flour (11-13% protein)",
        "pizza-00": "`00` pizza flour (12-13% protein)",
        "all-purpose": "All-purpose (9-11% protein)",
        "whole-wheat": "Whole wheat / rye"
    },
    yeastTypes: {
        instant: "Instant dry yeast",
        "active-dry": "Active dry yeast",
        fresh: "Fresh yeast",
        sourdough: "Sourdough starter"
    },
    starterActivities: {
        slow: "Slow (doubles in >8h at 24°C)",
        normal: "Normal (doubles in 4-6h at 24°C)",
        fast: "Fast (doubles in <4h at 24°C)"
    },
    prefermentTypes: {
        poolish: { name: "Poolish" },
        biga: { name: "Biga" }
    },
    ovenProfiles: {
        "standard-home": "Standard home oven",
        convection: "Convection / fan oven",
        "baking-steel": "Baking steel",
        "baking-stone": "Baking stone",
        "wood-fired": "Wood-fired oven"
    },
    frictionFactors: {
        manual: "Manual / hand mix",
        spiral: "Spiral mixer",
        planetary: "Planetary mixer"
    },
    errors: {
        unknown: "An unexpected error occurred.",
        aiPlan: "An unexpected error occurred while generating the AI plan.",
        urlLoadFailed: "Could not load the recipe from the link. It might be corrupted.",
        invalidRecipeFile: "Invalid recipe file format.",
        importFailed: "Failed to import recipe:"
    }
};

export const es: typeof en = {
    header: {
        title: "Pan AI",
        subtitle: "Tu asistente de panadería inteligente.",
        myRecipes: "Mis recetas"
    },
    common: {
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        clone: "Clonar",
        share: "Compartir",
        download: "Descargar",
        import: "Importar",
        load: "Cargar",
        print: "Imprimir",
        error: "Error",
        daysShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    },
    planner: {
        title: "Planificador por lenguaje natural",
        placeholder: [
            "Quiero hornear dos hogazas de 900g para el domingo por la mañana.",
            "Planifica una chapata de alta hidratación. Solo estoy libre entre las 18:00 y las 22:00 los días de diario.",
            "Cuatro pizzas napolitanas de 280g con 24h de fermentación en frío. Mi cocina está a 22°C.",
            "Una receta sencilla de focaccia con levadura instantánea, lista en unas 5 horas.",
            "Receta de baguette de masa madre, pero usando un prefermento poolish."
        ],
        button: {
            default: "Crear plan con IA",
            loading: "Pensando..."
        },
        proFeature: {
            title: "Función pro",
            description: "Cambia a Panadero IA para crear planes desde lenguaje natural."
        }
    },
    guided: {
        title: "Configuración guiada",
        crumb: {
            label: "Miga deseada",
            options: {
                tight: "Suave y compacta",
                medium: "Media y regular",
                airy: "Abierta y aireada"
            }
        },
        crust: {
            label: "Corteza deseada",
            options: {
                soft: "Suave y tierna",
                crispy: "Crujiente",
                rustic: "Oscura y rústica"
            }
        },
        leavening: {
            label: "Ritmo de fermentación",
            options: {
                "quick-yeast": "Rápida (levadura)",
                balanced: "Equilibrada",
                "slow-sourdough": "Lenta y compleja (masa madre)"
            }
        }
    },
    presets: {
        title: "Inicio rápido: Elige un estilo",
        "country-loaf": { name: "Pan de campo", description: "Clásico pan de masa madre con miga abierta y corteza crujiente." },
        baguette: { name: "Baguette", description: "Un clásico francés, magro y crujiente. Requiere manejo delicado." },
        ciabatta: { name: "Chapata", description: "Pan italiano de muy alta hidratación con alveolos grandes e irregulares." },
        "whole-wheat": { name: "Pan integral", description: "Un pan nutritivo con harina integral, que fermenta más rápido." },
        focaccia: { name: "Focaccia", description: "Pan plano italiano, esponjoso y cubierto de aceite de oliva." },
        "neapolitan-pizza": { name: "Pizza napolitana", description: "Suave, tierna y plegable con un 'cornicione' inflado. Horneada muy caliente y rápido." },
        "roman-pizza": { name: "Pizza romana", description: "Crujiente y aireada 'pizza in pala'. Alta hidratación y fermentación larga en frío." },
        "ny-pizza": { name: "Pizza estilo NY", description: "Porciones grandes, finas y plegables. A menudo con azúcar y aceite." },
        "pan-pizza": { name: "Pizza de molde", description: "Gruesa, masticable y crujiente con una base frita. Estilo 'al taglio'." }
    },
    yield: {
        title: "Rendimiento y tamaño",
        totalFlour: "Harina total",
        pieces: "Piezas",
        weightPerPiece: "Peso/pieza"
    },
    advanced: {
        title: "Técnicas avanzadas",
        preferment: {
            label: "Usar prefermento (poolish/biga)",
            type: "Tipo",
            flourPct: "% harina en prefermento",
            hydration: "Hidratación del prefermento",
            yeastPct: "% levadura (sobre harina del prefermento)",
            fermentationHours: "Tiempo fermentación prefermento",
            fermentationTemp: "Temp. fermentación prefermento"
        },
        coldFermentation: {
            label: "Usar fermentación en frío",
            durationHours: "Duración",
            temperature: "Temperatura del frigorífico"
        },
        bakeTimeTarget: "Hora de horneado objetivo",
        workSchedule: {
            label: "Horario de horneado activo",
            description: "Define una ventana para tareas activas como mezclar y formar. La IA usará fermentación pasiva (especialmente en frío) para cubrir el tiempo fuera de esta ventana.",
            startTime: "Hora de inicio",
            endTime: "Hora de fin",
            availableDays: "Días disponibles"
        }
    },
    params: {
        title: "Parámetros de la masa",
        mode: { simple: "Sencillo", pro: "Pro" },
        flourType: "Tipo de harina",
        leaveningAgent: "Agente leudante",
        starterActivity: "Actividad de la masa madre",
        hydration: "Hidratación",
        salt: "Sal",
        ambientTemp: "Temp. ambiente",
        starter: "Masa madre",
        yeast: "Levadura",
        sugar: "Azúcar",
        fat: "Grasa",
        ovenProfile: "Perfil del horno",
        ddt: {
            title: "Calculadora de TDA",
            button: "Abrir calculadora de TDA"
        },
        advancedModel: {
            title: "Modelo de fermentación avanzado",
            q10: "Factor Q10",
            tRef: "Temp. de referencia (T_ref)"
        }
    },
    ingredients: {
        title: "Ingredientes totales",
        preferment: {
            title: "Ingredientes del prefermento",
            asIngredient: "Prefermento",
            total: "Total prefermento"
        },
        finalDough: {
            title: "Ingredientes de la masa final"
        },
        flour: "Harina",
        water: "Agua",
        salt: "Sal",
        sugar: "Azúcar",
        fat: "Grasa",
        total: "Masa Total"
    },
    doughInsights: {
        title: "Análisis de la masa",
        finalSalinity: "Salinidad final",
        salinity: {
            normal: "Nivel de sal bien equilibrado para sabor y fermentación.",
            high: "Salinidad alta, típica para pizza; puede apretar un poco el gluten.",
            low: "Salinidad baja; puede resultar en una fermentación más rápida y menos sabor."
        },
        elasticity: "Elasticidad",
        extensibility: "Extensibilidad",
        extensibilityMessages: {
            balanced: "Una masa equilibrada, adecuada para la mayoría de formados.",
            high: "Masa muy extensible. Manipular con cuidado para mantener la fuerza; considere añadir pliegues.",
            low: "Masa muy elástica. Asegure periodos de reposo adecuados antes de formar para evitar desgarros."
        },
        hydrationFeel: {
            title: "Sensación de la masa (hidratación aparente)",
            balanced: "La masa debería tener una sensación equilibrada y manejable.",
            very_wet: "Espera una masa muy húmeda y suelta, que puede ser difícil de manejar pero puede producir una miga abierta.",
            manageable: "La masa estará pegajosa pero manejable con las manos mojadas o una rasqueta.",
            firm: "La masa será firme y fácil de manejar, lo que probablemente resultará en una miga más cerrada."
        },
        warnings: {
            highHydration: "Una hidratación alta (>85%) puede ser difícil de manejar. Espera una masa muy húmeda.",
            highSalt: "Un nivel de sal alto (>3.5%) puede ralentizar significativamente la fermentación y apretar la masa.",
            negativeWater: "La cantidad de masa madre es muy alta en comparación con la hidratación total. Esto resultará en agua fresca negativa. Por favor, aumenta la hidratación o reduce el porcentaje de masa madre.",
            prefermentWater: "El agua en el prefermento excede el agua total de la receta. Aumenta la hidratación general o disminuye la hidratación/cantidad del prefermento.",
            longColdFerment: "Una fermentación en frío de más de 72 horas aumenta el riesgo de acidez excesiva y degradación del gluten."
        }
    },
    yeastAid: {
        title: "Guía visual:",
        scantHalfTsp: "aprox. un poco menos de 1/2 cdta.",
        quarterTsp: "aprox. 1/4 cdta.",
        generousEighthTsp: "aprox. un poco más de 1/8 cdta.",
        eighthTsp: "aprox. 1/8 cdta.",
        pinch: "una pizca generosa (como de sal)",
        fewGrains: "solo unos pocos granos"
    },
    calculatorEngine: {
        label: "Generador de plan",
        ai: "Panadero IA (pro)",
        formula: "Fórmula (gratis)"
    },
    mainButton: {
        default: "Generar plan",
        loading: "Analizando..."
    },
    results: {
        titleAI: "Análisis de horneado por IA",
        titleFormula: "Plan basado en fórmula",
        bulkFermentation: "Fermentación en bloque",
        finalProof: "Prueba final",
        coldProof: "Fermentación en frío",
        fermentationCurve: "Curva de fermentación",
        proTips: "Consejos pro",
        coldFermentation: {
            title: "Consejo de fermentación en frío",
            instructions: "Instrucciones"
        },
        formulaOverview: "Este plan se genera usando una fórmula determinista basada en tus parámetros. Para consejos personalizados, una cronología detallada y análisis cualitativo, cambia al motor Panadero IA (Pro).",
        formulaNotes: {
            bulk: "Espera a que la masa aumente de volumen y muestre algunas burbujas en la superficie.",
            proof: "La masa debe verse hinchada y retroceder lentamente cuando se la presiona suavemente.",
            cold: "La masa subirá lentamente en el frigorífico, desarrollando sabor."
        },
        formulaProTip: "¡Cambia al Panadero IA para obtener consejos profesionales adaptados a tus ingredientes y horno específicos!"
    },
    timeline: {
        liveTitle: "Cronología en vivo",
        printTitle: "Lista de pasos (checklist)",
        getHelp: "Mi masa parece rara... ¡Ayuda!",
        status: {
            done: "Listo",
            markComplete: "Marcar como completo",
            start: "Empezar"
        },
        schedule: {
            title: "Horario de horneado"
        },
        steps: {
            mixing: "Mezclado",
            bulk: "Fermentación en bloque",
            shaping: "Formado",
            proofing: "Prueba final",
            cold: "Fermentación en frío",
            baking: "Horneado"
        },
        details: {
            mixing: "Combina los ingredientes según la receta. Desarrolla el gluten hasta el punto de membrana deseado.",
            bulk: "Deja que la masa fermente a la temperatura ambiente especificada, realizando pliegues si es necesario.",
            shaping: "Pre-forma suavemente y luego da la forma final a la masa.",
            proofing: "Deja que la masa formada fermente hasta que pase la prueba del dedo.",
            cold: "Coloca la masa formada en el frigorífico durante {hours} horas.",
            baking: "Precalienta tu horno y hornea según las instrucciones de la receta para temperatura y vapor."
        }
    },
    rescueModal: {
        title: "Modo rescate de masa",
        subtitle: "Obtén ayuda de la IA para tu emergencia con la masa.",
        problemLabel: "Describe el problema:",
        problemPlaceholder: "Ej: 'Mi masa apenas ha subido después de 3 horas' o 'Está súper pegajosa y se desparrama después de formarla.'",
        button: {
            default: "Obtener consejo de rescate",
            loading: "Analizando..."
        },
        resultsTitle: "Esto es lo que puedes intentar:",
        error: {
            noProblem: "Por favor, describe el problema con tu masa."
        }
    },
    recipes: {
        save: {
            title: "Guardar receta",
            nameLabel: "Nombre de la receta",
            namePlaceholder: "Ej: Mi Pan de Campo Favorito",
            notesLabel: "Notas / versión",
            notesPlaceholder: "Ej: Usé harina Caputo Pizzeria, lote 08/2025. Reduje la hidratación al 72%."
        },
        noNotes: "No hay notas para esta versión.",
        savedOn: "Guardado el: {date}",
        deleteConfirm: "¿Estás seguro de que quieres eliminar esta receta?",
        cloneName: "{name} (copia)",
        importSuccess: "¡La receta \"{name}\" se importó con éxito!",
        importDuplicate: "La receta \"{name}\" ya está en tu biblioteca.",
        empty: "Aún no has guardado ninguna receta. ¡Crea una receta y haz clic en el icono 'Guardar' para empezar!",
        shareLink: {
            success: "¡Enlace para compartir copiado al portapapeles!",
            fail: "Error al copiar el enlace. Por favor, cópialo manualmente:"
        }
    },
    ddt: {
        title: "Calculadora de TDA",
        description: "Calcula la temperatura del agua necesaria para alcanzar tu Temperatura de Dough Deseada (TDA).",
        desiredTemp: "Temp. de masa deseada",
        flourTemp: "Temp. de la harina",
        mixerFriction: "Fricción de la amasadora",
        usePreferment: "¿Usando prefermento?",
        prefermentTemp: "Temp. del prefermento",
        nFactor: "Factor-N (masas térmicas)",
        requiredWaterTemp: "Temperatura del agua requerida:"
    },
    loading: {
        title: "Activando panadero IA...",
        messages: [
            "Consultando a los maestros panaderos...",
            "Analizando el potencial de tu masa...",
            "Calculando el levado perfecto...",
            "Calentando la cámara de fermentación...",
            "Desvelando secretos de fermentación...",
        ]
    },
    tooltips: {
        starterActivity: "La actividad de la masa madre es crucial. Evalúa en función de cuánto tarda tu masa madre en duplicar su volumen después de alimentarla a temperatura ambiente.",
        ddt: "Calcula la temperatura del agua necesaria para alcanzar la temperatura final deseada de la masa.",
        q10: "Ajusta el modelo científico para la fermentación. Q10 es la tasa de cambio de la fermentación por cada 10°C."
    },
    flourTypes: {
        "high-gluten": "Harina de gran fuerza (13-14% proteína)",
        bread: "Harina de fuerza (11-13% proteína)",
        "pizza-00": "Harina de pizza `00` (12-13% proteína)",
        "all-purpose": "Harina de trigo común (9-11% proteína)",
        "whole-wheat": "Harina integral / centeno"
    },
    yeastTypes: {
        instant: "Levadura seca instantánea",
        "active-dry": "Levadura seca activa",
        fresh: "Levadura fresca",
        sourdough: "Masa madre"
    },
    starterActivities: {
        slow: "Lenta (dobla en >8h a 24°C)",
        normal: "Normal (dobla en 4-6h a 24°C)",
        fast: "Rápida (dobla en <4h a 24°C)"
    },
    prefermentTypes: {
        poolish: { name: "Poolish" },
        biga: { name: "Biga" }
    },
    ovenProfiles: {
        "standard-home": "Horno doméstico estándar",
        convection: "Horno de convección / ventilador",
        "baking-steel": "Acero para hornear",
        "baking-stone": "Piedra para hornear",
        "wood-fired": "Horno de leña"
    },
    frictionFactors: {
        manual: "Amasado a mano",
        spiral: "Amasadora de espiral",
        planetary: "Amasadora planetaria"
    },
    errors: {
        unknown: "Ocurrió un error inesperado.",
        aiPlan: "Ocurrió un error inesperado al generar el plan con IA.",
        urlLoadFailed: "No se pudo cargar la receta desde el enlace. Podría estar corrupto.",
        invalidRecipeFile: "Formato de archivo de receta no válido.",
        importFailed: "Falló la importación de la receta:"
    }
};

export const locales = { en, es };

// This is a utility type to provide autocompletion for keys
type PathImpl<T, K extends keyof T> =
    K extends string
    ? T[K] extends Record<string, any>
        ? `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>> & string}` | `${K}.${Exclude<keyof T[K], keyof any[]> & string}`
        : K
    : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

export type TranslationKey = Path<typeof en>;
export type Locale = typeof en;
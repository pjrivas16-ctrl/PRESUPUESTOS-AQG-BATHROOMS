import type { ProductOption, ColorOption } from './types';

// ==================================================================================
// LISTA DE PRECIOS POR MODELO Y DIMENSIÓN
// ==================================================================================
// Aquí puedes definir los precios base (SIN IVA) para cada combinación.
// La estructura es: PRICE_LIST['NOMBRE_COLECCION'][ANCHO][LARGO] = PRECIO_BASE
//
// La aplicación añadirá el IVA (21%) automáticamente.
// ==================================================================================
export const PRICE_LIST: { [productLine: string]: { [width: number]: { [length: number]: number } } } = {
    'SOFTUM': {
        70: {
            100: 237.0, 110: 253.0, 120: 266.0, 130: 286.0, 140: 291.0,
            150: 313.0, 160: 322.0, 170: 346.0, 180: 364.0, 190: 382.0, 200: 400.0
        },
        80: {
            100: 257.0, 110: 275.0, 120: 295.0, 130: 311.0, 140: 323.0,
            150: 334.0, 160: 345.0, 170: 379.0, 180: 393.0, 190: 413.0, 200: 441.0
        },
        90: {
            100: 278.0, 110: 298.0, 120: 313.0, 130: 328.0, 140: 336.0,
            150: 346.0, 160: 353.0, 170: 410.0, 180: 429.0, 190: 468.0, 200: 499.0
        }
    }
};


// Standard Dimensions
export const STANDARD_WIDTHS = [70, 80, 90, 100];
export const STANDARD_LENGTHS = [80, 90, 100, 110, 120, 140, 160, 180, 200];

// SOFTUM Dimensions
export const SOFTUM_WIDTHS = [70, 80, 90];
export const SOFTUM_LENGTHS = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];


export const PRODUCT_LINES = [
    'SOFTUM',
    'LUXE',
    'DRAINER',
    'FLAT',
    'CLASSIC',
    'STRUCT',
    'CENTRAL',
    'RATIO',
    'CUSTOM',
];

// --- PRECIOS DE EJEMPLO PARA OTRAS COLECCIONES (EDITAR ESTOS VALORES) ---
const TEMP_BASE_PRICE_PER_SQ_CM = 0.015; // Usado solo para generar precios de ejemplo

const STANDARD_PRODUCT_LINES = PRODUCT_LINES.filter(p => p !== 'SOFTUM' && p !== 'CUSTOM');

// Populate prices for standard models
STANDARD_PRODUCT_LINES.forEach(line => {
    PRICE_LIST[line] = {};
    STANDARD_WIDTHS.forEach(width => {
        PRICE_LIST[line][width] = {};
        STANDARD_LENGTHS.forEach(length => {
            // EJEMPLO: Luxe 70x80. Reemplaza este cálculo con tus precios base.
            PRICE_LIST[line][width][length] = parseFloat((width * length * TEMP_BASE_PRICE_PER_SQ_CM).toFixed(2));
        });
    });
});
// --- FIN DE LA LISTA DE PRECIOS ---


export const SHOWER_MODELS: ProductOption[] = [
    {
        id: 'pizarra',
        name: 'Textura Pizarra',
        description: 'Textura natural y antideslizante que imita la pizarra real. Elegancia y seguridad en uno.',
        price: 0,
        priceFactor: 1.0,
    },
    {
        id: 'liso',
        name: 'Textura Lisa',
        description: 'Superficie completamente lisa para un look minimalista y moderno. Fácil de limpiar.',
        price: 0,
        priceFactor: 0.9,
    },
    {
        id: 'stone',
        name: 'Textura Stone',
        description: 'Inspirado en la piedra natural, ofrece una sensación robusta y un diseño atemporal.',
        price: 0,
        priceFactor: 1.15,
    },
    {
        id: 'sand',
        name: 'Textura Sand',
        description: 'Textura arenosa suave al tacto, exclusiva del modelo SOFTUM.',
        price: 0,
        priceFactor: 1.0,
    }
];

export const STANDARD_COLORS: ColorOption[] = [
    { id: 'white', name: 'White', hex: '#FFFFFF', price: 0 },
    { id: 'black', name: 'Black', hex: '#000000', price: 0 },
    { id: 'graf', name: 'Graf', hex: '#343434', price: 0 },
    { id: 'stone', name: 'Stone', hex: '#BDBDBD', price: 0 },
    { id: 'moka', name: 'Moka', hex: '#6F4E37', price: 0 },
    { id: 'cream', name: 'Cream', hex: '#FFFDD0', price: 0 },
    { id: 'pearl', name: 'Pearl', hex: '#EAE0C8', price: 0 },
    { id: 'azure', name: 'Azure', hex: '#B0E0E6', price: 0 },
    { id: 'blush', name: 'Blush', hex: '#DEC3C1', price: 0 },
    { id: 'jade', name: 'Jade', hex: '#B2D8B5', price: 0 },
];

export const SHOWER_EXTRAS: ProductOption[] = [
    {
        id: 'valvula',
        name: 'Válvula de desagüe premium',
        description: 'Válvula de alto caudal con acabado cromado y diseño extraplano.',
        price: 35,
    },
    {
        id: 'rejilla',
        name: 'Rejilla en acero inoxidable',
        description: 'Rejilla decorativa en acero inoxidable pulido para un toque de distinción.',
        price: 50,
    },
    {
        id: 'tratamiento',
        name: 'Tratamiento Antical',
        description: 'Aplicación de un tratamiento especial que repele la cal y facilita la limpieza.',
        price: 75,
    },
    {
        id: 'ral',
        name: 'Color personalizado RAL',
        description: 'Personaliza tu plato de ducha con cualquier color de la carta RAL.',
        price: 65,
    }
];

export const SOFTUM_EXTRAS: ProductOption[] = [
    {
        id: 'bitono',
        name: 'Tapa en otro color (Bitono)',
        description: 'Elige un color diferente para la tapa del desagüe, creando un efecto bitono.',
        price: 0,
    }
];

export const TAPETA_LUXE_EXTRA: ProductOption = {
    id: 'tapeta-luxe',
    name: 'Tapeta del mismo material',
    description: 'Tapa de desagüe fabricada en el mismo material y color que el plato de ducha.',
    price: 50,
};

export const STEPS = [
    { number: 1, title: 'Modelo' },
    { number: 2, title: 'Dimensiones' },
    { number: 3, title: 'Textura' },
    { number: 4, title: 'Color' },
    { number: 5, title: 'Extras' },
    { number: 6, title: 'Resumen' },
];
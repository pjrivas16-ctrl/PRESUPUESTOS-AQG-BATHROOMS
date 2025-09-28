import type { ProductOption, ColorOption } from './types';

// ==================================================================================
// LISTA DE PRECIOS Y PRODUCTOS EXTRAÍDA DE LA TARIFA PDF
// ==================================================================================

export const PRICE_LIST: { [productLine: string]: { [width: number]: { [length: number]: number } } } = {
    'SOFTUM': {
        70: { 100: 237, 110: 253, 120: 266, 130: 286, 140: 291, 150: 313, 160: 322, 170: 346, 180: 364, 190: 382, 200: 400 },
        80: { 100: 257, 110: 275, 120: 295, 130: 311, 140: 323, 150: 334, 160: 345, 170: 379, 180: 393, 190: 413, 200: 441 },
        90: { 100: 278, 110: 298, 120: 313, 130: 328, 140: 336, 150: 346, 160: 353, 170: 410, 180: 429, 190: 468, 200: 499 }
    },
    'LUXE': {
        70: { 80: 211, 90: 231, 100: 249, 110: 266, 120: 279, 130: 299, 140: 303, 150: 326, 160: 334, 170: 358, 180: 377, 190: 395, 200: 412 },
        80: { 80: 231, 90: 248, 100: 272, 110: 290, 120: 311, 130: 327, 140: 338, 150: 349, 160: 361, 170: 395, 180: 409, 190: 428, 200: 456 },
        90: { 90: 276, 100: 296, 110: 316, 120: 332, 130: 347, 140: 354, 150: 364, 160: 371, 170: 429, 180: 447, 190: 486, 200: 517 },
        100: { 100: 322, 110: 352, 120: 370, 130: 389, 140: 407, 150: 428, 160: 441, 170: 502, 180: 529, 190: 538, 200: 569 }
    },
    'LUXE CON TAPETA': {
        70: { 80: 249, 90: 269, 100: 287, 110: 304, 120: 317, 130: 337, 140: 341, 150: 364, 160: 372, 170: 396, 180: 415, 190: 433, 200: 450 },
        80: { 80: 269, 90: 286, 100: 310, 110: 328, 120: 349, 130: 365, 140: 376, 150: 387, 160: 399, 170: 433, 180: 447, 190: 466, 200: 494 },
        90: { 90: 314, 100: 334, 110: 354, 120: 370, 130: 385, 140: 392, 150: 402, 160: 409, 170: 467, 180: 485, 190: 524, 200: 555 },
        100: { 100: 360, 110: 390, 120: 408, 130: 427, 140: 445, 150: 466, 160: 479, 170: 540, 180: 567, 190: 576, 200: 607 }
    },
    'FLAT': {
        70: { 80: 198, 90: 218, 100: 237, 110: 253, 120: 266, 130: 286, 140: 291, 150: 313, 160: 322, 170: 346, 180: 364, 190: 382, 200: 400 },
        80: { 80: 215, 90: 232, 100: 257, 110: 275, 120: 295, 130: 311, 140: 323, 150: 334, 160: 345, 170: 379, 180: 393, 190: 413, 200: 441 },
        90: { 90: 258, 100: 278, 110: 298, 120: 313, 130: 328, 140: 336, 150: 346, 160: 353, 170: 410, 180: 429, 190: 468, 200: 499 }
    },
    'CLASSIC': {
        70: { 80: 198, 90: 218, 100: 237, 110: 253, 120: 266, 130: 286, 140: 291, 150: 313, 160: 322, 170: 346, 180: 364, 190: 400, 200: 434, 210: 471 },
        75: { 80: 208, 90: 227, 100: 248, 110: 265, 120: 278, 130: 300, 140: 310, 150: 326, 160: 337, 170: 365, 180: 378, 190: 396, 200: 420, 210: 455, 220: 491 },
        80: { 80: 215, 90: 232, 100: 257, 110: 275, 120: 295, 130: 311, 140: 323, 150: 334, 160: 345, 170: 379, 180: 393, 190: 413, 200: 441, 210: 471, 220: 508 },
        90: { 90: 258, 100: 278, 110: 298, 120: 313, 130: 328, 140: 336, 150: 346, 160: 353, 170: 410, 180: 429, 190: 468, 200: 499, 210: 510, 220: 546 },
        100: { 100: 301, 110: 331, 120: 349, 130: 368, 140: 386, 150: 407, 160: 419, 170: 481, 180: 507, 190: 517, 200: 548, 210: 568, 220: 604 }
    },
    'CLASSIC TECH': {
        70: { 80: 317, 90: 349, 100: 379, 110: 405, 120: 426, 130: 458, 140: 465, 150: 501, 160: 515, 170: 553, 180: 582, 190: 611, 200: 639, 210: 763, 220: 791 },
        75: { 80: 333, 90: 363, 100: 397, 110: 424, 120: 445, 130: 480, 140: 496, 150: 522, 160: 539, 170: 584, 180: 605, 190: 633, 200: 672, 210: 800, 220: 826 },
        80: { 80: 344, 90: 371, 100: 411, 110: 440, 120: 472, 130: 498, 140: 517, 150: 534, 160: 553, 170: 607, 180: 629, 190: 660, 200: 705, 210: 830, 220: 853 },
        90: { 90: 413, 100: 444, 110: 476, 120: 501, 130: 525, 140: 537, 150: 553, 160: 565, 170: 657, 180: 686, 190: 749, 200: 798, 210: 898, 220: 917 },
        100: { 100: 482, 110: 529, 120: 558, 130: 589, 140: 618, 150: 651, 160: 671, 170: 769, 180: 812, 190: 827, 200: 876, 210: 1000, 220: 1015 }
    },
    'STRUCT': {
        70: { 100: 272, 120: 306, 140: 334, 150: 360, 160: 370, 170: 397, 180: 419 },
        80: { 100: 295, 120: 339, 140: 371, 150: 384, 160: 397, 170: 436, 180: 452 },
        90: { 100: 319, 120: 360, 140: 386, 150: 397, 160: 406, 170: 472, 180: 493 }
    },
    'STRUCT DETAIL': {
        70: { 80: 318, 90: 346, 100: 373, 110: 397, 120: 418, 130: 446, 140: 459, 150: 489, 160: 506, 170: 538, 180: 564, 190: 590, 200: 616, 210: 658, 220: 703, 230: 826, 240: 883, 250: 944 },
        75: { 80: 332, 90: 359, 100: 388, 110: 413, 120: 434, 130: 464, 140: 482, 150: 506, 160: 525, 170: 561, 180: 582, 190: 608, 200: 640, 210: 683, 220: 727, 230: 853, 240: 909, 250: 968 },
        80: { 80: 343, 90: 368, 100: 401, 110: 427, 120: 455, 130: 479, 140: 499, 150: 518, 160: 537, 170: 579, 180: 601, 190: 629, 200: 665, 210: 703, 220: 748, 230: 875, 240: 930, 250: 989 },
        90: { 90: 402, 100: 430, 110: 458, 120: 481, 130: 504, 140: 520, 150: 538, 160: 553, 170: 618, 180: 645, 190: 692, 200: 731, 210: 750, 220: 794, 230: 924, 240: 978, 250: 1035 },
        100: { 100: 461, 110: 499, 120: 525, 130: 552, 140: 578, 150: 607, 160: 627, 170: 697, 180: 731, 190: 749, 200: 788, 210: 816, 220: 860, 230: 997, 240: 1051, 250: 1108, 260: 1168, 270: 1231, 280: 1297 },
        110: { 110: 543, 120: 572, 130: 602, 140: 633, 150: 666, 160: 701, 170: 737, 180: 776, 190: 816, 200: 859, 210: 903, 220: 950, 230: 1100, 240: 1157, 250: 1218, 260: 1281, 270: 1348, 280: 1418 },
        120: { 120: 686, 130: 721, 140: 759, 150: 798, 160: 840, 170: 883, 180: 929, 190: 978, 200: 1028, 210: 1082, 220: 1138, 230: 1317, 240: 1385, 250: 1458, 260: 1533, 270: 1613, 280: 1697 },
        130: { 130: 786, 140: 827, 150: 870, 160: 915, 170: 962, 180: 1012, 190: 1065, 200: 1120, 210: 1178, 220: 1239, 230: 1434, 240: 1508, 250: 1586, 260: 1668, 270: 1755, 280: 1846 }
    },
    'CENTRAL': {
        70: { 80: 198, 90: 218, 100: 237, 110: 253, 120: 266, 130: 286, 140: 291, 150: 313, 160: 322, 170: 346, 180: 364, 190: 382, 200: 400, 210: 434, 220: 471, 230: 511, 240: 555, 250: 603 },
        80: { 80: 215, 90: 232, 100: 257, 110: 275, 120: 295, 130: 311, 140: 323, 150: 334, 160: 345, 170: 379, 180: 393, 190: 413, 200: 441, 210: 471, 220: 508, 230: 547, 240: 589, 250: 635 },
        90: { 90: 258, 100: 278, 110: 298, 120: 313, 130: 328, 140: 336, 150: 346, 160: 353, 170: 410, 180: 429, 190: 468, 200: 499, 210: 510, 220: 546, 230: 584, 240: 625, 250: 668 },
        100: { 100: 301, 110: 331, 120: 349, 130: 368, 140: 386, 150: 407, 160: 419, 170: 481, 180: 507, 190: 517, 200: 548, 210: 568, 220: 604, 230: 643, 240: 683, 250: 727 },
        110: { 110: 367, 120: 388, 130: 412, 140: 444, 150: 479, 160: 499, 170: 500, 180: 509, 190: 526, 200: 566, 210: 611, 220: 652, 230: 686, 240: 719, 250: 761 },
        120: { 120: 432, 130: 462, 140: 495, 150: 531, 160: 568, 170: 609, 180: 652, 190: 699, 200: 748, 210: 802, 220: 859, 230: 920, 240: 985, 250: 1055 },
        130: { 130: 518, 140: 552, 150: 588, 160: 648, 170: 741, 180: 835, 190: 927, 200: 989, 210: 1051, 220: 1130, 230: 1233, 240: 1351, 250: 1463 }
    },
    'CENTRAL TECH': {
        70: { 80: 317, 90: 349, 100: 379, 110: 405, 120: 426, 130: 458, 140: 465, 150: 501, 160: 515, 170: 553, 180: 582, 190: 611, 200: 639, 210: 694, 220: 753, 230: 818, 240: 888, 250: 965 },
        80: { 80: 344, 90: 371, 100: 411, 110: 440, 120: 472, 130: 498, 140: 517, 150: 534, 160: 553, 170: 607, 180: 629, 190: 660, 200: 705, 210: 754, 220: 813, 230: 875, 240: 943, 250: 1016 },
        90: { 90: 413, 100: 444, 110: 476, 120: 501, 130: 525, 140: 537, 150: 553, 160: 565, 170: 657, 180: 686, 190: 749, 200: 798, 210: 816, 220: 873, 230: 934, 240: 1000, 250: 1070 },
        100: { 100: 482, 110: 529, 120: 558, 130: 589, 140: 618, 150: 651, 160: 671, 170: 769, 180: 812, 190: 827, 200: 876, 210: 909, 220: 967, 230: 1028, 240: 1093, 250: 1163 },
        110: { 110: 588, 120: 621, 130: 660, 140: 711, 150: 766, 160: 798, 170: 800, 180: 815, 190: 842, 200: 906, 210: 978, 220: 1044, 230: 1097, 240: 1150, 250: 1218 },
        120: { 120: 691, 130: 740, 140: 792, 150: 849, 160: 909, 170: 974, 180: 1043, 190: 1118, 200: 1197, 210: 1282, 220: 1374, 230: 1472, 240: 1576, 250: 1689 },
        130: { 130: 829, 140: 883, 150: 940, 160: 1036, 170: 1185, 180: 1336, 190: 1483, 200: 1582, 210: 1682, 220: 1808, 230: 1974, 240: 2161, 250: 2341 }
    },
    'RATIO': {
        70: { 70: 201 },
        75: { 75: 209 },
        80: { 80: 217 },
        90: { 90: 255 },
        100: { 100: 297 }
    },
    'RATIO TECH': {
        70: { 70: 322 },
        75: { 75: 334 },
        80: { 80: 347 },
        90: { 90: 408 },
        100: { 100: 475 }
    },
};

export const PRODUCT_LINES = [
    'SOFTUM',
    'LUXE',
    'LUXE CON TAPETA',
    'FLAT',
    'CLASSIC',
    'CLASSIC TECH',
    'STRUCT',
    'STRUCT DETAIL',
    'CENTRAL',
    'CENTRAL TECH',
    'RATIO',
    'RATIO TECH',
    'DRAINER',
    'CUSTOM',
    'KITS',
];

export const KIT_PRODUCTS: ProductOption[] = [
    {
        id: 'kit-reparacion',
        name: 'Kit de reparación',
        description: 'Kit para reparar pequeños desperfectos en la superficie.',
        price: 20,
    },
    {
        id: 'kit-pintura',
        name: 'Kit de pintura',
        description: 'Kit de pintura para retoques o personalización.',
        price: 45,
    },
];

export const SHOWER_MODELS: ProductOption[] = [
    {
        id: 'pizarra',
        name: 'Textura Pizarra',
        description: 'Textura natural y antideslizante. Elegancia y seguridad en uno.',
        price: 0,
        priceFactor: 1.0,
    },
    {
        id: 'lisa',
        name: 'Textura Lisa',
        description: 'Superficie completamente lisa para un look minimalista. Fácil de limpiar.',
        price: 0,
        priceFactor: 1.0, 
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

export const CUT_EXTRAS: ProductOption[] = [
     {
        id: 'corte-simple-acabado',
        name: 'Corte simple con acabado',
        description: 'Corte simple a medida, enmasillado y pintado.',
        price: 40,
    },
    {
        id: 'corte-especial-acabado',
        name: 'Corte especial con acabado',
        description: 'Corte especial (salvar columnas, etc.) con acabado.',
        price: 60,
    },
    {
        id: 'corte-simple-sin-acabado',
        name: 'Corte simple sin acabado',
        description: 'Corte simple a medida sin acabado posterior.',
        price: 20,
    },
    {
        id: 'corte-especial-sin-acabado',
        name: 'Corte especial sin acabado',
        description: 'Corte especial (salvar columnas, etc.) sin acabado.',
        price: 40,
    },
];

export const ACCESSORY_EXTRAS: ProductOption[] = [
     {
        id: 'ral',
        name: 'Color personalizado (no en catálogo)',
        description: 'Personaliza tu plato de ducha con cualquier color de la carta RAL o NCS.',
        price: 65,
    },
    {
        id: 'rejilla-lacada-luxe',
        name: 'Rejilla Lacada (Color RAL)',
        description: 'Rejilla lacada en un color RAL del catálogo para el modelo LUXE.',
        price: 33.60,
    },
    {
        id: 'rejilla-oro-cepillado-pvd',
        name: 'Rejilla Oro Cepillado PVD',
        description: 'Rejilla con acabado PVD en Oro Cepillado para el modelo LUXE.',
        price: 150,
    },
    {
        id: 'rejilla-oro-rosa-cepillado-pvd',
        name: 'Rejilla Oro Rosa Cepillado PVD',
        description: 'Rejilla con acabado PVD en Oro Rosa Cepillado para el modelo LUXE.',
        price: 150,
    },
    {
        id: 'rejilla-gun-metal-pvd',
        name: 'Rejilla Gun Metal PVD',
        description: 'Rejilla con acabado PVD en Gun Metal para el modelo LUXE.',
        price: 150,
    },
    {
        id: 'rejilla-lacada-standard',
        name: 'Rejilla Lacada (Mismo color)',
        description: 'Rejilla lacada en el mismo color que el plato de ducha.',
        price: 9.10,
    },
    {
        id: 'rejilla-oro-cepillado-pvd-standard',
        name: 'Rejilla Oro Cepillado PVD',
        description: 'Rejilla con acabado PVD en Oro Cepillado.',
        price: 30,
    },
    {
        id: 'rejilla-oro-rosa-cepillado-pvd-standard',
        name: 'Rejilla Oro Rosa Cepillado PVD',
        description: 'Rejilla con acabado PVD en Oro Rosa Cepillado.',
        price: 30,
    },
    {
        id: 'rejilla-gun-metal-pvd-standard',
        name: 'Rejilla Gun Metal PVD',
        description: 'Rejilla con acabado PVD en Gun Metal.',
        price: 30,
    },
];


export const SOFTUM_EXTRAS: ProductOption[] = [
    {
        id: 'bitono',
        name: 'Tapa en otro color (Bitono)',
        description: 'Elige un color diferente para la tapa del desagüe, creando un efecto bitono.',
        price: 0,
    }
];

// Standard Dimensions Fallbacks
export const STANDARD_WIDTHS = [70, 75, 80, 90, 100, 110, 120, 130];
export const STANDARD_LENGTHS = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280];
export const SOFTUM_WIDTHS = [70, 80, 90];
export const SOFTUM_LENGTHS = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

export const SHOWER_TRAY_STEPS = [
    { number: 1, title: 'Colección' },
    { number: 2, title: 'Dimensiones' },
    { number: 3, title: 'Textura' },
    { number: 4, title: 'Color' },
    { number: 5, title: 'Cortes' },
    { number: 6, title: 'Accesorios' },
    { number: 7, title: 'Resumen' },
];

export const KITS_STEPS = [
    { number: 1, title: 'Colección' },
    { number: 2, title: 'Selección de Kit' },
    { number: 3, title: 'Color y Referencia' },
    { number: 4, title: 'Resumen' },
];

export const VAT_RATE = 0.21;
export const PROMO_DURATION_DAYS = 90;
export const PROMO_ID = 'new_client_promo';
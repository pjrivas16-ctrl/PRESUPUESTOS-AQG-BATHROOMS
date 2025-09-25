import React, { useMemo } from 'react';
import { SHOWER_EXTRAS, SOFTUM_EXTRAS, STANDARD_COLORS } from '../../constants';
import type { ProductOption, ColorOption } from '../../types';

interface Step4ExtrasProps {
    onToggle: (extra: ProductOption) => void;
    selectedExtras: ProductOption[];
    productLine: string | null;
    mainColor: ColorOption | null;
    bitonoColor: ColorOption | null | undefined;
    onSelectBitonoColor: (color: ColorOption) => void;
    structFrames?: 1 | 2 | 3 | 4;
    onUpdateStructFrames: (frames: 1 | 2 | 3 | 4) => void;
    baseWidth?: number;
    baseLength?: number;
    cutWidth?: number;
    cutLength?: number;
    onUpdateCutDimensions: (dims: { cutWidth?: number; cutLength?: number }) => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const Step4Extras: React.FC<Step4ExtrasProps> = ({ 
    onToggle, 
    selectedExtras, 
    productLine,
    mainColor,
    bitonoColor,
    onSelectBitonoColor,
    structFrames,
    onUpdateStructFrames,
    baseWidth,
    baseLength,
    cutWidth,
    cutLength,
    onUpdateCutDimensions,
}) => {
    
    const isSelected = (extraId: string) => selectedExtras.some(e => e.id === extraId);
    const hasCut = selectedExtras.some(e => e.id.startsWith('corte'));
    
    const availableExtras = useMemo(() => {
        const generalExtras = SHOWER_EXTRAS.filter(e => e.id.startsWith('corte'));
        
        switch (productLine) {
            case 'SOFTUM':
                return [...SOFTUM_EXTRAS, ...generalExtras];
            case 'LUXE':
            case 'LUXE CON TAPETA':
                const luxeGrille = SHOWER_EXTRAS.find(e => e.id === 'rejilla-lacada-luxe');
                return luxeGrille ? [luxeGrille, ...generalExtras] : generalExtras;
            case 'FLAT':
            case 'CLASSIC':
            case 'STRUCT':
            case 'CENTRAL':
            case 'RATIO':
                const standardGrille = SHOWER_EXTRAS.find(e => e.id === 'rejilla-lacada-standard');
                return standardGrille ? [standardGrille, ...generalExtras] : generalExtras;
            default:
                return generalExtras;
        }
    }, [productLine]);

    const availableBitonoColors = useMemo(() => {
        if (!mainColor) return STANDARD_COLORS;
        return STANDARD_COLORS.filter(c => c.id !== mainColor.id);
    }, [mainColor]);
    
    const cutValidationError = useMemo(() => {
        if (!hasCut || !cutWidth || !cutLength || !baseWidth || !baseLength) {
            return '';
        }
        if (cutWidth <= 0 || cutLength <= 0) {
            return 'Las medidas de corte deben ser mayores que cero.';
        }
        const baseSorted = [baseWidth, baseLength].sort((a, b) => a - b);
        const cutSorted = [cutWidth, cutLength].sort((a, b) => a - b);

        if (cutSorted[0] > baseSorted[0] || cutSorted[1] > baseSorted[1]) {
            return `Las medidas de corte (${cutWidth}x${cutLength}) no pueden ser mayores que las del plato original (${baseWidth}x${baseLength}).`;
        }
        return '';
    }, [hasCut, cutWidth, cutLength, baseWidth, baseLength]);

    const renderStructFramesSelector = () => {
        if (productLine !== 'STRUCT DETAIL') return null;
        
        const frameOptions: { count: (1 | 2 | 3 | 4), discount: string }[] = [
            { count: 4, discount: 'Precio de tarifa' },
            { count: 3, discount: '5% de descuento' },
            { count: 2, discount: '10% de descuento' },
            { count: 1, discount: '15% de descuento' },
        ];

        return (
             <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Configuración de Marcos</h3>
                <p className="text-slate-500 mb-4">Selecciona el número de marcos. Menos marcos aplican un descuento sobre el precio base.</p>
                <div className="grid grid-cols-2 gap-4">
                    {frameOptions.map(opt => {
                        const isFrameSelected = structFrames === opt.count;
                        return (
                             <div
                                key={opt.count}
                                onClick={() => onUpdateStructFrames(opt.count)}
                                role="radio"
                                aria-checked={isFrameSelected}
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onUpdateStructFrames(opt.count)}
                                className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 ${isFrameSelected ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200' : 'border-slate-200 bg-white hover:border-teal-400'}`}
                            >
                                <p className="font-bold text-slate-800">{opt.count} Marco{opt.count > 1 ? 's' : ''}</p>
                                <p className={`text-sm ${isFrameSelected ? 'text-teal-700 font-semibold' : 'text-slate-500'}`}>{opt.discount}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const title = 'Añade los extras';
    const description = 'Completa tu plato de ducha con nuestros accesorios y tratamientos premium.';

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">{title}</h2>
            <p className="text-slate-500 mb-8">{description}</p>

            <div className="space-y-4">
                {availableExtras.map((extra) => {
                    const isCurrentlySelected = isSelected(extra.id);
                    return (
                        <div key={extra.id}>
                            <div
                                onClick={() => onToggle(extra)}
                                role="checkbox"
                                aria-checked={isCurrentlySelected}
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(extra)}
                                className={`flex items-start p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer ${isCurrentlySelected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-400'}`}
                            >
                                <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-200 mt-1 flex-shrink-0 ${isCurrentlySelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                                   {isCurrentlySelected && <CheckIcon />}
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-bold text-slate-800">{extra.name}</h3>
                                    <p className="text-sm text-slate-500">{extra.description}</p>
                                </div>
                                <div className="font-bold text-slate-800 text-lg text-right ml-4">
                                    {extra.price > 0 && `+ ${extra.price}€`}
                                </div>
                            </div>
                            
                            {isCurrentlySelected && extra.id === 'bitono' && (
                                <div className="mt-3 ml-4 md:ml-14 p-4 bg-teal-50 rounded-lg animate-fade-in border-t-2 border-teal-200">
                                    <h4 className="block text-sm font-medium text-teal-800 mb-3">
                                        Selecciona el color para la tapa
                                    </h4>
                                    <div className="flex flex-wrap gap-x-3 gap-y-4">
                                        {availableBitonoColors.map(color => (
                                            <button
                                                key={color.id}
                                                onClick={() => onSelectBitonoColor(color)}
                                                className="flex flex-col items-center justify-center space-y-2 group focus:outline-none"
                                                aria-label={`Seleccionar color de tapa ${color.name}`}
                                                aria-pressed={bitonoColor?.id === color.id}
                                            >
                                                <div
                                                    style={{ backgroundColor: color.hex }}
                                                    className={`w-12 h-12 rounded-full border transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-teal-500
                                                        ${bitonoColor?.id === color.id ? 'ring-2 ring-offset-2 ring-teal-500 border-teal-500' : 'border-slate-300 group-hover:border-teal-400'}
                                                        ${color.hex === '#FFFFFF' ? 'border-slate-300' : 'border-transparent'}
                                                    `}
                                                ></div>
                                                <span className={`text-xs font-medium ${bitonoColor?.id === color.id ? 'text-teal-600' : 'text-slate-600'}`}>{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {!bitonoColor && (
                                        <p className="text-xs text-amber-800 bg-amber-100 p-2 rounded-md mt-4">
                                            <strong>Atención:</strong> Debes seleccionar un color para la tapa para poder continuar.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {hasCut && (
                 <div className="mt-6 p-4 bg-teal-50/50 rounded-lg animate-fade-in border-t-2 border-teal-200">
                    <h4 className="block text-base font-semibold text-teal-800 mb-3">
                        Medidas Finales del Plato (Corte)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cutWidth" className="block text-sm font-medium text-slate-700 mb-1">Ancho Final (cm)</label>
                            <input
                                id="cutWidth"
                                type="number"
                                placeholder={`Máx: ${baseWidth} cm`}
                                value={cutWidth || ''}
                                onChange={(e) => onUpdateCutDimensions({ cutWidth: e.target.value ? Number(e.target.value) : undefined, cutLength })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="cutLength" className="block text-sm font-medium text-slate-700 mb-1">Largo Final (cm)</label>
                             <input
                                id="cutLength"
                                type="number"
                                placeholder={`Máx: ${baseLength} cm`}
                                value={cutLength || ''}
                                onChange={(e) => onUpdateCutDimensions({ cutWidth, cutLength: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                            />
                        </div>
                    </div>
                    {cutValidationError ? (
                        <p className="text-xs text-red-700 bg-red-100 p-2 rounded-md mt-4">
                           {cutValidationError}
                        </p>
                    ) : (
                         <p className="text-xs text-teal-700 mt-3">
                            Introduce las dimensiones exactas a las que se debe cortar el plato.
                        </p>
                    )}
                </div>
            )}

            {renderStructFramesSelector()}
        </div>
    );
};

export default Step4Extras;
import React, { useMemo } from 'react';
import { SHOWER_EXTRAS, SOFTUM_EXTRAS, STANDARD_COLORS, TAPETA_LUXE_EXTRA } from '../../constants';
import type { ProductOption, ColorOption } from '../../types';

interface Step4ExtrasProps {
    onToggle: (extra: ProductOption) => void;
    selectedExtras: ProductOption[];
    productLine: string | null;
    mainColor: ColorOption | null;
    bitonoColor: ColorOption | null | undefined;
    onSelectBitonoColor: (color: ColorOption) => void;
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
}) => {
    
    const isSelected = (extraId: string) => selectedExtras.some(e => e.id === extraId);
    
    const availableExtras = useMemo(() => {
        if (productLine === 'SOFTUM') {
            return SOFTUM_EXTRAS;
        }
        
        let generalExtras = SHOWER_EXTRAS.filter(e => e.id !== 'ral');

        if (productLine === 'LUXE') {
            // For LUXE, the stainless steel grid is free.
            const modifiedExtras = generalExtras.map(e => 
                e.id === 'rejilla' ? { ...e, price: 0 } : e
            );
            return [...modifiedExtras, TAPETA_LUXE_EXTRA];
        }

        return generalExtras;
    }, [productLine]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Añade los extras</h2>
            <p className="text-slate-500 mb-8">Completa tu plato de ducha con nuestros accesorios y tratamientos premium.</p>

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
                                className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${isCurrentlySelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-400'}`}
                            >
                                <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 ${isCurrentlySelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                                   {isCurrentlySelected && <CheckIcon />}
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-bold text-slate-800">{extra.name}</h3>
                                    <p className="text-sm text-slate-500">{extra.description}</p>
                                </div>
                                <div className="font-bold text-slate-800 text-lg">
                                    + {extra.price}€
                                </div>
                            </div>
                            
                            {/* Bitono Color Picker */}
                            {extra.id === 'bitono' && isCurrentlySelected && (
                                <div className="mt-3 ml-4 md:ml-14 p-4 bg-indigo-50/70 rounded-md animate-fade-in">
                                    <h4 className="text-base font-semibold text-slate-700 mb-4">Elige el color de la tapa</h4>
                                    
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {STANDARD_COLORS.map((color) => {
                                            const isSelectedForBitono = bitonoColor?.id === color.id;
                                            const isSameAsMain = mainColor?.id === color.id;
                                            return (
                                                <button
                                                    key={`bitono-${color.id}`}
                                                    onClick={(e) => { e.stopPropagation(); onSelectBitonoColor(color); }}
                                                    disabled={isSameAsMain}
                                                    className="flex flex-col items-center justify-center space-y-1 group disabled:opacity-40 disabled:cursor-not-allowed"
                                                    aria-label={`Seleccionar color de tapa ${color.name}`}
                                                    aria-pressed={isSelectedForBitono}
                                                >
                                                    <div
                                                        style={{ backgroundColor: color.hex }}
                                                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200
                                                            ${isSelectedForBitono ? 'border-indigo-500 ring-4 ring-indigo-200' : 'border-slate-300 group-hover:border-indigo-400'}
                                                            ${color.hex === '#FFFFFF' ? 'border-slate-300' : ''}
                                                        `}
                                                    ></div>
                                                    <span className={`text-xs font-medium ${isSelectedForBitono ? 'text-indigo-600' : 'text-slate-600'}`}>{color.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    
                                     <p className="text-xs text-slate-500 mt-2 p-2 bg-slate-100 rounded-md">
                                        Para la opción bitono, la tapa solo puede ser de un color de nuestra paleta estándar. No se admiten colores RAL personalizados para la tapa.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Step4Extras;
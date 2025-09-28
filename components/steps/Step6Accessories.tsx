import React, { useMemo } from 'react';
import { ACCESSORY_EXTRAS, SOFTUM_EXTRAS, STANDARD_COLORS } from '../../constants';
import type { ProductOption, ColorOption } from '../../types';

interface Step6AccessoriesProps {
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

const Step6Accessories: React.FC<Step6AccessoriesProps> = ({ 
    onToggle, 
    selectedExtras, 
    productLine,
    mainColor,
    bitonoColor,
    onSelectBitonoColor,
}) => {
    
    const isSelected = (extraId: string) => selectedExtras.some(e => e.id === extraId);
    
    const availableExtras = useMemo(() => {
        const generalExtras = ACCESSORY_EXTRAS.filter(e => e.id !== 'ral');
        
        switch (productLine) {
            case 'SOFTUM':
                return [...SOFTUM_EXTRAS];
            case 'LUXE':
                return generalExtras.filter(e => 
                    e.id === 'rejilla-lacada-luxe' || 
                    e.id === 'rejilla-oro-cepillado-pvd' ||
                    e.id === 'rejilla-oro-rosa-cepillado-pvd' ||
                    e.id === 'rejilla-gun-metal-pvd'
                );
            case 'FLAT':
            case 'CLASSIC':
            case 'STRUCT':
            case 'CENTRAL':
            case 'RATIO':
            case 'STRUCT DETAIL':
                return generalExtras.filter(e => 
                    e.id === 'rejilla-lacada-standard' ||
                    e.id === 'rejilla-oro-cepillado-pvd-standard' ||
                    e.id === 'rejilla-oro-rosa-cepillado-pvd-standard' ||
                    e.id === 'rejilla-gun-metal-pvd-standard'
                );
            default:
                return [];
        }
    }, [productLine]);

    const availableBitonoColors = useMemo(() => {
        if (!mainColor) return STANDARD_COLORS;
        return STANDARD_COLORS.filter(c => c.id !== mainColor.id);
    }, [mainColor]);

    const title = 'Añade accesorios';
    const description = 'Completa tu plato de ducha con nuestros accesorios opcionales.';

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">{title}</h2>
            <p className="text-slate-500 mb-8">{description}</p>

            <div className="space-y-4">
                {availableExtras.length > 0 ? availableExtras.map((extra) => {
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
                }) : (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                         <h3 className="text-lg font-medium text-slate-800">Sin Accesorios Disponibles</h3>
                         <p className="mt-1 text-sm text-slate-500">Esta colección no tiene accesorios opcionales.</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default Step6Accessories;
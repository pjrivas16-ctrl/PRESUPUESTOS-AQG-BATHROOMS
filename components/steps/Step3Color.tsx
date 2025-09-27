import React from 'react';
import { STANDARD_COLORS, ACCESSORY_EXTRAS } from '../../constants';
import type { ColorOption } from '../../types';

interface Step3ColorProps {
    onSelectColor: (color: ColorOption) => void;
    selectedColor: ColorOption | null;
    onToggleRal: () => void;
    isRalSelected: boolean;
    ralCode: string;
    onRalCodeChange: (code: string) => void;
}

const Step3Color: React.FC<Step3ColorProps> = ({ 
    onSelectColor, 
    selectedColor, 
    onToggleRal,
    isRalSelected,
    ralCode,
    onRalCodeChange
}) => {
    
    const availableColors = STANDARD_COLORS;
    const ralExtra = ACCESSORY_EXTRAS.find(e => e.id === 'ral');

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Elige un color</h2>
            <p className="text-slate-500 mb-6">Selecciona un color de nuestra paleta estándar o personalízalo con un código RAL.</p>
            <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg mb-8">
                <p><strong>Nota:</strong> Los colores expuestos son orientativos y no representan el acabado final del producto.</p>
            </div>

            <h3 className="text-lg font-semibold text-slate-700 mb-4">Colores Estándar</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-5">
                {availableColors.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => onSelectColor(color)}
                        className="flex flex-col items-center justify-center space-y-2 group focus:outline-none"
                        aria-label={`Seleccionar color ${color.name}`}
                        aria-pressed={selectedColor?.id === color.id}
                        disabled={isRalSelected}
                    >
                        <div
                            style={{ backgroundColor: color.hex }}
                            className={`w-16 h-16 rounded-full border transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-teal-500
                                ${selectedColor?.id === color.id ? 'ring-2 ring-offset-2 ring-teal-500 border-teal-500' : 'border-slate-300 group-hover:border-teal-400'}
                                ${isRalSelected ? 'opacity-50 cursor-not-allowed' : ''}
                                ${color.hex === '#FFFFFF' ? 'border-slate-300' : 'border-transparent'}
                            `}
                        ></div>
                        <span className={`text-sm font-medium ${selectedColor?.id === color.id ? 'text-teal-600' : 'text-slate-600'} ${isRalSelected ? 'opacity-50' : ''}`}>{color.name}</span>
                        {color.price > 0 && <span className={`text-xs text-slate-500 ${isRalSelected ? 'opacity-50' : ''}`}>+ {color.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>}
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Color Personalizado</h3>
                 <div
                    onClick={onToggleRal}
                    role="checkbox"
                    aria-checked={isRalSelected}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleRal()}
                    className={`flex items-center p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer ${isRalSelected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-400'}`}
                >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-200 ${isRalSelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                       {isRalSelected && (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                       )}
                    </div>
                    <div className="ml-4 flex-grow">
                        <h4 className="font-bold text-slate-800">{ralExtra?.name || 'Color personalizado RAL'}</h4>
                        <p className="text-sm text-slate-500">{ralExtra?.description || 'Personaliza tu plato con cualquier color de la carta RAL.'}</p>
                    </div>
                    <div className="font-bold text-slate-800 text-lg">
                        + {ralExtra?.price || 0}€
                    </div>
                </div>
                {isRalSelected && (
                    <div className="mt-3 ml-4 md:ml-14 p-4 bg-teal-50 rounded-lg animate-fade-in">
                        <label htmlFor="ral-code" className="block text-sm font-medium text-teal-800 mb-1">
                            Introduce el código RAL
                        </label>
                        <input
                            id="ral-code"
                            type="text"
                            value={ralCode}
                            onChange={(e) => onRalCodeChange(e.target.value.toUpperCase())}
                            placeholder="Ej: RAL 9010"
                            className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                        <p className="text-xs text-teal-700 mt-1">Este campo es obligatorio para continuar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step3Color;
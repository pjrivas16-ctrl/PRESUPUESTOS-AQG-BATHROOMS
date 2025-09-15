

import React from 'react';
import { STANDARD_COLORS } from '../../constants';
import type { ColorOption } from '../../types';

interface Step3ColorProps {
    onSelectColor: (color: ColorOption) => void;
    selectedColor: ColorOption | null;
    productLine: string | null;
    onToggleRal: () => void;
    isRalSelected: boolean;
    ralCode: string;
    onRalCodeChange: (code: string) => void;
}

const Step3Color: React.FC<Step3ColorProps> = ({ 
    onSelectColor, 
    selectedColor, 
    productLine,
    onToggleRal,
    isRalSelected,
    ralCode,
    onRalCodeChange
}) => {
    
    const availableColors = STANDARD_COLORS;

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Elige un color</h2>
            <p className="text-slate-500 mb-6">Selecciona un color de nuestra paleta estándar o personalízalo con un código RAL.</p>
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-md mb-8">
                Nota: Los colores expuestos son orientativos y no representan el acabado final del producto.
            </p>

            <h3 className="text-lg font-semibold text-slate-700 mb-4">Colores Estándar</h3>
            <div className="flex flex-wrap gap-4">
                {availableColors.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => onSelectColor(color)}
                        className="flex flex-col items-center justify-center space-y-2 group"
                        aria-label={`Seleccionar color ${color.name}`}
                        aria-pressed={selectedColor?.id === color.id}
                        disabled={isRalSelected}
                    >
                        <div
                            style={{ backgroundColor: color.hex }}
                            className={`w-16 h-16 rounded-full border-2 transition-all duration-200
                                ${selectedColor?.id === color.id ? 'border-indigo-500 ring-4 ring-indigo-200' : 'border-slate-300 group-hover:border-indigo-400'}
                                ${isRalSelected ? 'opacity-50 cursor-not-allowed' : ''}
                                ${color.hex === '#FFFFFF' ? 'border-slate-300' : ''}
                            `}
                        ></div>
                        <span className={`text-sm font-medium ${selectedColor?.id === color.id ? 'text-indigo-600' : 'text-slate-600'} ${isRalSelected ? 'opacity-50' : ''}`}>{color.name}</span>
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
                    className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${isRalSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-400'}`}
                >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 ${isRalSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                       {isRalSelected && (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                       )}
                    </div>
                    <div className="ml-4 flex-grow">
                        <h4 className="font-bold text-slate-800">Color personalizado RAL</h4>
                        <p className="text-sm text-slate-500">Personaliza tu plato con cualquier color de la carta RAL.</p>
                    </div>
                    <div className="font-bold text-slate-800 text-lg">
                        + 65€
                    </div>
                </div>
                {isRalSelected && (
                    <div className="mt-3 ml-4 md:ml-14 p-4 bg-indigo-50/70 rounded-md animate-fade-in">
                        <label htmlFor="ral-code" className="block text-sm font-medium text-slate-700 mb-1">
                            Introduce el código RAL
                        </label>
                        <input
                            id="ral-code"
                            type="text"
                            value={ralCode}
                            onChange={(e) => onRalCodeChange(e.target.value.toUpperCase())}
                            placeholder="Ej: RAL 9010"
                            className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <p className="text-xs text-slate-500 mt-1">Este campo es obligatorio para continuar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step3Color;


import React from 'react';
import { KIT_PRODUCTS } from '../../../constants';
import type { ProductOption } from '../../../types';

interface Step2KitSelectionProps {
    onSelect: (kit: ProductOption) => void;
    selectedKit: ProductOption | null;
}

const CheckBadge = () => (
    <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center transition-transform transform scale-0 group-aria-checked:scale-100 duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    </div>
);

const Step2KitSelection: React.FC<Step2KitSelectionProps> = ({ onSelect, selectedKit }) => {
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Selecciona un Kit</h2>
            <p className="text-slate-500 mb-8">Elige el producto que necesitas añadir a tu presupuesto.</p>
            
            <div className="grid grid-cols-1 gap-4">
                {KIT_PRODUCTS.map((kit) => {
                    const isSelected = selectedKit?.id === kit.id;
                    return (
                        <button
                            key={kit.id}
                            onClick={() => onSelect(kit)}
                            role="radio"
                            aria-checked={isSelected}
                            className="group relative text-left p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 w-full bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500
                            aria-checked:border-teal-500 aria-checked:bg-teal-50 hover:border-teal-400"
                        >
                            <CheckBadge />
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{kit.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{kit.description}</p>
                            </div>
                             <div className="absolute bottom-3 right-4 font-bold text-slate-800 text-lg">
                                {kit.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Step2KitSelection;
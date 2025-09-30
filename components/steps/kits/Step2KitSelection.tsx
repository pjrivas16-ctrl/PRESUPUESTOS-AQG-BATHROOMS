import React from 'react';
import { KIT_PRODUCTS, STANDARD_COLORS, ACCESSORY_EXTRAS } from '../../../constants';
import type { ProductOption, QuoteState, ColorOption } from '../../../types';

interface Step2KitSelectionProps {
    onUpdate: (updates: Partial<QuoteState>) => void;
    currentItemConfig: QuoteState;
}

const CheckBadge = () => (
    <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center transition-transform transform scale-0 group-aria-checked:scale-100 duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    </div>
);

const Step2KitSelection: React.FC<Step2KitSelectionProps> = ({ onUpdate, currentItemConfig }) => {
    const { kitProduct, color: selectedColor, ralCode, invoiceReference } = currentItemConfig;
    const isRalSelected = currentItemConfig.extras.some(e => e.id === 'ral');

    const handleSelectKit = (kit: ProductOption) => {
        onUpdate({ kitProduct: kit });
    };

    const handleSelectColor = (color: ColorOption) => {
        onUpdate({ color, extras: currentItemConfig.extras.filter(e => e.id !== 'ral'), ralCode: '' });
    };

    const handleToggleRal = () => {
        const isCurrentlyRal = currentItemConfig.extras.some(e => e.id === 'ral');
        const ralExtra = ACCESSORY_EXTRAS.find(e => e.id === 'ral');
        if (!ralExtra) return;

        if (isCurrentlyRal) {
            onUpdate({ extras: currentItemConfig.extras.filter(e => e.id !== 'ral'), ralCode: '', color: STANDARD_COLORS[0] });
        } else {
            onUpdate({ extras: [...currentItemConfig.extras, ralExtra], color: null, ralCode: '' });
        }
    };
    
    const handleRalCodeChange = (code: string) => {
        onUpdate({ ralCode: code });
    };

    const handleInvoiceRefChange = (ref: string) => {
        onUpdate({ invoiceReference: ref });
    };

    const showColorSelector = kitProduct?.id === 'kit-pintura' || kitProduct?.id === 'kit-reparacion';

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Selecciona un Kit y sus Detalles</h2>
            <p className="text-slate-500 mb-8">Elige el producto que necesitas y configura sus opciones.</p>
            
            <div className="grid grid-cols-1 gap-4">
                {KIT_PRODUCTS.map((kit) => {
                    const isSelected = kitProduct?.id === kit.id;
                    return (
                        <button
                            key={kit.id}
                            onClick={() => handleSelectKit(kit)}
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
                        </button>
                    );
                })}
            </div>

            {kitProduct && (
                <div className="mt-8 pt-6 border-t border-slate-200 animate-fade-in">
                    <h3 className="text-xl font-semibold text-slate-700 mb-6">Detalles del Pedido</h3>
                    
                    <div>
                        <label htmlFor="invoiceReference" className="block text-sm font-medium text-slate-700 mb-2">
                            Referencia de Factura o Albarán (Opcional)
                        </label>
                        <input
                            id="invoiceReference"
                            type="text"
                            value={invoiceReference || ''}
                            onChange={(e) => handleInvoiceRefChange(e.target.value)}
                            placeholder="Ej: FAC-2023-123"
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                    </div>
                    
                    {showColorSelector && (
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-700 mb-4">Selección de Color del Kit</h3>
                            <h4 className="text-base font-semibold text-slate-700 mb-4">Colores Estándar</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-5">
                                {STANDARD_COLORS.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => handleSelectColor(color)}
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
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="text-base font-semibold text-slate-700 mb-4">Color Personalizado</h4>
                                <div
                                    onClick={handleToggleRal}
                                    role="checkbox"
                                    aria-checked={isRalSelected}
                                    tabIndex={0}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleRal()}
                                    className={`flex items-center p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer ${isRalSelected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-400'}`}
                                >
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-200 ${isRalSelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                                       {isRalSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <h4 className="font-bold text-slate-800">Color personalizado RAL</h4>
                                        <p className="text-sm text-slate-500">Indica un color de la carta RAL sin coste adicional para este producto.</p>
                                    </div>
                                </div>
                                {isRalSelected && (
                                    <div className="mt-3 ml-4 md:ml-14 p-4 bg-teal-50 rounded-lg animate-fade-in">
                                        <label htmlFor="ral-code-kit" className="block text-sm font-medium text-teal-800 mb-1">Introduce el código RAL</label>
                                        <input
                                            id="ral-code-kit"
                                            type="text"
                                            value={ralCode || ''}
                                            onChange={(e) => handleRalCodeChange(e.target.value.toUpperCase())}
                                            placeholder="Ej: RAL 9010"
                                            className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Step2KitSelection;

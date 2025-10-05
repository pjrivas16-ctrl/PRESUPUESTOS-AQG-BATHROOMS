import React from 'react';
import { PRODUCT_LINES } from '../../constants';
import QuantitySelector from '../QuantitySelector';

interface Step1ModelSelectionProps {
    onUpdate: (model: string) => void;
    selectedProductLine: string | null;
    quantity: number;
    onUpdateQuantity: (quantity: number) => void;
    onCountertopSelectRequest: () => void;
}

const Step1ModelSelection: React.FC<Step1ModelSelectionProps> = ({ onUpdate, selectedProductLine, quantity, onUpdateQuantity, onCountertopSelectRequest }) => {
    
    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(e.target.value);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Selecciona el producto</h2>
            <p className="text-slate-500 mb-8">Elige el tipo de producto y la cantidad que mejor se adapte a tu diseño.</p>
            
            <div className="space-y-8">
                {/* Shower Tray Selection */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="md:col-span-3">
                        <label htmlFor="product-line" className="block text-sm font-medium text-slate-700 mb-2">Selección de plato de ducha</label>
                        <select
                            id="product-line"
                            name="product-line"
                            value={selectedProductLine || ''}
                            onChange={handleModelChange}
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        >
                            <option value="" disabled>-- Selecciona una colección --</option>
                            {PRODUCT_LINES.map(line => (
                                <option key={line} value={line}>{line}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Unidades</label>
                        <QuantitySelector quantity={quantity} onUpdateQuantity={onUpdateQuantity} />
                    </div>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-100 px-2 text-sm text-slate-500">o</span>
                    </div>
                </div>

                {/* Countertop Selection */}
                <div>
                    <label htmlFor="countertop-line" className="block text-sm font-medium text-slate-700 mb-2">Selección de encimera de baño</label>
                    <div
                        onClick={onCountertopSelectRequest}
                        className="w-full p-3 bg-slate-200 border border-slate-300 rounded-lg shadow-sm text-slate-500 cursor-pointer hover:bg-slate-300 transition-colors flex justify-between items-center"
                    >
                        <span>-- Próximamente --</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-100 px-2 text-sm text-slate-500">o</span>
                    </div>
                </div>

                {/* SPC Panel Selection */}
                <div>
                    <label htmlFor="spc-panel-line" className="block text-sm font-medium text-slate-700 mb-2">Selección Paneles SPC</label>
                    <div
                        onClick={onCountertopSelectRequest}
                        className="w-full p-3 bg-slate-200 border border-slate-300 rounded-lg shadow-sm text-slate-500 cursor-pointer hover:bg-slate-300 transition-colors flex justify-between items-center"
                    >
                        <span>-- Próximamente --</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Step1ModelSelection;
import React from 'react';
import { PRODUCT_LINES } from '../../constants';

interface Step1ModelSelectionProps {
    onUpdate: (model: string) => void;
    selectedProductLine: string | null;
    quantity: number;
    onUpdateQuantity: (quantity: number) => void;
}

const Step1ModelSelection: React.FC<Step1ModelSelectionProps> = ({ onUpdate, selectedProductLine, quantity, onUpdateQuantity }) => {
    
    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(e.target.value);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Selecciona el modelo</h2>
            <p className="text-slate-500 mb-8">Elige la línea de producto y la cantidad que mejor se adapte a tu diseño.</p>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="product-line" className="block text-sm font-medium text-slate-700 mb-2">Modelo de plato</label>
                    <select
                        id="product-line"
                        name="product-line"
                        value={selectedProductLine || ''}
                        onChange={handleModelChange}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    >
                        <option value="" disabled>-- Selecciona un modelo --</option>
                        {PRODUCT_LINES.map(line => (
                            <option key={line} value={line}>{line}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-2">Cantidad</label>
                    <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => onUpdateQuantity(parseInt(e.target.value, 10))}
                        min="1"
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step1ModelSelection;
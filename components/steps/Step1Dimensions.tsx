import React, { useMemo, useEffect } from 'react';
import type { QuoteState } from '../../types';
import { PRICE_LIST } from '../../constants';


interface Step1DimensionsProps {
    quote: QuoteState;
    onUpdate: (width: number, length: number) => void;
}

const Step1Dimensions: React.FC<Step1DimensionsProps> = ({ quote, onUpdate }) => {
    
    const { availableWidths, availableLengths } = useMemo(() => {
        if (!quote.productLine || !PRICE_LIST[quote.productLine]) {
            return { availableWidths: [], availableLengths: [] };
        }

        const widths = Object.keys(PRICE_LIST[quote.productLine]).map(Number).sort((a, b) => a - b);
        
        const lengths = (quote.width && PRICE_LIST[quote.productLine][quote.width])
            ? Object.keys(PRICE_LIST[quote.productLine][quote.width]).map(Number).sort((a, b) => a - b)
            : [];
            
        return { availableWidths: widths, availableLengths: lengths };
    }, [quote.productLine, quote.width]);

    // Effect to auto-select a valid width if the current one becomes invalid (e.g., after changing product line)
     useEffect(() => {
        if (quote.productLine && availableWidths.length > 0 && !availableWidths.includes(quote.width)) {
            // Find the closest valid width or default to the first one
            const newWidth = availableWidths.find(w => w >= 70) || availableWidths[0];
            onUpdate(newWidth, quote.length);
        }
    }, [quote.productLine, quote.width, availableWidths, onUpdate]);

    // Effect to auto-select a valid length if the current one becomes invalid (e.g., after changing width)
     useEffect(() => {
        if (quote.width && availableLengths.length > 0 && !availableLengths.includes(quote.length)) {
             // Find the closest valid length or default to the first one
            const newLength = availableLengths.find(l => l >= 100) || availableLengths[0];
            onUpdate(quote.width, newLength);
        }
    }, [quote.width, quote.length, availableLengths, onUpdate]);


    const handleWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(Number(e.target.value), quote.length);
    };

    const handleLengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(quote.width, Number(e.target.value));
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Elige las dimensiones</h2>
            <p className="text-slate-500 mb-8">Define el ancho y el largo de tu plato de ducha usando nuestras medidas estándar.</p>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="width" className="block text-sm font-medium text-slate-700 mb-2">Ancho (cm)</label>
                    <select
                        id="width"
                        name="width"
                        value={quote.width || ''}
                        onChange={handleWidthChange}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    >
                         <option value="" disabled>-- Selecciona --</option>
                        {availableWidths.map(w => (
                            <option key={w} value={w}>{w} cm</option>
                        ))}
                    </select>
                </div>
                <div>
                     <label htmlFor="length" className="block text-sm font-medium text-slate-700 mb-2">Largo (cm)</label>
                    <select
                        id="length"
                        name="length"
                        value={quote.length || ''}
                        onChange={handleLengthChange}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        disabled={availableLengths.length === 0}
                    >
                         <option value="" disabled>-- Selecciona --</option>
                         {availableLengths.map(l => (
                            <option key={l} value={l}>{l} cm</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Step1Dimensions;
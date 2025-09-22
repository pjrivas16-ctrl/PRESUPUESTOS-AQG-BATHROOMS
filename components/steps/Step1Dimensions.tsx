import React from 'react';
import type { QuoteState } from '../../types';
import { STANDARD_WIDTHS, STANDARD_LENGTHS, SOFTUM_WIDTHS, SOFTUM_LENGTHS } from '../../constants';


interface Step1DimensionsProps {
    quote: QuoteState;
    onUpdate: (width: number, length: number) => void;
}

const Step1Dimensions: React.FC<Step1DimensionsProps> = ({ quote, onUpdate }) => {
    
    const isSoftum = quote.productLine === 'SOFTUM';
    const availableWidths = isSoftum ? SOFTUM_WIDTHS : STANDARD_WIDTHS;
    const availableLengths = isSoftum ? SOFTUM_LENGTHS : STANDARD_LENGTHS;

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
                        value={quote.width}
                        onChange={handleWidthChange}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    >
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
                        value={quote.length}
                        onChange={handleLengthChange}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    >
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
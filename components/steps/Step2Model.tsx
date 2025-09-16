

import React from 'react';
import { SHOWER_MODELS } from '../../constants';
import type { ProductOption } from '../../types';

interface Step2ModelProps {
    onSelect: (model: ProductOption) => void;
    selectedModel: ProductOption | null;
    productLine: string | null;
}

const Step2Model: React.FC<Step2ModelProps> = ({ onSelect, selectedModel, productLine }) => {
    
    let modelsToShow;
    if (productLine === 'SOFTUM') {
        modelsToShow = SHOWER_MODELS.filter(m => m.id === 'sand');
    } else if (productLine === 'LUXE' || productLine === 'CLASSIC') {
        modelsToShow = SHOWER_MODELS.filter(m => m.id === 'pizarra');
    } else {
        modelsToShow = SHOWER_MODELS.filter(m => m.id !== 'sand');
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Selecciona la textura</h2>
            <p className="text-slate-500 mb-8">Cada textura ofrece una sensación y estética únicas.</p>
            
            <div className="grid grid-cols-1 gap-4">
                {modelsToShow.map((model) => {
                    const description = model.id === 'pizarra'
                        ? "Textura exclusiva para esta colección"
                        : model.description;
                    
                    return (
                        <button
                            key={model.id}
                            onClick={() => onSelect(model)}
                            className={`text-left p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 w-full
                            ${selectedModel?.id === model.id ? 'border-indigo-500 bg-white shadow-lg' : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-white'}`}
                        >
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800">{model.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Step2Model;

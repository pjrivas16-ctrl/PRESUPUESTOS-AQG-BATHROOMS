import React, { useState, useEffect } from 'react';

interface QuantitySelectorProps {
    quantity: number;
    onUpdateQuantity: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onUpdateQuantity }) => {
    const [inputValue, setInputValue] = useState(String(quantity));

    useEffect(() => {
        // Sync with parent state if it changes from outside (e.g., loading an item to edit)
        setInputValue(String(quantity));
    }, [quantity]);

    const handleDecrement = () => {
        onUpdateQuantity(Math.max(1, quantity - 1));
    };

    const handleIncrement = () => {
        onUpdateQuantity(quantity + 1);
    };

    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only digits to be entered
        if (/^\d*$/.test(value)) {
            setInputValue(value);
        }
    };
    
    const handleBlur = () => {
        let numValue = parseInt(inputValue, 10);
        // If input is empty or invalid, default to 1
        if (isNaN(numValue) || numValue < 1) {
            numValue = 1;
        }
        // Update parent state
        onUpdateQuantity(numValue);
        // Sync local input state to the validated number
        setInputValue(String(numValue));
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
            (e.target as HTMLInputElement).blur(); // Remove focus from input
        }
    };

    return (
        <div className="flex items-center rounded-lg border border-slate-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-offset-0 focus-within:ring-teal-500 transition w-min">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-16 text-center p-3 border-l border-r border-slate-300 bg-white focus:outline-none [appearance:textfield]"
                aria-label="Unidades"
            />
            <button
                type="button"
                onClick={handleIncrement}
                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                aria-label="Aumentar cantidad"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};

export default QuantitySelector;
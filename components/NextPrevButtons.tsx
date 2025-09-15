
import React from 'react';

interface NextPrevButtonsProps {
    onNext: () => void;
    onPrev: () => void;
    currentStep: number;
    totalSteps: number;
    isNextDisabled?: boolean;
}

const NextPrevButtons: React.FC<NextPrevButtonsProps> = ({ onNext, onPrev, currentStep, totalSteps, isNextDisabled }) => {
    const isLastStep = currentStep === totalSteps - 1; // Step 5 is the last configuration step

    return (
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
                onClick={onPrev}
                disabled={currentStep === 1}
                className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Anterior
            </button>
            <button
                onClick={onNext}
                disabled={isNextDisabled}
                className="px-8 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {isLastStep ? 'Añadir y ver resumen' : 'Siguiente'}
            </button>
        </div>
    );
};

export default NextPrevButtons;
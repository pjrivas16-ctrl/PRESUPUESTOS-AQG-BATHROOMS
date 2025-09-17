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
        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center">
            <button
                onClick={onPrev}
                disabled={currentStep === 1}
                className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-200/60 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Anterior
            </button>
            <button
                onClick={onNext}
                disabled={isNextDisabled}
                className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:shadow-lg disabled:from-teal-300 disabled:to-cyan-300 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-2"
            >
                {isLastStep ? 'Añadir y ver resumen' : 'Siguiente'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

export default NextPrevButtons;
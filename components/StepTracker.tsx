import React from 'react';

interface Step {
    number: number;
    title: string;
}

interface StepTrackerProps {
    currentStep: number;
    steps: Step[];
    onStepClick: (stepNumber: number) => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const StepTracker: React.FC<StepTrackerProps> = ({ currentStep, steps, onStepClick }) => {
    return (
        <nav aria-label="Progress">
            <ol className="space-y-4 md:space-y-3">
                {steps.map((step) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;
                    const isClickable = isCompleted;

                    return (
                        <li key={step.number}>
                            <button
                                onClick={() => isClickable && onStepClick(step.number)}
                                disabled={!isClickable}
                                className={`flex items-start w-full text-left ${isClickable ? 'cursor-pointer group' : 'cursor-default'}`}
                                aria-label={`Ir al paso ${step.number}: ${step.title}`}
                            >
                                <div className="flex-shrink-0">
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold transition-colors
                                        ${isActive ? 'bg-teal-500 text-white ring-4 ring-teal-500/20' : ''}
                                        ${isCompleted ? 'bg-teal-600 text-white group-hover:bg-teal-500' : ''}
                                        ${!isActive && !isCompleted ? 'bg-slate-100 text-slate-500' : ''}
                                    `}>
                                        {isCompleted ? <CheckIcon /> : step.number}
                                    </span>
                                </div>
                                <div className="ml-4 mt-1.5">
                                    <h3 className={`text-base font-semibold transition-colors
                                        ${isActive ? 'text-teal-600' : ''}
                                        ${isCompleted ? 'text-slate-700 group-hover:text-teal-600' : ''}
                                        ${!isActive && !isCompleted ? 'text-slate-400' : ''}
                                    `}>{step.title}</h3>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default StepTracker;

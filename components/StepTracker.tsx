import React from 'react';

interface Step {
    number: number;
    title: string;
}

interface StepTrackerProps {
    currentStep: number;
    steps: Step[];
}

const StepTracker: React.FC<StepTrackerProps> = ({ currentStep, steps }) => {
    return (
        <nav>
            <ul className="space-y-1">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;

                    return (
                        <li key={step.number} className="flex items-start space-x-4 group">
                            <div className="flex flex-col items-center h-full">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold z-10 transition-colors duration-300
                                    ${isActive ? 'bg-indigo-500 text-white ring-4 ring-slate-700' : ''}
                                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                                    ${!isActive && !isCompleted ? 'bg-slate-700 text-slate-300' : ''}
                                `}>
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : step.number}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-0.5 flex-grow mt-1 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                )}
                            </div>
                            <div className="pt-1">
                                <span className={`font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                    {step.title}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default StepTracker;
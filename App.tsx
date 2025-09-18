import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem } from './types';
import { PRICE_LIST, STEPS, STANDARD_WIDTHS, STANDARD_LENGTHS, SOFTUM_WIDTHS, SOFTUM_LENGTHS, SHOWER_MODELS, SHOWER_EXTRAS, SOFTUM_EXTRAS, CLASSIC_GRILLES } from './constants';
import { authorizedUsers } from './authorizedUsers';
import { aqgLogo } from './assets';

import StepTracker from './components/StepTracker';
import Step1ModelSelection from './components/steps/Step1ModelSelection';
import Step1Dimensions from './components/steps/Step1Dimensions';
import Step2Model from './components/steps/Step2Model';
import Step3Color from './components/steps/Step3Color';
import Step4Extras from './components/steps/Step4Extras';
import Step5Summary from './components/steps/Step5Summary';
import NextPrevButtons from './components/NextPrevButtons';
import AuthPage from './components/auth/AuthPage';
import MyQuotesPage from './components/MyQuotesPage';
import LivePreview from './components/LivePreview';
import PromotionsPage from './components/PromotionsPage';

// Declare jsPDF on window for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}

// --- SettingsModal Component Definition ---
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: { commercialName: string; preparedBy: string }) => void;
    user: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [preparedBy, setPreparedBy] = useState(user.preparedBy || '');
    const [commercialName, setCommercialName] = useState(user.commercialName || user.companyName || '');

    useEffect(() => {
        if (isOpen) {
            setPreparedBy(user.preparedBy || '');
            setCommercialName(user.commercialName || user.companyName || '');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ preparedBy, commercialName });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Ajustes de PDF</h3>
                            <p className="text-sm text-slate-500">Personaliza la información en tus presupuestos.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-6">
                     <div>
                        <label htmlFor="commercial-name" className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre Comercial (en PDF)
                        </label>
                        <input
                            id="commercial-name"
                            type="text"
                            value={commercialName}
                            onChange={(e) => setCommercialName(e.target.value)}
                            placeholder="Nombre de tu tienda o empresa"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Este es el nombre que aparecerá como remitente.</p>
                    </div>
                    <div>
                        <label htmlFor="prepared-by" className="block text-sm font-medium text-slate-700 mb-2">
                            Preparado por (nombre del comercial)
                        </label>
                        <input
                            id="prepared-by"
                            type="text"
                            value={preparedBy}
                            onChange={(e) => setPreparedBy(e.target.value)}
                            placeholder="Ej: Sandra Martínez"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Este nombre aparecerá en los PDFs generados.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- DiscountModal Component Definition ---
interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (discount: number) => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [discount, setDiscount] = useState(0);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(discount);
        onClose();
        setDiscount(0);
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setDiscount(value);
        } else if (e.target.value === '') {
            setDiscount(0);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Aplicar Descuento</h3>
                            <p className="text-sm text-slate-500">Introduce un descuento para este PDF.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-slate-700 mb-2">
                            Descuento (%)
                        </label>
                        <input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={handleDiscountChange}
                            min="0"
                            max="100"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                         <p className="text-xs text-slate-500 mt-1">El descuento se aplicará sobre la base imponible.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                     <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleConfirm} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                        Generar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- SaveQuoteModal Component Definition ---
interface SaveQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: { customerName: string; projectReference: string }) => void;
    disabled: boolean;
}

const SaveQuoteModal: React.FC<SaveQuoteModalProps> = ({ isOpen, onClose, onConfirm, disabled }) => {
    const [customerName, setCustomerName] = useState('');
    const [projectReference, setProjectReference] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (customerName.trim()) {
            onConfirm({ customerName, projectReference });
            onClose();
            setCustomerName('');
            setProjectReference('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Guardar Presupuesto</h3>
                            <p className="text-sm text-slate-500">Añade los detalles para identificarlo.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre del Cliente <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                    </div>
                     <div>
                        <label htmlFor="projectReference" className="block text-sm font-medium text-slate-700 mb-2">
                            Referencia del Proyecto (Opcional)
                        </label>
                        <input
                            id="projectReference"
                            type="text"
                            value={projectReference}
                            onChange={(e) => setProjectReference(e.target.value)}
                            placeholder="Ej: Obra Baño Principal"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                    </div>
                </div>
                {disabled && (
                    <p className="text-sm text-amber-700 bg-amber-100 p-3 rounded-md mt-4">
                        Debes añadir al menos un artículo al presupuesto antes de guardarlo.
                    </p>
                )}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                     <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleConfirm} disabled={disabled || !customerName.trim()} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-300 transition-colors">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- CustomQuoteModal Component Definition ---
interface CustomQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomQuoteModal: React.FC<CustomQuoteModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Colección CUSTOM</h3>
                            <p className="text-sm text-slate-500">Información sobre presupuestos personalizados.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4 text-slate-600">
                    <p>
                        El modelo <strong>CUSTOM</strong> se diseña a medida para satisfacer necesidades específicas y requiere un presupuesto detallado.
                    </p>
                    <p>
                        Para solicitar un presupuesto para esta colección, por favor, envía los detalles de tu proyecto a:
                    </p>
                    <div className="text-center my-4">
                         <a href="mailto:sandra.martinez@aqgbathrooms.com" className="font-semibold text-teal-600 bg-teal-100 px-4 py-2 rounded-md hover:bg-teal-200 transition-colors">
                            sandra.martinez@aqgbathrooms.com
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                    <button onClick={onClose} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- CustomerQuoteModal Component Definition ---
interface CustomerQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: { discounts: { [key: string]: number }, customerName: string, projectReference: string }) => void;
    quoteItems: QuoteItem[];
    calculateOriginalItemPrice: (item: QuoteState, includeVat?: boolean) => number;
}

const CustomerQuoteModal: React.FC<CustomerQuoteModalProps> = ({ isOpen, onClose, onConfirm, quoteItems, calculateOriginalItemPrice }) => {
    const [discounts, setDiscounts] = useState<{ [key: string]: number }>({});
    const [customerName, setCustomerName] = useState('');
    const [projectReference, setProjectReference] = useState('');

    const productLinesInQuote = useMemo(() => {
        const lines = new Set(quoteItems.map(item => item.productLine).filter(Boolean) as string[]);
        return Array.from(lines);
    }, [quoteItems]);

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            const initialDiscounts: { [key: string]: number } = {};
            productLinesInQuote.forEach(line => {
                initialDiscounts[line] = 0;
            });
            setDiscounts(initialDiscounts);
            setCustomerName('');
            setProjectReference('');
        }
    }, [isOpen, productLinesInQuote]);

    const { totalPVP, totalDiscount, finalBase, tax, finalTotal } = useMemo(() => {
        const totalPVP = quoteItems.reduce((sum, item) => sum + calculateOriginalItemPrice(item, false), 0);
        
        const totalDiscount = quoteItems.reduce((sum, item) => {
            if (!item.productLine) return sum;
            const discountPerc = discounts[item.productLine] || 0;
            const itemPVP = calculateOriginalItemPrice(item, false);
            return sum + (itemPVP * (discountPerc / 100));
        }, 0);

        const finalBase = totalPVP - totalDiscount;
        const tax = finalBase * 0.21;
        const finalTotal = finalBase + tax;
        
        return { totalPVP, totalDiscount, finalBase, tax, finalTotal };
    }, [quoteItems, discounts, calculateOriginalItemPrice]);

    if (!isOpen) return null;

    const handleDiscountChange = (line: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setDiscounts(prev => ({ ...prev, [line]: numValue }));
        } else if (value === '') {
            setDiscounts(prev => ({ ...prev, [line]: 0 }));
        }
    };

    const handleConfirm = () => {
        if (customerName.trim()) {
            onConfirm({ discounts, customerName, projectReference });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Presupuesto para Cliente</h3>
                            <p className="text-sm text-slate-500">Aplica descuentos por familia sobre el PVP.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column: Details & Discounts */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customerNameModal" className="block text-sm font-medium text-slate-700 mb-2">Nombre del Cliente <span className="text-red-500">*</span></label>
                            <input id="customerNameModal" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ej: Juan Pérez" className="w-full p-3 bg-white border border-slate-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="projectReferenceModal" className="block text-sm font-medium text-slate-700 mb-2">Referencia del Proyecto (Opcional)</label>
                            <input id="projectReferenceModal" type="text" value={projectReference} onChange={(e) => setProjectReference(e.target.value)} placeholder="Ej: Obra Baño Principal" className="w-full p-3 bg-white border border-slate-300 rounded-md"/>
                        </div>
                        <div className="pt-2">
                            <h4 className="text-base font-semibold text-slate-800 mb-2">Descuentos por Familia (%)</h4>
                            <div className="space-y-2">
                                {productLinesInQuote.map(line => (
                                    <div key={line} className="flex items-center justify-between">
                                        <label htmlFor={`discount-${line}`} className="font-medium text-slate-600">{line}</label>
                                        <input
                                            id={`discount-${line}`}
                                            type="number"
                                            value={discounts[line] || 0}
                                            onChange={(e) => handleDiscountChange(line, e.target.value)}
                                            min="0" max="100"
                                            className="w-24 p-2 text-right bg-white border border-slate-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Summary */}
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 space-y-3 self-start">
                        <div className="flex justify-between items-center text-slate-600 text-sm"><span>Subtotal (PVP)</span><span>{totalPVP.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                        <div className="flex justify-between items-center text-slate-600 text-sm"><span>Descuento</span><span className="text-red-600">-{totalDiscount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                        <div className="border-t border-slate-300 !my-2"></div>
                        <div className="flex justify-between items-center text-slate-800 font-semibold"><span className="text-sm">Base imponible</span><span>{finalBase.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                        <div className="flex justify-between items-center text-slate-600 text-sm"><span>IVA (21%)</span><span>{tax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                        <div className="border-t-2 border-slate-300 !my-3"></div>
                        <div className="flex justify-between items-center text-xl font-bold text-slate-800"><span>TOTAL</span><span className="text-teal-600">{finalTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Cancelar</button>
                    <button onClick={handleConfirm} disabled={!customerName.trim()} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-300 transition-colors">Generar PDF</button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [appView, setAppView] = useState<'quoter' | 'myQuotes' | 'promotions'>('myQuotes');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [isSaveQuoteOpen, setIsSaveQuoteOpen] = useState(false);
    const [isCustomQuoteModalOpen, setIsCustomQuoteModalOpen] = useState(false);
    const [isCustomerQuoteModalOpen, setIsCustomerQuoteModalOpen] = useState(false);
    const [quoteForPdf, setQuoteForPdf] = useState<SavedQuote | null>(null);
    
    useEffect(() => {
        // 1. Initialize users in localStorage if not present
        try {
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify(authorizedUsers));
            }
        } catch (error) {
            console.error("Failed to initialize user database:", error);
        }

        // 2. Check for an active session
        const checkSession = () => {
            try {
                const sessionUserJson = sessionStorage.getItem('currentUser');
                if (sessionUserJson) {
                    setCurrentUser(JSON.parse(sessionUserJson));
                    setAppView('myQuotes');
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Failed to parse user from storage", error);
                sessionStorage.removeItem('currentUser');
                setCurrentUser(null);
            }
        };

        checkSession();
    }, []);
    
    const isSpecialUser = useMemo(() => currentUser?.email === 'admin@aqg.com', [currentUser]);

    const handleAuthentication = async (email: string, password: string) => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
        const userRecord = storedUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (userRecord) {
            const { password, ...userToLogin } = userRecord;
            sessionStorage.setItem('currentUser', JSON.stringify(userToLogin));
            setCurrentUser(userToLogin);
            setAppView('myQuotes');
        } else {
            throw new Error('Email o contraseña incorrectos.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
        handleReset();
    };

    const initialQuoteState: QuoteState = {
        productLine: null,
        width: STANDARD_WIDTHS[1],
        length: STANDARD_LENGTHS[4],
        quantity: 1,
        model: null,
        color: null,
        extras: [],
        ralCode: '',
        bitonoColor: null,
        bitonoRalCode: '',
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [currentItemConfig, setCurrentItemConfig] = useState<QuoteState>(initialQuoteState);
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const isNextDisabled = useMemo(() => {
        if (currentStep === 1 && (!currentItemConfig.productLine || currentItemConfig.productLine === 'CUSTOM' || currentItemConfig.quantity < 1)) return true;
        if (currentStep === 3 && !currentItemConfig.model) return true;
        if (currentStep === 4) {
             const hasRalExtra = currentItemConfig.extras.some(e => e.id === 'ral');
             if (!currentItemConfig.color && !hasRalExtra) {
                 return true;
             }
             if (hasRalExtra && (!currentItemConfig.ralCode || currentItemConfig.ralCode.trim() === '')) {
                 return true;
             }
        }
        if (currentStep === 5) {
            const hasBitono = currentItemConfig.extras.some(e => e.id === 'bitono');
            if (hasBitono && !currentItemConfig.bitonoColor) {
                return true;
            }
        }
        return false;
    }, [currentStep, currentItemConfig]);
    
    const handleSaveAndFinishItem = useCallback(() => {
        setQuoteItems(prevItems => {
            const existingIndex = prevItems.findIndex(item => item.id === editingItemId);
            const newItem: QuoteItem = { ...currentItemConfig, id: editingItemId || `item_${Date.now()}`};

            if (existingIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingIndex] = newItem;
                return updatedItems;
            } else {
                return [...prevItems, newItem];
            }
        });
        setCurrentItemConfig(initialQuoteState);
        setEditingItemId(null);
        setCurrentStep(6);

    }, [currentItemConfig, editingItemId, initialQuoteState]);


    const handleNext = useCallback(() => {
        if (currentStep === STEPS.length - 1) {
            handleSaveAndFinishItem();
            return;
        }
        
        setCurrentStep(currentStep + 1);
    }, [currentStep, handleSaveAndFinishItem]);

    const handlePrev = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);
    
    const handleReset = useCallback((initialItems: QuoteItem[] | null = null) => {
        setQuoteItems(initialItems || []);
        setCurrentItemConfig(initialQuoteState);
        setEditingItemId(null);
        setCurrentStep(initialItems ? 6 : 1);
        setAppView('quoter');
    }, [initialQuoteState]);

    const calculateItemPrice = useCallback((item: QuoteState, allItems: (QuoteItem | QuoteState)[], includeVat: boolean = true) => {
        const { productLine, width, length, model, color, extras, quantity } = item;
        if (!model || !productLine) return 0;

        let discountPercentage = 0;
        if (isSpecialUser) {
            if (productLine === 'CLASSIC') {
                const totalClassicQuantity = allItems
                    .filter(i => i.productLine === 'CLASSIC')
                    .reduce((sum, current) => sum + (current.quantity || 1), 0);
                
                if (totalClassicQuantity >= 10) {
                    discountPercentage = 71;
                }
            } else {
                discountPercentage = 55;
            }
        }

        const basePrice = PRICE_LIST[productLine]?.[width]?.[length] || 0;
        const modelPrice = basePrice * (model.priceFactor || 1);
        const colorPrice = color?.price || 0;
        const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0);
        
        const totalBasePrice = (modelPrice + colorPrice + extrasPrice) * (quantity || 1);
        const discountedTotalBasePrice = totalBasePrice * (1 - discountPercentage / 100);

        return includeVat ? discountedTotalBasePrice * 1.21 : discountedTotalBasePrice;
    }, [isSpecialUser]);
    
    const calculateOriginalItemPrice = useCallback((item: QuoteState, includeVat: boolean = true) => {
        const { productLine, width, length, model, color, extras, quantity } = item;
        if (!model || !productLine) return 0;
    
        const basePrice = PRICE_LIST[productLine]?.[width]?.[length] || 0;
        const modelPrice = basePrice * (model.priceFactor || 1);
        const colorPrice = color?.price || 0;
        const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0);
        
        const totalBasePrice = (modelPrice + colorPrice + extrasPrice) * (quantity || 1);

        return includeVat ? totalBasePrice * 1.21 : totalBasePrice;
    }, []);
    
    const currentItemPrice = useMemo(() => {
        const potentialQuoteItems = [
            ...quoteItems.filter(i => i.id !== editingItemId), 
            currentItemConfig
        ];
        return calculateItemPrice(currentItemConfig, potentialQuoteItems);
    }, [currentItemConfig, calculateItemPrice, quoteItems, editingItemId]);

    const totalQuotePrice = useMemo(() => {
        return quoteItems.reduce((total, item) => total + calculateItemPrice(item, quoteItems), 0);
    }, [quoteItems, calculateItemPrice]);

    const handleSaveQuoteRequest = () => {
        setIsSaveQuoteOpen(true);
    };
    
    const handleStartNewItem = () => {
        setCurrentItemConfig(initialQuoteState);
        setEditingItemId(null);
        setCurrentStep(1);
    };

    const handleEditItem = (itemId: string) => {
        const itemToEdit = quoteItems.find(item => item.id === itemId);
        if (itemToEdit) {
            setCurrentItemConfig(itemToEdit);
            setEditingItemId(itemId);
            setCurrentStep(1);
        }
    };

    const handleDeleteItem = (itemId: string) => {
        setQuoteItems(prev => prev.filter(item => item.id !== itemId));
    };


    const handleConfirmSaveQuote = useCallback((details: { customerName: string; projectReference: string }) => {
        if (!currentUser || quoteItems.length === 0) return;

        const newQuote: SavedQuote = {
            id: `quote_${Date.now()}`,
            timestamp: Date.now(),
            userEmail: currentUser.email,
            quoteItems: quoteItems,
            totalPrice: totalQuotePrice,
            customerName: details.customerName,
            projectReference: details.projectReference
        };

        const allQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
        allQuotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(allQuotes));
        
        setAppView('myQuotes');
    }, [currentUser, quoteItems, totalQuotePrice]);
    
    const generatePdfWithDiscount = useCallback(async (savedQuote: SavedQuote, discountPercentage: number = 0) => {
        if (!window.jspdf || !currentUser) {
            throw new Error("PDF generation library not loaded or no user logged in.");
        }
    
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const { quoteItems } = savedQuote;
        
        const PRIMARY_COLOR = '#0d9488'; // teal-600
        const TEXT_COLOR = '#1f2937'; // gray-800
        const SECONDARY_TEXT_COLOR = '#6b7280'; // gray-500
        const BORDER_COLOR = '#e5e7eb'; // gray-200
        const PAGE_MARGIN = 15;
        const CONTENT_WIDTH = 210 - (PAGE_MARGIN * 2);
    
        let yPos = 0;
    
        const checkPageBreak = (spaceNeeded: number) => {
            if (yPos + spaceNeeded > 297 - PAGE_MARGIN - 15) {
                doc.addPage();
                yPos = PAGE_MARGIN;
            }
        };
    
        yPos = 30;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(TEXT_COLOR);
        doc.setFontSize(10);
        doc.text((currentUser.commercialName || currentUser.companyName).toUpperCase(), PAGE_MARGIN, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(SECONDARY_TEXT_COLOR);
        yPos += 5;
        doc.text(currentUser.email, PAGE_MARGIN, yPos);
        if (currentUser.preparedBy) {
            yPos += 5;
            doc.text(`Att: ${currentUser.preparedBy}`, PAGE_MARGIN, yPos);
        }

        const titleX = 210 - PAGE_MARGIN;
        yPos = 30;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text("PRESUPUESTO", titleX, yPos, { align: 'right' });

        yPos += 10;
        doc.setFontSize(10);
        const addHeaderDetail = (label: string, value: string) => {
             const labelX = 150;
             const valueX = 153;
             const valueWidth = titleX - valueX;

             const valueLines = doc.splitTextToSize(value, valueWidth);

             doc.setFont('helvetica', 'bold');
             doc.setTextColor(TEXT_COLOR);
             doc.text(label, labelX, yPos, { align: 'right', baseline: 'top' });
             
             doc.setFont('helvetica', 'normal');
             doc.setTextColor(SECONDARY_TEXT_COLOR);
             doc.text(valueLines, valueX, yPos, { align: 'left', baseline: 'top' });
             
             yPos += (valueLines.length * 5) + 2;
        };

        addHeaderDetail('Nº Presupuesto:', savedQuote.id.replace('quote_', ''));
        addHeaderDetail('Fecha:', new Date(savedQuote.timestamp).toLocaleDateString('es-ES'));
        yPos += 4;
        addHeaderDetail('Cliente:', savedQuote.customerName || 'Cliente sin especificar');
        if (savedQuote.projectReference) {
            addHeaderDetail('Ref. Proyecto:', savedQuote.projectReference);
        }

        yPos = Math.max(yPos, 80) + 15;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#FFFFFF');
        doc.setFillColor(PRIMARY_COLOR);
        doc.rect(PAGE_MARGIN, yPos, CONTENT_WIDTH, 10, 'F');
        yPos += 7;
        doc.text("DESCRIPCIÓN", PAGE_MARGIN + 5, yPos);
        doc.text("CANT.", 140, yPos, { align: 'center' });
        doc.text("P. UNITARIO", 168, yPos, { align: 'right' });
        doc.text("TOTAL", 210 - PAGE_MARGIN - 5, yPos, { align: 'right' });
        yPos += 3;

        for (const [index, item] of quoteItems.entries()) {
            const startY = yPos;
            const isEven = index % 2 === 0;

            const originalItemBasePrice = calculateOriginalItemPrice(item, false);
            const discountedItemBasePrice = calculateItemPrice(item, quoteItems, false);
            const discountOnItem = originalItemBasePrice - discountedItemBasePrice;
            const itemDiscountPercentage = discountOnItem > 0 ? (discountOnItem / originalItemBasePrice) * 100 : 0;

            const mainDesc = `Plato de ducha ${item.productLine} - ${item.model?.name}`;
            const subDescLines: string[] = [
                `  · Dimensiones: ${item.width}cm x ${item.length}cm`,
                `  · Color: ${item.color?.name || `RAL ${item.ralCode}`}`,
            ];
             if (item.extras.length > 0) {
                const extraNames = item.extras.map(extra => {
                     let extraText = extra.name;
                     if (extra.id === 'bitono') {
                         if (item.bitonoColor) extraText += ` (Tapa: ${item.bitonoColor.name})`;
                     }
                     return extraText;
                }).join(', ');
                subDescLines.push(`  · Extras: ${extraNames}`);
            }

            if (isSpecialUser && discountOnItem > 0) {
                const discountText = `  · Descuento (${itemDiscountPercentage.toFixed(0)}%): -${discountOnItem.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`;
                subDescLines.push(discountText);
            }
            
            let rowHeight = 8;
            doc.setFontSize(10);
            const mainDescSplit = doc.splitTextToSize(mainDesc, 115);
            rowHeight += mainDescSplit.length * 6;
            doc.setFontSize(9);
            subDescLines.forEach(line => {
                const subDescSplit = doc.splitTextToSize(line, 110);
                rowHeight += subDescSplit.length * 5;
            });
            rowHeight += 4;
            
            checkPageBreak(rowHeight);

            if (isEven) {
                doc.setFillColor(249, 250, 251);
                doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, rowHeight, 'F');
            }
            doc.setDrawColor(BORDER_COLOR);
            doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, rowHeight);
            
            let currentY = startY + 6;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(TEXT_COLOR);
            doc.text(mainDescSplit, PAGE_MARGIN + 5, currentY);
            currentY += mainDescSplit.length * 6;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(SECONDARY_TEXT_COLOR);
            subDescLines.forEach(line => {
                const isDiscountLine = isSpecialUser && line.includes('Descuento');
                if (isDiscountLine) {
                    doc.saveGraphicsState();
                    doc.setFont('helvetica', 'italic');
                    doc.setTextColor('#0f766e'); // teal-700
                }
                const subDescSplit = doc.splitTextToSize(line, 110);
                doc.text(subDescSplit, PAGE_MARGIN + 5, currentY);
                currentY += subDescSplit.length * 5;
                 if (isDiscountLine) {
                    doc.restoreGraphicsState();
                }
            });

            const verticalCenter = startY + rowHeight / 2 + 1.5;
            const unitPrice = discountedItemBasePrice / (item.quantity || 1);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(TEXT_COLOR);
            doc.text((item.quantity || 1).toString(), 140, verticalCenter, { align: 'center' });
            doc.text(unitPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 168, verticalCenter, { align: 'right' });
            doc.text(discountedItemBasePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 210 - PAGE_MARGIN - 5, verticalCenter, { align: 'right' });

            yPos = startY + rowHeight;
        }

        yPos += 10;
        checkPageBreak(60);

        const VAT_RATE = 0.21;
        let basePriceToShow: number;
        let discountAmount = 0;
        let discountedBasePrice: number;
        
        if (isSpecialUser) {
            basePriceToShow = savedQuote.quoteItems.reduce((sum, item) => sum + calculateOriginalItemPrice(item, false), 0);
            discountedBasePrice = savedQuote.quoteItems.reduce((sum, item) => sum + calculateItemPrice(item, savedQuote.quoteItems, false), 0);
            discountAmount = basePriceToShow - discountedBasePrice;
        } else {
            basePriceToShow = savedQuote.totalPrice / (1 + VAT_RATE);
            if (discountPercentage > 0) {
                discountAmount = basePriceToShow * (discountPercentage / 100);
            }
            discountedBasePrice = basePriceToShow - discountAmount;
        }

        const taxAmount = discountedBasePrice * VAT_RATE;
        const finalPrice = discountedBasePrice + taxAmount;
        
        const totalsX = 130;
        
        const addPriceLine = (label: string, amount: number, bold: boolean = false, isTotal: boolean = false) => {
             checkPageBreak(12);
             if (isTotal) {
                doc.setFillColor(243, 244, 246);
                doc.rect(totalsX - 5, yPos - 7, 210 - PAGE_MARGIN - totalsX + 10, 12, 'F');
                doc.setFontSize(14);
                doc.setTextColor(PRIMARY_COLOR);
             } else {
                 doc.setFontSize(10);
                 doc.setTextColor(SECONDARY_TEXT_COLOR);
             }
             doc.setFont('helvetica', bold ? 'bold' : 'normal');
             doc.text(label, totalsX, yPos);
             doc.text(amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 210 - PAGE_MARGIN, yPos, { align: 'right' });
             yPos += isTotal ? 12 : 8;
        };

        addPriceLine("Subtotal", basePriceToShow);
        if (discountAmount > 0) {
            const discountLabel = isSpecialUser ? 'Descuento (aplicado)' : `Descuento (${discountPercentage}%)`;
            addPriceLine(discountLabel, -discountAmount);
            yPos += 2;
            doc.setDrawColor(BORDER_COLOR);
            doc.line(totalsX, yPos - 4, 210 - PAGE_MARGIN, yPos - 4);
            addPriceLine("Base con dto.", discountedBasePrice, true);
        }
        addPriceLine(`IVA (${(VAT_RATE * 100).toFixed(0)}%)`, taxAmount);
        yPos += 2;
        addPriceLine("TOTAL", finalPrice, true, true);

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(SECONDARY_TEXT_COLOR);
            const footerY = 297 - 10;
            doc.setDrawColor(BORDER_COLOR);
            doc.line(PAGE_MARGIN, footerY - 5, 210 - PAGE_MARGIN, footerY - 5);
            doc.text('Presupuesto generado con la aplicación de AQG Bathrooms. Precios sin IVA.', PAGE_MARGIN, footerY);
            doc.text(`Página ${i} de ${totalPages}`, 210 - PAGE_MARGIN, footerY, { align: 'right' });
        }
        
        doc.output('dataurlnewwindow');
    }, [currentUser, calculateItemPrice, isSpecialUser, calculateOriginalItemPrice]);
    
    const handleGeneratePdfForQuote = useCallback(async (quote: SavedQuote) => {
        try {
            // For special user, discount is baked in, so pass 0 to the PDF generator.
            await generatePdfWithDiscount(quote, 0);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error desconocido.";
            alert(`No se pudo generar el PDF: ${errorMessage}`);
        }
    }, [generatePdfWithDiscount]);

    const handleOpenDiscountModal = (quoteToProcess: SavedQuote) => {
        if (isSpecialUser) {
            handleGeneratePdfForQuote(quoteToProcess);
            return;
        }
        setQuoteForPdf(quoteToProcess);
        setIsDiscountOpen(true);
    };

    const handleConfirmDiscount = async (discount: number) => {
        if (quoteForPdf) {
            try {
                await generatePdfWithDiscount(quoteForPdf, discount);
            } catch (error) {
                console.error("Failed to generate PDF:", error);
                const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error desconocido.";
                alert(`No se pudo generar el PDF: ${errorMessage}`);
            }
        }
        setIsDiscountOpen(false);
        setQuoteForPdf(null);
    };

    const handleUpdateUserSettings = useCallback((settings: { commercialName: string; preparedBy: string; }) => {
        if (!currentUser) return;
        
        const updatedUser = { 
            ...currentUser,
            commercialName: settings.commercialName,
            preparedBy: settings.preparedBy || undefined
        };
        setCurrentUser(updatedUser);

        if (sessionStorage.getItem('currentUser')) {
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

    }, [currentUser]);

    const handleGenerateCustomerPdf = useCallback(async (details: { discounts: { [key: string]: number }, customerName: string, projectReference: string }) => {
        if (!window.jspdf || !currentUser || quoteItems.length === 0) return;
    
        const { discounts, customerName, projectReference } = details;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        const PRIMARY_COLOR = '#0d9488';
        const TEXT_COLOR = '#1f2937';
        const SECONDARY_TEXT_COLOR = '#6b7280';
        const BORDER_COLOR = '#e5e7eb';
        const PAGE_MARGIN = 15;
        const CONTENT_WIDTH = 210 - (PAGE_MARGIN * 2);
    
        let yPos = 30;
    
        const checkPageBreak = (spaceNeeded: number) => {
            if (yPos + spaceNeeded > 297 - PAGE_MARGIN - 15) {
                doc.addPage();
                yPos = PAGE_MARGIN;
            }
        };
    
        // --- PDF Header ---
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(TEXT_COLOR);
        doc.setFontSize(10);
        doc.text((currentUser.commercialName || currentUser.companyName).toUpperCase(), PAGE_MARGIN, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(SECONDARY_TEXT_COLOR);
        yPos += 5;
        doc.text(currentUser.email, PAGE_MARGIN, yPos);
        if (currentUser.preparedBy) {
            yPos += 5;
            doc.text(`Att: ${currentUser.preparedBy}`, PAGE_MARGIN, yPos);
        }
    
        const titleX = 210 - PAGE_MARGIN;
        yPos = 30;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text("PRESUPUESTO", titleX, yPos, { align: 'right' });
    
        yPos += 10;
        doc.setFontSize(10);
        const addHeaderDetail = (label: string, value: string) => {
            const labelX = 150, valueX = 153, valueWidth = titleX - valueX;
            const valueLines = doc.splitTextToSize(value, valueWidth);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(TEXT_COLOR);
            doc.text(label, labelX, yPos, { align: 'right', baseline: 'top' });
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(SECONDARY_TEXT_COLOR);
            doc.text(valueLines, valueX, yPos, { align: 'left', baseline: 'top' });
            yPos += (valueLines.length * 5) + 2;
        };
    
        addHeaderDetail('Nº Presupuesto:', `C-${Date.now().toString().slice(-6)}`);
        addHeaderDetail('Fecha:', new Date().toLocaleDateString('es-ES'));
        yPos += 4;
        addHeaderDetail('Cliente:', customerName);
        if (projectReference) {
            addHeaderDetail('Ref. Proyecto:', projectReference);
        }
    
        // --- Table Header ---
        yPos = Math.max(yPos, 80) + 15;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#FFFFFF');
        doc.setFillColor(PRIMARY_COLOR);
        doc.rect(PAGE_MARGIN, yPos, CONTENT_WIDTH, 10, 'F');
        yPos += 7;
        doc.text("DESCRIPCIÓN", PAGE_MARGIN + 5, yPos);
        doc.text("CANT.", 140, yPos, { align: 'center' });
        doc.text("P. UNITARIO", 168, yPos, { align: 'right' });
        doc.text("TOTAL", 210 - PAGE_MARGIN - 5, yPos, { align: 'right' });
        yPos += 3;
    
        // --- Table Rows ---
        for (const [index, item] of quoteItems.entries()) {
            const startY = yPos;
            const isEven = index % 2 === 0;
            const discountPerc = item.productLine ? (discounts[item.productLine] || 0) : 0;
            const itemOriginalBasePrice = calculateOriginalItemPrice(item, false);
            const itemDiscountedBasePrice = itemOriginalBasePrice * (1 - discountPerc / 100);
    
            // ... (Row drawing logic, similar to the other PDF function but with new prices)
            const mainDesc = `Plato de ducha ${item.productLine} - ${item.model?.name}`;
            const subDescLines = [
                `  · Dimensiones: ${item.width}cm x ${item.length}cm`,
                `  · Color: ${item.color?.name || `RAL ${item.ralCode}`}`,
            ];
            if (item.extras.length > 0) {
                 subDescLines.push(`  · Extras: ${item.extras.map(e => e.name).join(', ')}`);
            }
            
            let rowHeight = 8;
            doc.setFontSize(10);
            const mainDescSplit = doc.splitTextToSize(mainDesc, 115);
            rowHeight += mainDescSplit.length * 6;
            doc.setFontSize(9);
            subDescLines.forEach(line => {
                rowHeight += doc.splitTextToSize(line, 110).length * 5;
            });
            rowHeight += 4;
            
            checkPageBreak(rowHeight);

            if (isEven) doc.setFillColor(249, 250, 251);
            doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, rowHeight, 'F');
            doc.setDrawColor(BORDER_COLOR);
            doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, rowHeight);

            let currentY = startY + 6;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(TEXT_COLOR);
            doc.text(mainDescSplit, PAGE_MARGIN + 5, currentY);
            currentY += mainDescSplit.length * 6;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(SECONDARY_TEXT_COLOR);
            subDescLines.forEach(line => {
                doc.text(doc.splitTextToSize(line, 110), PAGE_MARGIN + 5, currentY);
                currentY += doc.splitTextToSize(line, 110).length * 5;
            });

            const verticalCenter = startY + rowHeight / 2 + 1.5;
            const unitPrice = itemDiscountedBasePrice / (item.quantity || 1);
            doc.setFontSize(10);
            doc.setTextColor(TEXT_COLOR);
            doc.text((item.quantity || 1).toString(), 140, verticalCenter, { align: 'center' });
            doc.text(unitPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 168, verticalCenter, { align: 'right' });
            doc.text(itemDiscountedBasePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 210 - PAGE_MARGIN - 5, verticalCenter, { align: 'right' });

            yPos = startY + rowHeight;
        }
    
        // --- Totals Section ---
        yPos += 10;
        checkPageBreak(60);
    
        const totalPVP = quoteItems.reduce((sum, item) => sum + calculateOriginalItemPrice(item, false), 0);
        const totalDiscount = quoteItems.reduce((sum, item) => {
            if (!item.productLine) return sum;
            const discountPerc = discounts[item.productLine] || 0;
            return sum + (calculateOriginalItemPrice(item, false) * (discountPerc / 100));
        }, 0);
        const finalBase = totalPVP - totalDiscount;
        const taxAmount = finalBase * 0.21;
        const finalPrice = finalBase + taxAmount;
    
        const totalsX = 130;
        const addPriceLine = (label: string, amount: number, bold = false, isTotal = false) => {
            checkPageBreak(12);
            if (isTotal) {
                doc.setFillColor(243, 244, 246);
                doc.rect(totalsX - 5, yPos - 7, 210 - PAGE_MARGIN - totalsX + 10, 12, 'F');
                doc.setFontSize(14);
                doc.setTextColor(PRIMARY_COLOR);
            } else {
                doc.setFontSize(10);
                doc.setTextColor(SECONDARY_TEXT_COLOR);
            }
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.text(label, totalsX, yPos);
            doc.text(amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 210 - PAGE_MARGIN, yPos, { align: 'right' });
            yPos += isTotal ? 12 : 8;
        };
    
        addPriceLine("Subtotal (PVP)", totalPVP);
        if (totalDiscount > 0) {
            addPriceLine("Descuento Aplicado", -totalDiscount);
            yPos += 2;
            doc.setDrawColor(BORDER_COLOR);
            doc.line(totalsX, yPos - 4, 210 - PAGE_MARGIN, yPos - 4);
            addPriceLine("Base Imponible", finalBase, true);
        }
        addPriceLine("IVA (21%)", taxAmount);
        yPos += 2;
        addPriceLine("TOTAL", finalPrice, true, true);
    
        // --- Footer ---
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(SECONDARY_TEXT_COLOR);
            const footerY = 297 - 10;
            doc.setDrawColor(BORDER_COLOR);
            doc.line(PAGE_MARGIN, footerY - 5, 210 - PAGE_MARGIN, footerY - 5);
            doc.text('Presupuesto generado con la aplicación de AQG Bathrooms. Precios sin IVA.', PAGE_MARGIN, footerY);
            doc.text(`Página ${i} de ${totalPages}`, 210 - PAGE_MARGIN, footerY, { align: 'right' });
        }
    
        doc.output('dataurlnewwindow');
    }, [currentUser, quoteItems, calculateOriginalItemPrice]);

    const updateProductLine = (productLine: string) => {
        if (productLine === 'CUSTOM') {
            setCurrentItemConfig(prev => ({ ...prev, productLine }));
            setIsCustomQuoteModalOpen(true);
            return;
        }
    
        const isSoftum = productLine === 'SOFTUM';
        const isLuxe = productLine === 'LUXE';
        const isClassic = productLine === 'CLASSIC';

        const sandModel = SHOWER_MODELS.find(m => m.id === 'sand');
        const pizarraModel = SHOWER_MODELS.find(m => m.id === 'pizarra');
        const rejillaExtra = SHOWER_EXTRAS.find(e => e.id === 'rejilla');
        const rejillaInoxClassic = CLASSIC_GRILLES.find(e => e.id === 'rejilla-inox-classic');

        setCurrentItemConfig(prev => {
            let defaultExtras: ProductOption[] = [];
            if (isLuxe && rejillaExtra) {
                defaultExtras = [{ ...rejillaExtra, price: 0 }];
            } else if (isClassic && rejillaInoxClassic) {
                defaultExtras = [rejillaInoxClassic];
            }

            return {
                ...initialQuoteState,
                productLine,
                model: isSoftum ? sandModel || null : (isLuxe || isClassic ? pizarraModel || null : null),
                width: isSoftum ? SOFTUM_WIDTHS[0] : STANDARD_WIDTHS[1],
                length: isSoftum ? SOFTUM_LENGTHS[0] : STANDARD_LENGTHS[4],
                quantity: prev.quantity,
                extras: defaultExtras,
            };
        });
    };
    
    const handleCloseCustomQuoteModal = () => {
        setIsCustomQuoteModalOpen(false);
        setCurrentItemConfig(prev => ({ ...prev, productLine: null }));
    };
    
    const updateQuantity = (quantity: number) => {
        const q = Math.max(1, quantity);
        setCurrentItemConfig(prev => ({ ...prev, quantity: isNaN(q) ? 1 : q }));
    };


    const updateDimensions = (width: number, length: number) => {
        setCurrentItemConfig(prev => ({ ...prev, width, length }));
    };

    const selectModel = (model: ProductOption) => {
        setCurrentItemConfig(prev => ({ ...prev, model }));
        handleNext();
    };

    const selectColor = (color: ColorOption) => {
        setCurrentItemConfig(prev => {
            const newExtras = prev.extras.filter(e => e.id !== 'ral');
            const ralWasRemoved = newExtras.length < prev.extras.length;

            return { 
                ...prev, 
                color,
                extras: newExtras,
                ralCode: ralWasRemoved ? '' : prev.ralCode
            };
        });
        handleNext();
    };
    
    const handleToggleRal = () => {
        const ralExtra = SHOWER_EXTRAS.find(e => e.id === 'ral');
        if (ralExtra) {
            toggleExtra(ralExtra);
        }
    };
    
    const toggleExtra = (extra: ProductOption) => {
        setCurrentItemConfig(prev => {
            const isSelected = prev.extras.some(e => e.id === extra.id);
            let newExtras;
            let newRalCode = prev.ralCode;
            let newColor = prev.color;
            let newBitonoColor = prev.bitonoColor;
            let newBitonoRalCode = prev.bitonoRalCode;

            if (isSelected) {
                newExtras = prev.extras.filter(e => e.id !== extra.id);
                if (extra.id === 'ral') newRalCode = '';
                if (extra.id === 'bitono') {
                    newBitonoColor = null;
                    newBitonoRalCode = '';
                }
            } else {
                let currentExtras = [...prev.extras];
                
                if (prev.productLine === 'LUXE') {
                    if (extra.id === 'tapeta-luxe') {
                        currentExtras = currentExtras.filter(e => e.id !== 'rejilla');
                    } else if (extra.id === 'rejilla') {
                        currentExtras = currentExtras.filter(e => e.id !== 'tapeta-luxe');
                    }
                }

                if (prev.productLine === 'CLASSIC') {
                    const classicGrilleIds = CLASSIC_GRILLES.map(g => g.id);
                    if (classicGrilleIds.includes(extra.id)) {
                        // Remove any other classic grille that might be selected
                        currentExtras = currentExtras.filter(e => !classicGrilleIds.includes(e.id));
                    }
                }

                newExtras = [...currentExtras, extra];
                
                if (extra.id === 'ral') {
                    newColor = null; 
                }
            }
            return { ...prev, extras: newExtras, ralCode: newRalCode, color: newColor, bitonoColor: newBitonoColor, bitonoRalCode: newBitonoRalCode };
        });
    };

    const updateRalCode = (code: string) => {
        setCurrentItemConfig(prev => ({ ...prev, ralCode: code }));
    };

    const selectBitonoColor = (color: ColorOption) => {
        setCurrentItemConfig(prev => ({
            ...prev,
            bitonoColor: color,
            bitonoRalCode: '',
        }));
    };

    const renderQuoter = () => {
        switch (currentStep) {
            case 1:
                return <Step1ModelSelection 
                    onUpdate={updateProductLine} 
                    selectedProductLine={currentItemConfig.productLine} 
                    quantity={currentItemConfig.quantity}
                    onUpdateQuantity={updateQuantity}
                />;
            case 2:
                return <Step1Dimensions quote={currentItemConfig} onUpdate={updateDimensions} />;
            case 3:
                return <Step2Model onSelect={selectModel} selectedModel={currentItemConfig.model} productLine={currentItemConfig.productLine} />;
            case 4:
                return <Step3Color 
                    onSelectColor={selectColor} 
                    selectedColor={currentItemConfig.color} 
                    productLine={currentItemConfig.productLine}
                    onToggleRal={handleToggleRal}
                    isRalSelected={currentItemConfig.extras.some(e => e.id === 'ral')}
                    ralCode={currentItemConfig.ralCode || ''}
                    onRalCodeChange={updateRalCode}
                 />;
            case 5:
                return <Step4Extras 
                    onToggle={toggleExtra} 
                    selectedExtras={currentItemConfig.extras} 
                    productLine={currentItemConfig.productLine}
                    mainColor={currentItemConfig.color}
                    bitonoColor={currentItemConfig.bitonoColor}
                    onSelectBitonoColor={selectBitonoColor}
                />;
            case 6:
                return <Step5Summary 
                    items={quoteItems}
                    totalPrice={totalQuotePrice} 
                    onReset={() => handleReset()} 
                    onSaveRequest={handleSaveQuoteRequest}
                    onGeneratePdfRequest={() => {
                        if(!currentUser) return;
                        const temporaryQuote: SavedQuote = {
                            id: `temp_${Date.now()}`,
                            timestamp: Date.now(),
                            userEmail: currentUser.email,
                            quoteItems: quoteItems,
                            totalPrice: totalQuotePrice,
                            customerName: 'Cliente (no guardado)'
                        };
                        handleOpenDiscountModal(temporaryQuote);
                    }}
                    onGenerateCustomerQuoteRequest={() => setIsCustomerQuoteModalOpen(true)}
                    onStartNew={handleStartNewItem}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    calculateItemPrice={(item) => calculateItemPrice(item, quoteItems)}
                />;
            default:
                return null;
        }
    };
    
    if (!currentUser) {
        return (
             <div className="bg-slate-100 min-h-screen font-sans flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl opacity-80"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl opacity-80"></div>
                <div className="relative z-10">
                    <AuthPage onLogin={handleAuthentication} />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans flex items-center justify-center p-4">
            <main className="w-full max-w-7xl bg-white rounded-2xl shadow-xl shadow-slate-200/80 flex flex-col md:flex-row overflow-hidden min-h-[800px] max-h-[90vh]">
                <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-900 p-8 text-white flex flex-col">
                    <div className="flex-shrink-0">
                      <div
                        aria-label="AQG Logo"
                        className="h-16 w-20 bg-contain bg-no-repeat bg-center mb-4"
                        style={{ backgroundImage: `url(${aqgLogo})` }}
                      ></div>
                      <h1 className="text-xl font-bold tracking-tight mb-1">TARIFA DIGITAL AQG</h1>
                      <p className="text-slate-400 mb-8 text-sm">PLATOS DE DUCHA</p>
                      
                      {appView === 'quoter' ? (
                        <>
                            <button 
                                onClick={() => setAppView('myQuotes')}
                                className="w-full text-left px-4 py-3 mb-8 rounded-lg font-semibold transition-colors bg-slate-800 hover:bg-slate-700 flex items-center gap-3"
                                aria-label="Volver a Mis Presupuestos"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Volver al listado</span>
                            </button>
                            <StepTracker currentStep={currentStep} steps={STEPS} />
                        </>
                      ) : (
                        <nav className="space-y-2 mt-8">
                             <button onClick={() => handleReset()} className="w-full text-left px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 font-semibold transition-colors flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                <span>Nuevo Presupuesto</span>
                            </button>
                             <button onClick={() => setAppView('myQuotes')} className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${appView === 'myQuotes' ? 'bg-slate-800' : 'hover:bg-slate-700/50 text-slate-300'}`}>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5 11a1 1 0 100 2h4a1 1 0 100-2H5z" /></svg>
                               <span>Mis Presupuestos</span>
                            </button>
                            <button onClick={() => setAppView('promotions')} className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${appView === 'promotions' ? 'bg-slate-800' : 'hover:bg-slate-700/50 text-slate-300'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5l.646.646a1 1 0 01.708 0L12 2h5a3 3 0 013 3v5a.997.997 0 01-.293.707zM11 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                <span>Promociones</span>
                            </button>
                            <button onClick={() => setIsSettingsOpen(true)} className="w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors hover:bg-slate-700/50 text-slate-300 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.972.094 2.27-.948 2.286-1.56.38-1.56 2.6 0 2.98.972.54 2.27.094 2.286-.948.836-1.372 2.942-.734-2.106 2.106-.54.972-.094 2.27.948 2.286 1.56.38 1.56 2.6 0 2.98-.972-.54-2.27-.094-2.286.948-.836 1.372-2.942.734-2.106-2.106.54-.972.094-2.27-.948-2.286-1.56-.38-1.56-2.6 0-2.98.972-.54 2.27-.094 2.286-.948.836-1.372 2.942.734 2.106-2.106-.54-.972-.094-2.27.948-2.286zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                <span>Ajustes</span>
                            </button>
                        </nav>
                      )}
                    </div>
                    <div className="mt-auto pt-8 border-t border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Cliente:</p>
                        <p className="font-bold text-white truncate" title={currentUser.companyName}>{currentUser.companyName}</p>
                        <p className="text-sm text-slate-300 truncate" title={currentUser.email}>{currentUser.email}</p>
                        <button 
                            onClick={handleLogout}
                            className="w-full mt-4 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4 p-8 md:p-12 flex flex-col bg-slate-50 overflow-y-auto">
                    <div className="flex-grow">
                         {appView === 'quoter' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
                                <div className="flex flex-col">
                                    <div className="flex-grow">
                                        {renderQuoter()}
                                    </div>
                                    {currentStep < 6 && (
                                        <NextPrevButtons 
                                            onNext={handleNext} 
                                            onPrev={handlePrev}
                                            currentStep={currentStep}
                                            totalSteps={STEPS.length}
                                            isNextDisabled={isNextDisabled}
                                        />
                                    )}
                                </div>
                
                                {currentStep > 1 && currentStep < 6 && (
                                     <div className="hidden lg:block">
                                        <div className="sticky top-10">
                                            <LivePreview item={currentItemConfig} price={currentItemPrice} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {appView === 'myQuotes' && (
                            <MyQuotesPage user={currentUser} onDuplicateQuote={(quoteItems) => handleReset(quoteItems)} onViewPdf={handleOpenDiscountModal} />
                        )}
                         {appView === 'promotions' && (
                             <PromotionsPage onNavigateToQuoter={() => handleReset()} />
                        )}
                    </div>
                </div>
            </main>
             <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleUpdateUserSettings}
                user={currentUser}
            />
            <DiscountModal
                isOpen={isDiscountOpen}
                onClose={() => setIsDiscountOpen(false)}
                onConfirm={handleConfirmDiscount}
            />
            <SaveQuoteModal
                isOpen={isSaveQuoteOpen}
                onClose={() => setIsSaveQuoteOpen(false)}
                onConfirm={handleConfirmSaveQuote}
                disabled={quoteItems.length === 0}
            />
             <CustomQuoteModal
                isOpen={isCustomQuoteModalOpen}
                onClose={handleCloseCustomQuoteModal}
            />
            <CustomerQuoteModal
                isOpen={isCustomerQuoteModalOpen}
                onClose={() => setIsCustomerQuoteModalOpen(false)}
                onConfirm={handleGenerateCustomerPdf}
                quoteItems={quoteItems}
                calculateOriginalItemPrice={calculateOriginalItemPrice}
            />
        </div>
    );
};

export default App;

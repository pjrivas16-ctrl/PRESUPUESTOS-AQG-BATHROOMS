



// Fix: Import useState, useEffect, useRef, useCallback, and useMemo from React to resolve multiple hook-related errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem } from './types';
// Fix: Added STANDARD_COLORS to the import to resolve an undefined variable error.
import { 
    PRICE_LIST, SHOWER_TRAY_STEPS, KITS_STEPS, SHOWER_MODELS, KIT_PRODUCTS, SHOWER_EXTRAS, STANDARD_COLORS, VAT_RATE, PROMO_DURATION_DAYS, PROMO_ID
} from './constants';
import { authorizedUsers } from './authorizedUsers';

import StepTracker from './components/StepTracker';
import Step1ModelSelection from './components/steps/Step1ModelSelection';
import Step1Dimensions from './components/steps/Step1Dimensions';
import Step2Model from './components/steps/Step2Model';
import Step3Color from './components/steps/Step3Color';
import Step4Extras from './components/steps/Step4Extras';
import Step5Summary from './components/steps/Step5Summary';
import Step2KitSelection from './components/steps/kits/Step2KitSelection';
import Step3KitDetails from './components/steps/kits/Step3KitDetails';
import NextPrevButtons from './components/NextPrevButtons';
import AuthPage from './components/auth/AuthPage';
import MyQuotesPage from './components/MyQuotesPage';
import PromotionsPage from './components/PromotionsPage';
import PromotionBanner from './components/PromotionBanner';
import LivePreview from './components/LivePreview';
import MaintenanceGuidesPage from './components/MaintenanceGuidesPage';

// Declare jsPDF on window for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}


// --- WelcomePage Component Definition ---
interface WelcomePageProps {
    userName: string;
    onNewQuote: () => void;
    onViewQuotes: () => void;
    onResumeQuote: () => void;
    hasActiveQuote: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ userName, onNewQuote, onViewQuotes, onResumeQuote, hasActiveQuote }) => {
    
    const handleNewQuoteClick = () => {
        if (hasActiveQuote) {
            if (window.confirm('Tienes un presupuesto en curso. ¿Quieres descartarlo y empezar uno nuevo?')) {
                onNewQuote();
            }
        } else {
            onNewQuote();
        }
    };

    return (
        <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Bienvenido, {userName}</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                Estás en la Tarifa Digital de AQG. Desde aquí puedes crear nuevos presupuestos, gestionar los existentes y acceder a nuestras guías y promociones.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {hasActiveQuote && (
                     <button
                        onClick={onResumeQuote}
                        className="px-8 py-4 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        Continuar Presupuesto
                    </button>
                )}
                <button
                    onClick={handleNewQuoteClick}
                    className="px-8 py-4 font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {hasActiveQuote ? 'Crear Presupuesto Nuevo' : 'Crear Nuevo Presupuesto'}
                </button>
                <button
                    onClick={onViewQuotes}
                    className="px-8 py-4 font-semibold text-teal-600 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors flex items-center justify-center gap-2"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    Ver Mis Presupuestos
                </button>
            </div>
        </div>
    );
};


// --- SettingsModal Component Definition ---
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: { fiscalName: string; preparedBy: string; sucursal: string; }) => void;
    user: User;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    welcomePromoIsActive: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, user, onExport, onImport, welcomePromoIsActive }) => {
    const [preparedBy, setPreparedBy] = useState(user.preparedBy || '');
    const [fiscalName, setFiscalName] = useState(user.fiscalName || user.companyName || '');
    const [sucursal, setSucursal] = useState(user.sucursal || '');
    const importInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPreparedBy(user.preparedBy || '');
            setFiscalName(user.fiscalName || user.companyName || '');
            setSucursal(user.sucursal || '');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ preparedBy, fiscalName, sucursal });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                        <label htmlFor="fiscal-name" className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre Fiscal (en PDF)
                        </label>
                        <input
                            id="fiscal-name"
                            type="text"
                            value={fiscalName}
                            onChange={(e) => setFiscalName(e.target.value)}
                            placeholder="Nombre fiscal de tu empresa"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Este es el nombre que aparecerá como remitente.</p>
                    </div>
                     <div>
                        <label htmlFor="sucursal" className="block text-sm font-medium text-slate-700 mb-2">
                            Sucursal (Opcional)
                        </label>
                        <input
                            id="sucursal"
                            type="text"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            placeholder="Ej: Tienda Centro"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Identifica la sucursal que emite el presupuesto.</p>
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

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.133 0V7.151c.22.07.408.164.567.267zM11.567 7.151v1.698a2.5 2.5 0 00-1.133 0V7.151c.22.07.408.164.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 10-2 0v1.077a4.5 4.5 0 00-.767 8.058A1 1 0 008 17.5V15a1 1 0 00-2 0v1.077a4.503 4.503 0 000-8.154V7zm4 0a1 1 0 10-2 0v1.077a4.5 4.5 0 000 8.154V17.5a1 1 0 102 0V15a1 1 0 10-2 0v-1.077a4.5 4.5 0 000-8.154V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800">Condiciones Comerciales</h4>
                             <p className="text-sm text-slate-500">Tus descuentos y promociones aplicables.</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        {user.discounts?.showerTrays ? (
                            <div className="flex justify-between p-3 bg-slate-50 rounded-md">
                                <span className="text-slate-600">Dto. Platos de Ducha:</span>
                                <span className="font-semibold text-slate-800">{user.discounts.showerTrays}%</span>
                            </div>
                        ) : null}
                        {user.discounts?.terrazzoShowerTrays ? (
                            <div className="flex justify-between p-3 bg-slate-50 rounded-md">
                                <span className="text-slate-600">Dto. Platos de Ducha de Terrazo:</span>
                                <span className="font-semibold text-slate-800">{user.discounts.terrazzoShowerTrays}%</span>
                            </div>
                        ) : null}
                        {user.discounts?.countertops ? (
                            <div className="flex justify-between p-3 bg-slate-50 rounded-md">
                                <span className="text-slate-600">Dto. Encimeras y Lavabos:</span>
                                <span className="font-semibold text-slate-800">{user.discounts.countertops}%</span>
                            </div>
                        ) : null}
                        {user.discounts?.classicSpecialCondition ? (
                            <div className="p-3 bg-slate-50 rounded-md">
                                <p className="text-slate-600 font-medium">Condición Especial (Colección CLASSIC):</p>
                                <p className="text-slate-800 mt-1">{user.discounts.classicSpecialCondition}</p>
                            </div>
                        ) : null}
                        {welcomePromoIsActive && (
                             <div className="p-3 bg-teal-50 rounded-md border border-teal-200">
                                <p className="font-semibold text-teal-800">Promoción de Bienvenida Activa</p>
                                <p className="text-teal-700 text-xs">Descuento del 50% + 25% adicional en todos los pedidos.</p>
                            </div>
                        )}
                        {!(user.discounts?.showerTrays || user.discounts?.terrazzoShowerTrays || user.discounts?.countertops || user.discounts?.classicSpecialCondition || welcomePromoIsActive) && (
                            <p className="text-slate-500 text-center p-4">No tienes condiciones comerciales especiales asignadas.</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7v1.111c0 .488.132.953.375 1.36M20 7v1.111c0 .488-.132.953-.375 1.36M12 11c-4.418 0-8-1.79-8-4" /></svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800">Gestión de Datos</h4>
                             <p className="text-sm text-slate-500">Guarda o restaura tus datos de la aplicación.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">
                            Guarda una copia de seguridad de todos tus presupuestos y ajustes, o restaura desde un archivo guardado.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button 
                                onClick={onExport} 
                                className="w-full px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                Exportar Datos
                            </button>
                            <button 
                                onClick={() => importInputRef.current?.click()} 
                                className="w-full px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                Importar Datos
                            </button>
                            <input
                                type="file"
                                ref={importInputRef}
                                hidden
                                accept=".json"
                                onChange={onImport}
                            />
                        </div>
                        <p className="text-xs text-amber-800 bg-amber-100 p-3 rounded-md mt-2">
                            <strong>Atención:</strong> Importar un archivo reemplazará todos los datos actuales de forma permanente.
                        </p>
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


// --- Price Details Interface ---
interface PriceDetails {
    basePrice: number;       // Price for quantity, before discount, before VAT
    discountedPrice: number; // Price for quantity, after discount, before VAT
    finalPrice: number;      // Price for quantity, after discount, after VAT
    discountPercent: number;
}


// --- PDF Preview Modal ---
interface PdfPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: SavedQuote | null;
    user: User;
    calculatePriceDetails: (item: QuoteItem, allItems: QuoteItem[]) => PriceDetails;
    welcomePromoIsActive: boolean;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ isOpen, onClose, quote, user, calculatePriceDetails, welcomePromoIsActive }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfDoc = useRef<any>(null); // To store the jsPDF instance

    const generatePdf = useCallback(async () => {
        if (!quote) return;
        setIsGenerating(true);

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            pdfDoc.current = doc;

            // --- Define Colors & Fonts ---
            const primaryColor = '#0d9488'; // teal-600
            const textColor = '#334155'; // slate-700
            const textColorRgb = [51, 65, 85]; // slate-700
            const lightTextColor = '#64748b'; // slate-500

            // --- Header ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(textColor);
            doc.text(user.fiscalName || user.companyName, 195, 20, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(lightTextColor);
            if (user.sucursal) doc.text(user.sucursal, 195, 25, { align: 'right' });
            if (user.preparedBy) doc.text(`Att: ${user.preparedBy}`, 195, 30, { align: 'right' });
            
            // --- Quote Info ---
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor);
            doc.text('PRESUPUESTO', 15, 50);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(textColor);
            doc.text(`Número:`, 140, 50);
            doc.text(`Fecha:`, 140, 55);
            doc.setFont('helvetica', 'bold');
            doc.text(quote.id.replace('quote_i_', '').replace('quote_c_', ''), 160, 50);
            doc.text(new Date(quote.timestamp).toLocaleDateString('es-ES'), 160, 55);

            // --- Client Info Box ---
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.roundedRect(14, 62, 90, 22, 2, 2, 'S');
            doc.setFontSize(9);
            doc.setTextColor(lightTextColor);
            doc.text('PRESUPUESTO PARA:', 20, 68);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor);
            doc.text(quote.customerName || 'Cliente sin especificar', 20, 74);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(lightTextColor);
            if (quote.projectReference) doc.text(`Referencia: ${quote.projectReference}`, 20, 79);


            // --- Table ---
            const tableRows = quote.quoteItems.map(item => {
                let description = '';
                if (item.productLine === 'KITS') {
                    description = `${item.kitProduct?.name || ''}\n`;
                    if (item.kitProduct?.id === 'kit-pintura') {
                        description += `Color: ${item.color?.name || `RAL ${item.ralCode}`}\n`;
                    }
                    if (item.invoiceReference) {
                        description += `Ref. Factura: ${item.invoiceReference}`;
                    }
                } else {
                    description = `Plato de ducha ${item.productLine} - ${item.model?.name}\n`;
                    description += `Dimensiones: ${item.width}x${item.length}cm\n`;
                    description += `Color: ${item.color?.name || `RAL ${item.ralCode}`}\n`;
                    if (item.extras.length > 0) {
                        description += `Extras: ${item.extras.map(e => e.id === 'bitono' && item.bitonoColor ? `Tapa bitono: ${item.bitonoColor.name}` : e.name).join(', ')}`;
                    }
                     if (item.productLine === 'STRUCT DETAIL' && item.structFrames) {
                        description += `\nMarcos: ${item.structFrames}`;
                    }
                }
                
                const priceDetails = calculatePriceDetails(item, quote.quoteItems);
                const unitPrice = item.quantity > 0 ? priceDetails.basePrice / item.quantity : 0;
            
                return [
                    item.quantity,
                    description.trim(),
                    unitPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
                    priceDetails.basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                ];
            });

            // @ts-ignore
            doc.autoTable({
                startY: 90,
                head: [['Cant.', 'Descripción', 'P. Unitario', 'Total']],
                body: tableRows,
                theme: 'striped',
                headStyles: {
                    fillColor: [241, 245, 249], // slate-100
                    textColor: textColorRgb,
                    fontStyle: 'bold',
                },
                styles: {
                    cellPadding: 3,
                    fontSize: 9,
                    textColor: textColorRgb,
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 30, halign: 'right' },
                    3: { cellWidth: 30, halign: 'right' },
                }
            });

            // --- Totals ---
            const finalY = (doc as any).autoTable.previous.finalY || 150;
            const priceCalculations = quote.quoteItems.map(item => calculatePriceDetails(item, quote.quoteItems));
            const subtotal = priceCalculations.reduce((sum, details) => sum + details.basePrice, 0);
            
            let currentY = finalY + 10;
            doc.setFontSize(10);

            const drawTotalLine = (label: string, value: string, isBold = false) => {
                doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                doc.text(label, 140, currentY);
                doc.text(value, 195, currentY, { align: 'right' });
                currentY += 6;
            };

            drawTotalLine('Subtotal', subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            
            let baseImponible = 0;

            if (welcomePromoIsActive) {
                const promoDiscount1 = subtotal * 0.5;
                const subtotalAfterPromo1 = subtotal - promoDiscount1;
                const promoDiscount2 = subtotalAfterPromo1 * 0.25;
                baseImponible = subtotalAfterPromo1 - promoDiscount2;
                
                drawTotalLine('Dto. Bienvenida (50%)', `- ${promoDiscount1.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);
                drawTotalLine('Dto. Adicional (25%)', `- ${promoDiscount2.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);
            } else {
                const discountedSubtotal = priceCalculations.reduce((sum, details) => sum + details.discountedPrice, 0);
                const totalDiscountAmount = subtotal - discountedSubtotal;
                baseImponible = discountedSubtotal;
                
                if (totalDiscountAmount > 0) {
                    drawTotalLine(`Descuento aplicado`, `- ${totalDiscountAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);
                }
            }
            
            drawTotalLine('Base Imponible', baseImponible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            
            const ivaAmount = baseImponible * VAT_RATE;
            const total = baseImponible + ivaAmount;

            drawTotalLine(`IVA (${VAT_RATE * 100}%)`, ivaAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            
            currentY += 2; // Add a small gap before the total line

            doc.setFontSize(12);
            drawTotalLine('TOTAL', total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), true);


            // --- Footer ---
            doc.setFontSize(8);
            doc.setTextColor(lightTextColor);
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
                doc.text('Presupuesto válido durante 30 días.', 15, 285);
            }

            setPdfUrl(doc.output('bloburl'));
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Handle error state if needed
        } finally {
            setIsGenerating(false);
        }
    }, [quote, user, calculatePriceDetails, welcomePromoIsActive]);

    useEffect(() => {
        if (isOpen) {
            generatePdf();
        } else {
            // Clean up blob URL when modal closes
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }
            pdfDoc.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // generatePdf is stable due to useCallback

    const handleDownload = () => {
        if (pdfDoc.current && quote) {
            pdfDoc.current.save(`Presupuesto_${quote.customerName || 'presupuesto'}_${quote.id.split('_').pop()}.pdf`);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800">Previsualización del Presupuesto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>
                <div className="flex-grow bg-slate-100 rounded-lg overflow-hidden">
                    {isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500">Generando PDF...</p>
                        </div>
                    ) : pdfUrl ? (
                        <iframe src={pdfUrl} className="w-full h-full border-0" title="PDF Preview"></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-red-500">Error al generar el PDF.</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                        Cerrar
                    </button>
                    <button onClick={handleDownload} disabled={isGenerating || !pdfUrl} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-300">
                        Descargar PDF
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


const PROMO_TURNOVER_LIMIT = 5000;

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<'app' | 'my_quotes' | 'promotions' | 'guides'>('app');

    const INITIAL_QUOTE_STATE: QuoteState = {
        productLine: null,
        width: 70,
        length: 100,
        quantity: 1,
        model: null,
        color: null,
        extras: [],
        structFrames: 4,
    };

    const [currentStep, setCurrentStep] = useState(0);
    const [currentItemConfig, setCurrentItemConfig] = useState<QuoteState>(INITIAL_QUOTE_STATE);
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isPdfPreviewModalOpen, setIsPdfPreviewModalOpen] = useState(false);
    const [quoteForPdf, setQuoteForPdf] = useState<SavedQuote | null>(null);
    const [isCustomQuoteModalOpen, setIsCustomQuoteModalOpen] = useState(false);
    
    // Tracks if there's a non-empty quote being built
    const isQuoteActive = useMemo(() => {
        return currentStep > 0 || quoteItems.length > 0;
    }, [currentStep, quoteItems]);

    // --- Authentication & User Data ---
    useEffect(() => {
        try {
            const storedUsersString = localStorage.getItem('users');
            const storedUsers: StoredUser[] = storedUsersString ? JSON.parse(storedUsersString) : [];

            // Use a map to handle user merging correctly. This ensures that the authorizedUsers list in the
            // code is the source of truth for passwords and base data, while preserving user-specific settings.
            const usersMap = new Map<string, StoredUser>();

            // 1. Load all current users from storage.
            for (const storedUser of storedUsers) {
                usersMap.set(storedUser.email, storedUser);
            }

            // 2. Iterate through the "source of truth" user list from the code.
            //    This will add new users and update existing ones.
            for (const authorizedUser of authorizedUsers) {
                const storedVersion = usersMap.get(authorizedUser.email);
                const updatedUser = {
                    ...authorizedUser, // Start with the base data from code (name, discounts, password).
                    // Preserve dynamic/user-editable fields from storage if they exist.
                    promotion: storedVersion?.promotion,
                    preparedBy: storedVersion?.preparedBy || authorizedUser.preparedBy,
                    fiscalName: storedVersion?.fiscalName || authorizedUser.fiscalName,
                    sucursal: storedVersion?.sucursal || authorizedUser.sucursal,
                };
                usersMap.set(authorizedUser.email, updatedUser);
            }

            const finalUsers = Array.from(usersMap.values());
            localStorage.setItem('users', JSON.stringify(finalUsers));

            const loggedInUserEmail = localStorage.getItem('currentUserEmail');
            if (loggedInUserEmail) {
                const user = finalUsers.find(u => u.email === loggedInUserEmail);
                if (user) {
                    setCurrentUser(user);
                } else {
                    // The user in storage doesn't exist in our authorized list anymore. Log them out.
                    localStorage.removeItem('currentUserEmail');
                }
            }
        } catch (error) {
            console.error('Error managing user data:', error);
            // Consider clearing storage if it's corrupted.
            // localStorage.clear();
        }
    }, []);

    const updateUser = (updatedUserData: Partial<User>) => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updatedUserData };
        setCurrentUser(updatedUser);

        try {
            const storedUsersString = localStorage.getItem('users');
            const storedUsers: StoredUser[] = storedUsersString ? JSON.parse(storedUsersString) : [];
            const updatedStoredUsers = storedUsers.map(u => u.email === updatedUser.email ? { ...u, ...updatedUserData } : u);
            localStorage.setItem('users', JSON.stringify(updatedStoredUsers));
        } catch (error) {
            console.error("Failed to update user in localStorage", error);
        }
    };
    
    const handleLogin = async (email: string, password: string): Promise<void> => {
        try {
            const storedUsersString = localStorage.getItem('users');
            const users: StoredUser[] = storedUsersString ? JSON.parse(storedUsersString) : [];
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (user && user.password === password) {
                localStorage.setItem('currentUserEmail', user.email);
                setCurrentUser(user);
                resetQuote();
                setView('app');
            } else {
                throw new Error('El correo electrónico o la contraseña no son correctos.');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Re-throw to be caught in the LoginPage component
        }
    };

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar la sesión?')) {
            setCurrentUser(null);
            localStorage.removeItem('currentUserEmail');
        }
    };
    
    // --- Promotion Logic ---
    const [welcomePromoTurnover, setWelcomePromoTurnover] = useState(0);

    const welcomePromoIsActive = useMemo(() => {
        if (!currentUser?.promotion || currentUser.promotion.id !== PROMO_ID) {
            return false;
        }
        const promoEndTime = currentUser.promotion.activationTimestamp + (PROMO_DURATION_DAYS * 24 * 60 * 60 * 1000);
        return Date.now() < promoEndTime && welcomePromoTurnover < PROMO_TURNOVER_LIMIT;
    }, [currentUser, welcomePromoTurnover]);

    useEffect(() => {
        if (currentUser?.promotion?.id === PROMO_ID) {
            try {
                const allQuotes: SavedQuote[] = JSON.parse(localStorage.getItem('quotes') || '[]');
                const promoStartTime = currentUser.promotion.activationTimestamp;
                const promoEndTime = promoStartTime + (PROMO_DURATION_DAYS * 24 * 60 * 60 * 1000);
                
                const turnover = allQuotes
                    .filter(q => 
                        q.userEmail === currentUser.email &&
                        q.orderedTimestamp &&
                        q.orderedTimestamp >= promoStartTime &&
                        q.orderedTimestamp < promoEndTime
                    )
                    .reduce((sum, q) => sum + q.totalPrice, 0);

                setWelcomePromoTurnover(turnover);
            } catch (error) {
                console.error("Failed to calculate promotion turnover:", error);
            }
        }
    }, [currentUser]);

    const handleActivatePromotion = (promoId: string) => {
        if (promoId === PROMO_ID) {
            updateUser({
                promotion: {
                    id: PROMO_ID,
                    activationTimestamp: Date.now(),
                }
            });
            alert('¡Promoción de bienvenida activada! Ahora se aplicará a tus presupuestos.');
            setView('app');
        }
    };

    // --- Pricing Logic ---
    const calculateItemPrice = useCallback((item: QuoteState, allItems: QuoteItem[] = []): number => {
        if (item.productLine === 'KITS') {
            // For KITS, the price is fixed and color selection does not add any extra cost.
            const basePrice = item.kitProduct?.price || 0;
            return basePrice * item.quantity;
        }

        const { productLine, width, length, model, color, extras, quantity, structFrames } = item;
        if (!productLine || !width || !length) return 0;

        let basePrice = PRICE_LIST[productLine]?.[width]?.[length] || 0;

        if (model?.priceFactor) {
            basePrice *= model.priceFactor;
        }
        if (color?.price) {
            basePrice += color.price;
        }

        if (productLine === 'STRUCT DETAIL' && structFrames) {
            const discountMap = { 4: 1.0, 3: 0.95, 2: 0.90, 1: 0.85 };
            basePrice *= (discountMap[structFrames] || 1.0);
        }

        const extrasPrice = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
        const singleItemPrice = basePrice + extrasPrice;

        return singleItemPrice * quantity;
    }, []);

    const calculateInternalItemPrice = useCallback((item: QuoteItem, allItems: QuoteItem[] = []): number => {
        if (!currentUser) return 0;

        const basePrice = calculateItemPrice(item, allItems);
        let discountPercent = 0;

        if (item.productLine?.startsWith('CLASSIC') && currentUser.discounts?.classicSpecial) {
             const classicItems = allItems.filter(i => i.productLine?.startsWith('CLASSIC'));
             const totalClassicQuantity = classicItems.reduce((sum, i) => sum + i.quantity, 0);

            if (totalClassicQuantity >= currentUser.discounts.classicSpecial.minQuantity) {
                 discountPercent = currentUser.discounts.classicSpecial.discount;
            } else if (currentUser.discounts?.showerTrays) {
                 discountPercent = currentUser.discounts.showerTrays;
            }
        } else if (currentUser.discounts?.showerTrays) {
            discountPercent = currentUser.discounts.showerTrays;
        }

        const discountedPrice = basePrice * (1 - discountPercent / 100);
        return discountedPrice;
    }, [calculateItemPrice, currentUser]);

    const calculatePriceDetails = useCallback((item: QuoteItem, allItems: QuoteItem[]): PriceDetails => {
        const basePrice = calculateItemPrice(item, allItems);
        
        let discountPercent = 0;
        
        if (welcomePromoIsActive) {
            // With promo, the discount is calculated on the subtotal, not per item.
            // But we can model it as a combined discount rate for display if needed.
            // Effective rate: 1 - (1 - 0.5) * (1 - 0.25) = 1 - 0.5 * 0.75 = 1 - 0.375 = 0.625 or 62.5%
            discountPercent = 62.5; 
        } else if (currentUser) {
            const internalPrice = calculateInternalItemPrice(item, allItems);
            if (basePrice > 0) {
                 discountPercent = ((basePrice - internalPrice) / basePrice) * 100;
            }
        }

        const discountedPrice = basePrice * (1 - discountPercent / 100);
        const finalPrice = discountedPrice * (1 + VAT_RATE);

        return {
            basePrice,
            discountedPrice,
            finalPrice,
            discountPercent
        };
    }, [calculateItemPrice, calculateInternalItemPrice, currentUser, welcomePromoIsActive]);


    const currentItemPrice = useMemo(() => {
        const pvp = calculateItemPrice(currentItemConfig);
        const internal = currentUser ? calculateInternalItemPrice({ ...currentItemConfig, id: '' }, []) : pvp;
        return welcomePromoIsActive ? (pvp * (1 - 0.5) * (1 - 0.25)) : internal;
    }, [currentItemConfig, calculateItemPrice, calculateInternalItemPrice, currentUser, welcomePromoIsActive]);

    const totalQuotePrice = useMemo(() => {
        let subtotal = 0;
        if (welcomePromoIsActive) {
            subtotal = quoteItems.reduce((sum, item) => sum + calculateItemPrice(item, quoteItems), 0);
            subtotal = subtotal * (1 - 0.5) * (1 - 0.25);
        } else {
            subtotal = quoteItems.reduce((sum, item) => sum + calculateInternalItemPrice(item, quoteItems), 0);
        }
        return subtotal * (1 + VAT_RATE);
    }, [quoteItems, calculateItemPrice, calculateInternalItemPrice, welcomePromoIsActive]);


    // --- Step Navigation & State Management ---
    const steps = currentItemConfig.productLine === 'KITS' ? KITS_STEPS : SHOWER_TRAY_STEPS;
    const totalSteps = steps.length;

    const resetItemConfig = (keepProductLine = false) => {
        const newState: QuoteState = { ...INITIAL_QUOTE_STATE };
        if (keepProductLine) {
            newState.productLine = currentItemConfig.productLine;
        }
        setCurrentItemConfig(newState);
        setEditingItemId(null);
    };

    const resetQuote = () => {
        resetItemConfig();
        setCurrentStep(0);
        setQuoteItems([]);
        setEditingItemId(null);
    };

    const handleDiscard = () => {
        if (window.confirm('¿Estás seguro de que quieres descartar este presupuesto y volver al inicio?')) {
            resetQuote();
        }
    };
    
    const handleStartNewQuote = (fromWelcomePage: boolean = false) => {
        // fromWelcomePage is true when the user explicitly clicks "New Quote"
        // from the Welcome page, which implies discarding any active quote.
        if (fromWelcomePage) {
            resetQuote();
        }
        setCurrentStep(1);
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            // Handle specific logic for product lines
            if (currentStep === 1 && currentItemConfig.productLine === 'CUSTOM') {
                setIsCustomQuoteModalOpen(true);
                return; // Stop navigation
            }
            
            // Automatic model selection logic for shower trays
            if (currentItemConfig.productLine !== 'KITS' && currentStep === 2) {
                const { productLine } = currentItemConfig;
                const models = SHOWER_MODELS;
                let autoSelectedModel: ProductOption | null = null;

                if (productLine === 'SOFTUM') autoSelectedModel = models.find(m => m.id === 'sand') || null;
                else if (productLine === 'LUXE' || productLine === 'CLASSIC' || productLine === 'LUXE CON TAPETA') autoSelectedModel = models.find(m => m.id === 'pizarra') || null;
                else if (productLine?.startsWith('FLAT') || productLine?.startsWith('RATIO')) autoSelectedModel = models.find(m => m.id === 'lisa') || null;
                
                if (autoSelectedModel && !currentItemConfig.model) {
                    setCurrentItemConfig(prev => ({ ...prev, model: autoSelectedModel }));
                }
            }

            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleStepClick = (stepNumber: number) => {
        if (stepNumber < currentStep) {
            setCurrentStep(stepNumber);
        }
    };

    const handleAddItemToQuote = () => {
        const newItem: QuoteItem = {
            ...currentItemConfig,
            id: editingItemId || `item_${Date.now()}`
        };

        if (editingItemId) {
            setQuoteItems(quoteItems.map(item => item.id === editingItemId ? newItem : item));
        } else {
            setQuoteItems([...quoteItems, newItem]);
        }
        
        resetItemConfig(true);
        setCurrentStep(totalSteps); // Go to summary
    };

    const handleEditItem = (itemId: string) => {
        const itemToEdit = quoteItems.find(item => item.id === itemId);
        if (itemToEdit) {
            setCurrentItemConfig(itemToEdit);
            setEditingItemId(itemId);
            const newSteps = itemToEdit.productLine === 'KITS' ? KITS_STEPS : SHOWER_TRAY_STEPS;
            setCurrentStep(itemToEdit.productLine === 'KITS' ? newSteps.findIndex(s => s.title === 'Selección de Kit') + 1 : 1);
        }
    };
    
    const handleDeleteItem = (itemId: string) => {
        if(window.confirm('¿Seguro que quieres eliminar este artículo?')) {
            setQuoteItems(quoteItems.filter(item => item.id !== itemId));
        }
    };

    const handleStartNewItem = () => {
        resetItemConfig();
        setCurrentStep(1);
    }
    
     // --- Quote Saving & Management ---
    const handleSaveQuote = (details: { customerName: string; projectReference: string }) => {
        if (!currentUser || quoteItems.length === 0) return;

        try {
            const allQuotes: SavedQuote[] = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
            const newQuoteIdNumber = (allQuotes.filter(q => q.userEmail === currentUser.email).length + 1).toString().padStart(4, '0');
            const newQuote: SavedQuote = {
                id: `quote_c_${newQuoteIdNumber}`,
                timestamp: Date.now(),
                userEmail: currentUser.email,
                quoteItems: quoteItems,
                totalPrice: totalQuotePrice,
                customerName: details.customerName,
                projectReference: details.projectReference,
                type: 'customer',
                 pvpTotalPrice: quoteItems.reduce((sum, item) => sum + calculateItemPrice(item, quoteItems), 0),
            };
            
            allQuotes.push(newQuote);
            localStorage.setItem('quotes', JSON.stringify(allQuotes));
            alert(`Presupuesto guardado con éxito. ID: ${newQuoteIdNumber}`);
            resetQuote();
            setView('my_quotes');
        } catch (error) {
            console.error("Failed to save quote:", error);
            alert("Error al guardar el presupuesto. Revisa la consola para más detalles.");
        }
    };
    
    const handleDuplicateQuote = (itemsToDuplicate: QuoteItem[]) => {
        resetQuote();
        setQuoteItems(itemsToDuplicate);
        setCurrentStep(totalSteps); // Go straight to summary
        setView('app');
    };

    const handleViewPdf = (quote: SavedQuote) => {
        setQuoteForPdf(quote);
        setIsPdfPreviewModalOpen(true);
    };

    // --- Data Export/Import ---
    const handleExportData = () => {
        if (!currentUser) return;
        try {
            const allQuotes: SavedQuote[] = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
            const userQuotes = allQuotes.filter(q => q.userEmail === currentUser.email);
            
            const dataToExport = {
                userSettings: {
                    preparedBy: currentUser.preparedBy,
                    fiscalName: currentUser.fiscalName,
                    sucursal: currentUser.sucursal,
                },
                quotes: userQuotes,
            };

            const dataStr = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `aqg_backup_${currentUser.companyName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Hubo un error al exportar los datos.");
        }
    };
    
    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentUser) return;

        if (!window.confirm("Atención: Esto reemplazará todos tus presupuestos y ajustes actuales con el contenido del archivo. ¿Deseas continuar?")) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read.");
                
                const importedData = JSON.parse(text);

                // Basic validation
                if (!importedData.quotes || !Array.isArray(importedData.quotes)) {
                    throw new Error("El archivo de importación no tiene el formato correcto (falta la lista de presupuestos).");
                }

                // Update user settings from import
                if (importedData.userSettings) {
                    updateUser({
                        preparedBy: importedData.userSettings.preparedBy,
                        fiscalName: importedData.userSettings.fiscalName,
                        sucursal: importedData.userSettings.sucursal,
                    });
                }

                // Replace quotes
                const allQuotes: SavedQuote[] = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
                // Remove existing quotes for this user
                const otherUserQuotes = allQuotes.filter(q => q.userEmail !== currentUser.email);
                // Add imported quotes, ensuring userEmail is correct
                const userQuotesToImport = importedData.quotes.map((q: SavedQuote) => ({ ...q, userEmail: currentUser.email }));
                const newQuotes = [...otherUserQuotes, ...userQuotesToImport];
                
                localStorage.setItem('quotes', JSON.stringify(newQuotes));
                
                alert("Datos importados con éxito. La página se recargará.");
                window.location.reload();

            } catch (error) {
                console.error("Error importing data:", error);
                alert(`Error al importar: ${error instanceof Error ? error.message : 'Error desconocido.'}`);
            } finally {
                setIsSettingsModalOpen(false);
            }
        };
        reader.readAsText(file);
    };


    // --- UI Logic & Render State ---

    const isNextDisabled = useMemo(() => {
        if (currentStep === 1) {
            return !currentItemConfig.productLine;
        }
        if (currentItemConfig.productLine === 'KITS') {
            if (currentStep === 2) return !currentItemConfig.kitProduct;
            if (currentStep === 3) {
                if (currentItemConfig.kitProduct?.id === 'kit-pintura') {
                    const isRal = currentItemConfig.extras.some(e => e.id === 'ral');
                    return !currentItemConfig.color && !(isRal && currentItemConfig.ralCode);
                }
                return false;
            }
        } else { // Shower Trays logic
            if (currentStep === 2) { // Step 2: Dimensions
                return !currentItemConfig.width || !currentItemConfig.length;
            }
            if (currentStep === 3) { // Step 3: Model/Texture
                return !currentItemConfig.model;
            }
            if (currentStep === 4) { // Step 4: Color
                 const isRal = currentItemConfig.extras.some(e => e.id === 'ral');
                 return !currentItemConfig.color && !(isRal && currentItemConfig.ralCode);
            }
            if (currentStep === 5) { // Step 5: Extras
                 const isBitono = currentItemConfig.extras.some(e => e.id === 'bitono');
                 return isBitono && !currentItemConfig.bitonoColor;
            }
        }
        return false;
    }, [currentStep, currentItemConfig]);

    const handleProductLineUpdate = (line: string) => {
        const baseState = { ...INITIAL_QUOTE_STATE, productLine: line, quantity: currentItemConfig.quantity };
        if (line === 'KITS') {
            // For KITS, we don't need dimensions or model.
            const { width, length, model, structFrames, ...kitState } = baseState;
            setCurrentItemConfig(kitState as QuoteState);
        } else {
            setCurrentItemConfig(baseState);
        }
    }

    const renderCurrentStep = () => {
        if (currentStep === 0) {
             if (view === 'app') return <WelcomePage userName={currentUser!.companyName} onNewQuote={() => handleStartNewQuote(true)} onViewQuotes={() => setView('my_quotes')} onResumeQuote={() => handleStartNewQuote(false)} hasActiveQuote={isQuoteActive} />;
             if (view === 'my_quotes') return <MyQuotesPage user={currentUser!} onDuplicateQuote={handleDuplicateQuote} onViewPdf={handleViewPdf} calculateInternalItemPrice={calculateInternalItemPrice} />;
             if (view === 'promotions') return <PromotionsPage user={currentUser!} onActivatePromotion={handleActivatePromotion} turnover={welcomePromoTurnover} turnoverLimit={PROMO_TURNOVER_LIMIT} />;
             if (view === 'guides') return <MaintenanceGuidesPage />;
        }
        
        // --- KITS Flow ---
        if (currentItemConfig.productLine === 'KITS') {
             switch (currentStep) {
                case 1:
                    return (
                        <Step1ModelSelection
                            selectedProductLine={currentItemConfig.productLine}
                            onUpdate={handleProductLineUpdate}
                            quantity={currentItemConfig.quantity}
                            onUpdateQuantity={(q) => setCurrentItemConfig(prev => ({...prev, quantity: q}))}
                        />
                    );
                case 2:
                    return (
                        <Step2KitSelection 
                            onSelect={(kit) => setCurrentItemConfig(prev => ({ ...prev, kitProduct: kit, extras: [] }))}
                            selectedKit={currentItemConfig.kitProduct || null}
                        />
                    );
                case 3:
                    return (
                         <Step3KitDetails
                            currentItemConfig={currentItemConfig}
                            onSelectColor={(color) => setCurrentItemConfig(prev => ({...prev, color, ralCode: '', extras: prev.extras.filter(e => e.id !== 'ral')}))}
                            onToggleRal={() => setCurrentItemConfig(prev => {
                                const hasRal = prev.extras.some(e => e.id === 'ral');
                                // For kits, RAL color option has no extra cost.
                                const ralExtraForKit: ProductOption = { id: 'ral', name: 'Color personalizado (RAL)', price: 0, description: '' };
                                const newExtras = hasRal 
                                    ? prev.extras.filter(e => e.id !== 'ral') 
                                    : [...prev.extras, ralExtraForKit];
                                return { ...prev, extras: newExtras, color: null };
                            })}
                            onRalCodeChange={(code) => setCurrentItemConfig(prev => ({...prev, ralCode: code}))}
                            onInvoiceRefChange={(ref) => setCurrentItemConfig(prev => ({...prev, invoiceReference: ref}))}
                        />
                    );
                case 4: // Summary step for KITS
                    return null; // Handled by showSummaryView
                default:
                    return <div>Paso desconocido</div>;
            }
        }
        
        // --- Shower Tray Flow ---
        switch (currentStep) {
            case 1:
                return (
                     <Step1ModelSelection
                        selectedProductLine={currentItemConfig.productLine}
                        onUpdate={handleProductLineUpdate}
                        quantity={currentItemConfig.quantity}
                        onUpdateQuantity={(q) => setCurrentItemConfig(prev => ({...prev, quantity: q}))}
                     />
                );
            case 2:
                return (
                    <Step1Dimensions
                        quote={currentItemConfig}
                        onUpdate={(width, length) => setCurrentItemConfig(prev => ({ ...prev, width, length }))}
                    />
                );
            case 3:
                return (
                    <Step2Model
                        onSelect={(model) => setCurrentItemConfig(prev => ({ ...prev, model }))}
                        selectedModel={currentItemConfig.model}
                        productLine={currentItemConfig.productLine}
                    />
                );
            case 4:
                return (
                    <Step3Color
                        onSelectColor={(color) => setCurrentItemConfig(prev => ({ ...prev, color, ralCode: undefined, extras: prev.extras.filter(e => e.id !== 'ral') }))}
                        selectedColor={currentItemConfig.color}
                        productLine={currentItemConfig.productLine}
                        onToggleRal={() => setCurrentItemConfig(prev => {
                            const hasRal = prev.extras.some(e => e.id === 'ral');
                            const newExtras = hasRal ? prev.extras.filter(e => e.id !== 'ral') : [...prev.extras, SHOWER_EXTRAS.find(e => e.id === 'ral')!];
                            return { ...prev, extras: newExtras, color: null };
                        })}
                        isRalSelected={currentItemConfig.extras.some(e => e.id === 'ral')}
                        ralCode={currentItemConfig.ralCode || ''}
                        onRalCodeChange={(code) => setCurrentItemConfig(prev => ({ ...prev, ralCode: code }))}
                    />
                );
            case 5:
                return (
                     <Step4Extras
                        onToggle={(extra) => setCurrentItemConfig(prev => {
                            const isSelected = prev.extras.some(e => e.id === extra.id);
                            let newExtras = isSelected ? prev.extras.filter(e => e.id !== extra.id) : [...prev.extras, extra];
                            let newBitonoColor = prev.bitonoColor;
                            if (extra.id === 'bitono' && isSelected) { // Untoggling bitono
                                newBitonoColor = undefined;
                            }
                            return { ...prev, extras: newExtras, bitonoColor: newBitonoColor };
                        })}
                        selectedExtras={currentItemConfig.extras}
                        productLine={currentItemConfig.productLine}
                        mainColor={currentItemConfig.color}
                        bitonoColor={currentItemConfig.bitonoColor}
                        onSelectBitonoColor={(color) => setCurrentItemConfig(prev => ({ ...prev, bitonoColor: color }))}
                        structFrames={currentItemConfig.structFrames}
                        onUpdateStructFrames={(frames) => setCurrentItemConfig(prev => ({...prev, structFrames: frames}))}
                    />
                );
            case 6: // Summary step for shower trays
                 return (
                     <Step5Summary
                        items={quoteItems}
                        totalPrice={totalQuotePrice}
                        onReset={resetQuote}
                        onSaveRequest={() => setIsSaveModalOpen(true)}
                        onGeneratePdfRequest={() => handleSaveQuote({ customerName: 'provisional', projectReference: '' })}
                        onPrintRequest={() => window.print()}
                        onStartNew={handleStartNewItem}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        calculateItemPrice={(item) => calculatePriceDetails(item, quoteItems).finalPrice}
                    />
                 );
            default:
                return <div>Paso desconocido</div>;
        }
    };
    
    const showSummaryView = currentStep === totalSteps;

    if (!currentUser) {
        return (
            <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
                <AuthPage onLogin={handleLogin} />
            </div>
        );
    }

    const navItems = [
        { id: 'app', label: 'Inicio', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
        { id: 'my_quotes', label: 'Mis Presupuestos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg> },
        { id: 'promotions', label: 'Promociones', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5l.646.646a1 1 0 00.708.293h2.292a1 1 0 01.707.293L17 5h.5a.5.5 0 01.5.5v3.793zM15 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg> },
        { id: 'guides', label: 'Guías', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v1H5V6zm6 3H5v1h6V9zm-6 3h6v1H5v-1z" clipRule="evenodd" /></svg> }
    ];

    const handleNavClick = (viewId: 'app' | 'my_quotes' | 'promotions' | 'guides') => {
        if (isQuoteActive && viewId !== 'app') {
            if (window.confirm('Tienes un presupuesto en curso. Si sales, se descartará. ¿Quieres continuar?')) {
                resetQuote();
                setView(viewId);
            }
        } else {
            resetQuote();
            setView(viewId);
        }
    };
    
    const isSummaryStep = currentStep === totalSteps;


    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col md:flex-row">
            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={({fiscalName, preparedBy, sucursal}) => updateUser({fiscalName, preparedBy, sucursal})}
                user={currentUser}
                onExport={handleExportData}
                onImport={handleImportData}
                welcomePromoIsActive={welcomePromoIsActive}
            />
             <SaveQuoteModal 
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={handleSaveQuote}
                disabled={quoteItems.length === 0}
            />
            <PdfPreviewModal 
                isOpen={isPdfPreviewModalOpen}
                onClose={() => setIsPdfPreviewModalOpen(false)}
                quote={quoteForPdf}
                user={currentUser}
                calculatePriceDetails={calculatePriceDetails}
                welcomePromoIsActive={welcomePromoIsActive}
            />
            <CustomQuoteModal 
                isOpen={isCustomQuoteModalOpen}
                onClose={() => setIsCustomQuoteModalOpen(false)}
            />

            {/* --- Sidebar --- */}
            <aside className="w-full md:w-20 lg:w-64 bg-white border-r border-slate-200 p-4 md:p-2 lg:p-5 flex flex-col flex-shrink-0">
                <div className="flex-grow">
                     <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg"></div>
                        <span className="hidden lg:block font-bold text-xl text-slate-800">AQG Tarifa</span>
                    </div>
                    <nav className="flex md:flex-col justify-around md:justify-start gap-1">
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => handleNavClick(item.id as any)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full md:w-auto lg:w-full text-left transition-colors font-semibold
                                ${view === item.id && currentStep === 0 ? 'bg-teal-50 text-teal-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                                {item.icon}
                                <span className="hidden lg:inline">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                         <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 uppercase">
                            {currentUser.companyName.substring(0, 1)}
                        </div>
                        <div className="hidden lg:block flex-grow">
                            <p className="font-semibold text-sm truncate">{currentUser.companyName}</p>
                            <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col lg:flex-row gap-2">
                         <button onClick={() => setIsSettingsModalOpen(true)} className="w-full text-xs text-slate-500 hover:text-teal-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors">Ajustes</button>
                         <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors">Salir</button>
                    </div>
                </div>
            </aside>
            
            {/* --- Main Content --- */}
            <main className="flex-grow p-6 md:p-10 lg:p-12 overflow-y-auto h-screen">
                {currentUser ? (
                    <div className="max-w-7xl mx-auto h-full flex flex-col">
                        {welcomePromoIsActive && currentStep > 0 && (
                            <PromotionBanner expirationDate={new Date(currentUser.promotion!.activationTimestamp + (PROMO_DURATION_DAYS * 24 * 60 * 60 * 1000))} />
                        )}

                        <div className="flex-grow">
                             {currentStep > 0 ? (
                                <div className={`grid ${isSummaryStep ? 'grid-cols-1' : 'md:grid-cols-3'} gap-12 h-full`}>
                                     {/* Step Tracker & Preview */}
                                    <div className={` ${isSummaryStep ? 'hidden' : 'md:col-span-1'} `}>
                                        <div className="sticky top-10">
                                            <StepTracker 
                                                currentStep={currentStep} 
                                                steps={steps}
                                                onStepClick={handleStepClick}
                                            />
                                            <div className="mt-10">
                                                <LivePreview item={currentItemConfig} price={currentItemPrice} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Step Content */}
                                    <div className={isSummaryStep ? 'col-span-1' : 'md:col-span-2'}>
                                        <div className="flex flex-col h-full">
                                            <div className="flex-grow">
                                                 {showSummaryView ? (
                                                    <Step5Summary
                                                        items={quoteItems}
                                                        totalPrice={totalQuotePrice}
                                                        onReset={handleDiscard}
                                                        onSaveRequest={() => setIsSaveModalOpen(true)}
                                                        onGeneratePdfRequest={() => handleSaveQuote({ customerName: 'provisional', projectReference: '' })}
                                                        onPrintRequest={() => window.print()}
                                                        onStartNew={handleStartNewItem}
                                                        onEdit={handleEditItem}
                                                        onDelete={handleDeleteItem}
                                                        calculateItemPrice={(item) => calculatePriceDetails(item, quoteItems).finalPrice}
                                                    />
                                                 ) : (
                                                    renderCurrentStep()
                                                 )}
                                            </div>
                                            {!showSummaryView && (
                                                <NextPrevButtons 
                                                    onNext={currentStep === totalSteps - 1 ? handleAddItemToQuote : handleNext} 
                                                    onPrev={handlePrev} 
                                                    currentStep={currentStep} 
                                                    totalSteps={totalSteps} 
                                                    isNextDisabled={isNextDisabled}
                                                    isLastStep={currentStep === totalSteps - 1}
                                                    onDiscard={handleDiscard}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                             ) : (
                                renderCurrentStep()
                             )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">
                        No tienes una sesión iniciada.
                    </p>
                )}
            </main>
        </div>
    );
};

// Fix: Export the App component to make it available for import in index.tsx.
export default App;
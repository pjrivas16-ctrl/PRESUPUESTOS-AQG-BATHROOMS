
// Fix: Import useState, useEffect, useRef, useCallback, and useMemo from React to resolve multiple hook-related errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// Fix: Import PriceDetails from types.ts to use a shared type definition.
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem, PriceDetails } from './types';
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
import CommercialConditionsPage from './components/CommercialConditionsPage';
import MaintenanceGuidesPage from './components/MaintenanceGuidesPage';
import TransparencyPage from './components/TransparencyPage';

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
        <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full p-4">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Bienvenido, {userName}</h1>
            <p className="mt-4 text-base text-slate-600 max-w-2xl">
                Estás en la Herramienta Comercial de AQG. Desde aquí puedes crear nuevos presupuestos, gestionar los existentes y acceder a guías de producto.
            </p>
            <div className="mt-8 flex flex-col w-full gap-4">
                {hasActiveQuote && (
                     <button
                        onClick={onResumeQuote}
                        className="px-6 py-4 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        Continuar Presupuesto
                    </button>
                )}
                <button
                    onClick={handleNewQuoteClick}
                    className="px-6 py-4 font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {hasActiveQuote ? 'Crear Presupuesto Nuevo' : 'Crear Nuevo Presupuesto'}
                </button>
                <button
                    onClick={onViewQuotes}
                    className="px-6 py-4 font-semibold text-teal-600 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors flex items-center justify-center gap-2"
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
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, user, onExport, onImport }) => {
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
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Ajustes</h3>
                            <p className="text-sm text-slate-500">Personaliza tus presupuestos.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-6">
                     <div>
                        <label htmlFor="fiscal-name" className="block text-sm font-medium text-slate-700 mb-2">
                            Tu Nombre Fiscal
                        </label>
                        <input
                            id="fiscal-name"
                            type="text"
                            value={fiscalName}
                            onChange={(e) => setFiscalName(e.target.value)}
                            placeholder="Nombre fiscal de tu empresa"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Este es el nombre que aparecerá como emisor del presupuesto.</p>
                    </div>
                     <div>
                        <label htmlFor="sucursal" className="block text-sm font-medium text-slate-700 mb-2">
                            Tu Sucursal (Opcional)
                        </label>
                        <input
                            id="sucursal"
                            type="text"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            placeholder="Ej: Tienda Centro"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Identifica la sucursal desde la que operas.</p>
                    </div>
                    <div>
                        <label htmlFor="prepared-by" className="block text-sm font-medium text-slate-700 mb-2">
                            Tu Nombre (Preparado por)
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
                         <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7v1.111c0 .488.132.953.375 1.36M20 7v1.111c0 .488-.132.953-.375 1.36M12 11c-4.418 0-8-1.79-8-4" /></svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800">Gestión de Datos</h4>
                             <p className="text-sm text-slate-500">Guarda o restaura tus datos.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={onExport} 
                                className="w-full px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                Exportar
                            </button>
                            <button 
                                onClick={() => importInputRef.current?.click()} 
                                className="w-full px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                Importar
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
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- PDF Preview Modal ---
interface PdfPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: SavedQuote | null;
    user: User;
    calculatePriceDetails: (item: QuoteItem, discounts: { [key: string]: number }) => PriceDetails;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ isOpen, onClose, quote, user, calculatePriceDetails }) => {
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
            doc.text(quote.id.replace('quote_i_', '').replace('quote_c_', '').replace(/preview_\d+/g, 'PREVIEW'), 160, 50);
            doc.text(new Date(quote.timestamp).toLocaleDateString('es-ES'), 160, 55);

            // --- Client Info Box ---
            const hasDeliveryAddress = quote.deliveryAddress && quote.deliveryAddress.trim() !== '';
            const boxHeight = hasDeliveryAddress ? 32 : 22;
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.roundedRect(14, 62, 181, boxHeight, 2, 2, 'S');
            doc.setFontSize(9);
            doc.setTextColor(lightTextColor);
            doc.text('PRESUPUESTO PARA:', 20, 68);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor);
            
            let clientLine1 = quote.fiscalName || quote.customerName || 'Cliente sin especificar';
            if (quote.sucursal) {
                clientLine1 += ` (${quote.sucursal})`;
            }
            doc.text(clientLine1, 20, 74);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(lightTextColor);
            if (quote.projectReference) doc.text(`Referencia: ${quote.projectReference}`, 20, 79);

            if (hasDeliveryAddress) {
                doc.setFont('helvetica', 'bold');
                doc.text(`Dirección de Entrega:`, 20, 89);
                doc.setFont('helvetica', 'normal');
                doc.text(quote.deliveryAddress!, 58, 89);
            }


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
                    if (item.cutWidth && item.cutLength) {
                        description += `Corte a medida: ${item.cutWidth}x${item.cutLength}cm\n`;
                    }
                    description += `Color: ${item.color?.name || `RAL ${item.ralCode}`}\n`;
                    if (item.extras.length > 0) {
                        description += `Extras: ${item.extras.map(e => e.id === 'bitono' && item.bitonoColor ? `Tapa bitono: ${item.bitonoColor.name}` : e.name).join(', ')}`;
                    }
                     if (item.productLine === 'STRUCT DETAIL' && item.structFrames) {
                        description += `\nMarcos: ${item.structFrames}`;
                    }
                }
                
                const effectiveDiscounts = quote.customerDiscounts || {};
                const priceDetails = calculatePriceDetails(item, effectiveDiscounts);
                const unitPVP = item.quantity > 0 ? priceDetails.basePrice / item.quantity : 0;
            
                return [
                    item.quantity,
                    description.trim(),
                    unitPVP.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
                    `${priceDetails.discountPercent.toFixed(2)}%`,
                    priceDetails.discountedPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                ];
            });

            // @ts-ignore
            doc.autoTable({
                startY: boxHeight + 68,
                head: [['Cant.', 'Descripción', 'PVP Unit.', 'Dto. %', 'Subtotal']],
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
                    2: { cellWidth: 25, halign: 'right' },
                    3: { cellWidth: 20, halign: 'right' },
                    4: { cellWidth: 30, halign: 'right' },
                }
            });

            // --- Totals ---
            const finalY = (doc as any).autoTable.previous.finalY || 150;
            const priceCalculations = quote.quoteItems.map(item => calculatePriceDetails(item, quote.customerDiscounts || {}));
            
            let currentY = finalY + 10;
            doc.setFontSize(10);

            const drawTotalLine = (label: string, value: string, isBold = false) => {
                doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                doc.text(label, 140, currentY);
                doc.text(value, 195, currentY, { align: 'right' });
                currentY += 6;
            };

            const baseImponible = priceCalculations.reduce((sum, details) => sum + details.discountedPrice, 0);
            
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
    }, [quote, user, calculatePriceDetails]);

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
            <div className="bg-white rounded-2xl shadow-2xl p-4 w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800">Previsualización</h3>
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
                        Descargar
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
    onConfirm: (details: { customerName: string; projectReference: string; fiscalName: string; sucursal: string; deliveryAddress: string; }) => void;
    disabled: boolean;
}

const SaveQuoteModal: React.FC<SaveQuoteModalProps> = ({ isOpen, onClose, onConfirm, disabled }) => {
    const [customerName, setCustomerName] = useState('');
    const [projectReference, setProjectReference] = useState('');
    const [fiscalName, setFiscalName] = useState('');
    const [sucursal, setSucursal] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (customerName.trim() || fiscalName.trim()) {
            onConfirm({ customerName, projectReference, fiscalName, sucursal, deliveryAddress });
            onClose();
            // Reset fields
            setCustomerName('');
            setProjectReference('');
            setFiscalName('');
            setSucursal('');
            setDeliveryAddress('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Guardar</h3>
                            <p className="text-sm text-slate-500">Detalles del cliente final.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fiscalName" className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre Fiscal del Cliente
                        </label>
                        <input
                            id="fiscalName"
                            type="text"
                            value={fiscalName}
                            onChange={(e) => setFiscalName(e.target.value)}
                            placeholder="Ej: Proyectos Baño S.L."
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre Comercial / Contacto <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                         <p className="text-xs text-slate-500 mt-1">Este o el Nombre Fiscal es obligatorio.</p>
                    </div>
                    <div>
                        <label htmlFor="sucursalCliente" className="block text-sm font-medium text-slate-700 mb-2">
                            Población / Sucursal (Opcional)
                        </label>
                        <input
                            id="sucursalCliente"
                            type="text"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            placeholder="Ej: Madrid Centro"
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
                     <div>
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-slate-700 mb-2">
                            Dirección de Entrega (Si es diferente)
                        </label>
                        <textarea
                            id="deliveryAddress"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Dejar en blanco para usar la dirección principal del cliente."
                            rows={3}
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
                    <button onClick={handleConfirm} disabled={disabled || (!customerName.trim() && !fiscalName.trim())} className="px-8 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-300 transition-colors">
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
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">CUSTOM</h3>
                            <p className="text-sm text-slate-500">Presupuestos a medida.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4 text-slate-600">
                    <p>
                        El modelo <strong>CUSTOM</strong> requiere un presupuesto detallado.
                    </p>
                    <p>
                        Para solicitarlo, envía los detalles de tu proyecto a:
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


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<'app' | 'my_quotes' | 'tools' | 'transparency' | 'guides'>('app');

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
    const [appliedDiscounts, setAppliedDiscounts] = useState<{ [key: string]: number }>({});

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
                    ...authorizedUser, // Start with the base data from code (name, password).
                    // Preserve dynamic/user-editable fields from storage if they exist.
                    promotion: storedVersion?.promotion,
                    preparedBy: storedVersion?.preparedBy || authorizedUser.preparedBy,
                    fiscalName: storedVersion?.fiscalName || authorizedUser.fiscalName,
                    sucursal: storedVersion?.sucursal || authorizedUser.sucursal,
                };
                usersMap.set(authorizedUser.email, updatedUser as StoredUser);
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
    
    // --- Pricing Logic ---
    const calculateItemPrice = useCallback((item: QuoteState): number => {
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

    const calculatePriceDetails = useCallback((item: QuoteItem, discounts: { [key: string]: number }): PriceDetails => {
        const basePrice = calculateItemPrice(item); // PVP
        const discountPercent = (item.productLine && discounts[item.productLine]) || 0;
        const discountedPrice = basePrice * (1 - discountPercent / 100);
        const finalPrice = discountedPrice * (1 + VAT_RATE);

        return {
            basePrice,
            discountedPrice,
            finalPrice,
            discountPercent
        };
    }, [calculateItemPrice]);


    const currentItemPrice = useMemo(() => {
        const pvp = calculateItemPrice(currentItemConfig);
        const discountPercent = (currentItemConfig.productLine && appliedDiscounts[currentItemConfig.productLine]) || 0;
        const discountedPVP = pvp * (1 - discountPercent / 100);
        return discountedPVP * (1 + VAT_RATE);
    }, [currentItemConfig, calculateItemPrice, appliedDiscounts]);


    const totalQuotePrice = useMemo(() => {
        const subtotal = quoteItems.reduce((sum, item) => {
            const details = calculatePriceDetails(item, appliedDiscounts);
            return sum + details.discountedPrice;
        }, 0);
        return subtotal * (1 + VAT_RATE);
    }, [quoteItems, appliedDiscounts, calculatePriceDetails]);


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
        setAppliedDiscounts({});
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
    const handleSaveQuote = (details: { customerName: string; projectReference: string; fiscalName: string; sucursal: string; deliveryAddress: string; }) => {
        if (!currentUser || quoteItems.length === 0) return;

        try {
            const allQuotes: SavedQuote[] = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
            const newQuoteIdNumber = (allQuotes.filter(q => q.userEmail === currentUser.email).length + 1).toString().padStart(4, '0');
            
            const pvpTotal = quoteItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
            
            const newQuote: SavedQuote = {
                id: `quote_c_${newQuoteIdNumber}`,
                timestamp: Date.now(),
                userEmail: currentUser.email,
                quoteItems: quoteItems,
                totalPrice: totalQuotePrice,
                customerName: details.customerName,
                projectReference: details.projectReference,
                fiscalName: details.fiscalName,
                sucursal: details.sucursal,
                deliveryAddress: details.deliveryAddress,
                type: 'customer',
                pvpTotalPrice: pvpTotal,
                customerDiscounts: appliedDiscounts,
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
    
    const handleDuplicateQuote = (quoteToDuplicate: SavedQuote) => {
        resetQuote();
        setQuoteItems(JSON.parse(JSON.stringify(quoteToDuplicate.quoteItems)));
        setAppliedDiscounts(quoteToDuplicate.customerDiscounts || {});
        setCurrentStep(totalSteps); // Go straight to summary
        setView('app');
    };

    const handlePreviewPdf = () => {
        if (!currentUser || quoteItems.length === 0) return;

        // Create a temporary quote object for the PDF preview without saving it
        const quoteForPreview: SavedQuote = {
            id: `preview_${Date.now()}`,
            timestamp: Date.now(),
            userEmail: currentUser.email,
            quoteItems: quoteItems,
            totalPrice: totalQuotePrice,
            customerName: 'Cliente (Previsualización)',
            projectReference: '',
            type: 'customer',
            pvpTotalPrice: quoteItems.reduce((sum, item) => sum + calculateItemPrice(item), 0),
            customerDiscounts: appliedDiscounts,
        };

        setQuoteForPdf(quoteForPreview);
        setIsPdfPreviewModalOpen(true);
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
                const kitId = currentItemConfig.kitProduct?.id;
                if (kitId === 'kit-pintura' || kitId === 'kit-reparacion') {
                    const isRal = currentItemConfig.extras.some(e => e.id === 'ral');
                    const isColorSelected = !!currentItemConfig.color;
                    const isRalCompleted = isRal && !!currentItemConfig.ralCode?.trim();
                    return !(isColorSelected || isRalCompleted);
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
                if (isBitono && !currentItemConfig.bitonoColor) return true;

                const hasCut = currentItemConfig.extras.some(e => e.id.startsWith('corte'));
                if (hasCut) {
                    const { cutWidth, cutLength, width, length } = currentItemConfig;
                    if (!cutWidth || cutWidth <= 0 || !cutLength || cutLength <= 0) {
                        return true; // Must provide positive dimensions
                    }
                    if (width && length) {
                        const baseSorted = [width, length].sort((a, b) => a - b);
                        const cutSorted = [cutWidth, cutLength].sort((a, b) => a - b);
                        if (cutSorted[0] > baseSorted[0] || cutSorted[1] > baseSorted[1]) {
                            return true; // Cut dimensions (even if rotated) are larger than base dimensions
                        }
                    }
                }
                return false;
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
             if (view === 'my_quotes') return <MyQuotesPage user={currentUser!} onDuplicateQuote={handleDuplicateQuote} onViewPdf={handleViewPdf} />;
             if (view === 'tools') return <CommercialConditionsPage />;
             if (view === 'transparency') return <TransparencyPage />;
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
                            
                            const hasCut = newExtras.some(e => e.id.startsWith('corte'));
                            
                            let newBitonoColor = prev.bitonoColor;
                            if (extra.id === 'bitono' && isSelected) { // Untoggling bitono
                                newBitonoColor = undefined;
                            }
                            return { 
                                ...prev, 
                                extras: newExtras, 
                                bitonoColor: newBitonoColor,
                                cutWidth: hasCut ? prev.cutWidth : undefined,
                                cutLength: hasCut ? prev.cutLength : undefined,
                            };
                        })}
                        selectedExtras={currentItemConfig.extras}
                        productLine={currentItemConfig.productLine}
                        mainColor={currentItemConfig.color}
                        bitonoColor={currentItemConfig.bitonoColor}
                        onSelectBitonoColor={(color) => setCurrentItemConfig(prev => ({ ...prev, bitonoColor: color }))}
                        structFrames={currentItemConfig.structFrames}
                        onUpdateStructFrames={(frames) => setCurrentItemConfig(prev => ({...prev, structFrames: frames}))}
                        baseWidth={currentItemConfig.width}
                        baseLength={currentItemConfig.length}
                        cutWidth={currentItemConfig.cutWidth}
                        cutLength={currentItemConfig.cutLength}
                        onUpdateCutDimensions={(dims) => setCurrentItemConfig(prev => ({...prev, ...dims}))}
                    />
                );
            case 6: // Summary step for shower trays
                 return (
                     <Step5Summary
                        items={quoteItems}
                        totalPrice={totalQuotePrice}
                        onReset={resetQuote}
                        onSaveRequest={() => setIsSaveModalOpen(true)}
                        onGeneratePdfRequest={handlePreviewPdf}
                        onPrintRequest={() => window.print()}
                        onStartNew={handleStartNewItem}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        calculatePriceDetails={(item) => calculatePriceDetails(item, appliedDiscounts)}
                        appliedDiscounts={appliedDiscounts}
                        onUpdateDiscounts={setAppliedDiscounts}
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
        { id: 'app', label: 'Inicio', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
        { id: 'my_quotes', label: 'Presupuestos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg> },
        { id: 'tools', label: 'Comercial', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM4.343 5.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 16a1 1 0 10-2 0v1a1 1 0 102 0v-1zM3.05 11.05a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.657 14.343a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4.343 14.343a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zM10 5a5 5 0 00-5 5h10a5 5 0 00-5-5zM8 16a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg> },
        { id: 'transparency', label: 'Transparencia', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg> },
        { id: 'guides', label: 'Descargas', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg> }
    ];

    const handleNavClick = (viewId: 'app' | 'my_quotes' | 'tools' | 'transparency' | 'guides') => {
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
    
    const currentViewLabel = navItems.find(item => item.id === view)?.label || 'AQG Comercial';


    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col h-[100svh]">
            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={({fiscalName, preparedBy, sucursal}) => updateUser({fiscalName, preparedBy, sucursal})}
                user={currentUser}
                onExport={handleExportData}
                onImport={handleImportData}
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
            />
            <CustomQuoteModal 
                isOpen={isCustomQuoteModalOpen}
                onClose={() => setIsCustomQuoteModalOpen(false)}
            />
            
            <main className="flex-grow overflow-y-auto pb-24">
                {currentUser ? (
                    <>
                        <header className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-30 p-4 border-b border-slate-200">
                             <div className="flex justify-between items-center">
                                 <h1 className="text-lg font-bold text-slate-800">{currentStep > 0 ? 'Nuevo Presupuesto' : currentViewLabel}</h1>
                                <div className="flex items-center gap-2">
                                     <button onClick={() => setIsSettingsModalOpen(true)} className="text-slate-500 hover:text-teal-600 p-2 rounded-full hover:bg-slate-100">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.96.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                     </button>
                                     <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-slate-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                                     </button>
                                </div>
                             </div>
                        </header>
                        <div className="p-4">
                             {currentStep > 0 ? (
                                <div>
                                    <div className="mb-8">
                                        <StepTracker 
                                            currentStep={currentStep} 
                                            steps={steps}
                                            onStepClick={handleStepClick}
                                        />
                                    </div>
                                    <div className="flex flex-col h-full">
                                        <div className="flex-grow">
                                             {showSummaryView ? (
                                                <Step5Summary
                                                    items={quoteItems}
                                                    totalPrice={totalQuotePrice}
                                                    onReset={handleDiscard}
                                                    onSaveRequest={() => setIsSaveModalOpen(true)}
                                                    onGeneratePdfRequest={handlePreviewPdf}
                                                    onPrintRequest={() => window.print()}
                                                    onStartNew={handleStartNewItem}
                                                    onEdit={handleEditItem}
                                                    onDelete={handleDeleteItem}
                                                    calculatePriceDetails={(item) => calculatePriceDetails(item, appliedDiscounts)}
                                                    appliedDiscounts={appliedDiscounts}
                                                    onUpdateDiscounts={setAppliedDiscounts}
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
                             ) : (
                                renderCurrentStep()
                             )}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-slate-500 p-4">
                        No tienes una sesión iniciada.
                    </p>
                )}
            </main>

             {/* --- Bottom Navigation --- */}
            {currentUser && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 flex justify-around z-40">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => handleNavClick(item.id as any)} 
                            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 flex-grow transition-colors
                                ${view === item.id && currentStep === 0 ? 'text-teal-600' : 'text-slate-500 hover:bg-slate-100'}`}>
                            {item.icon}
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            )}

        </div>
    );
};

// Fix: Export the App component to make it available for import in index.tsx.
export default App;


// Fix: Import useState, useEffect, useRef, useCallback, and useMemo from React to resolve multiple hook-related errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem } from './types';
// Fix: Added STANDARD_COLORS to the import to resolve an undefined variable error.
import { 
    PRICE_LIST, SHOWER_TRAY_STEPS, KITS_STEPS, SHOWER_MODELS, KIT_PRODUCTS, SHOWER_EXTRAS, STANDARD_COLORS
} from './constants';
import { authorizedUsers } from './authorizedUsers';
import { processImageForPdf } from './utils/pdfUtils';

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
import LogoUploader from './components/LogoUploader';
import PromotionBanner from './components/PromotionBanner';
import LivePreview from './components/LivePreview';
import MaintenanceGuidesPage from './components/MaintenanceGuidesPage';
// The aqgLogo is no longer needed as we are removing it to prevent errors.

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
    onSave: (settings: { fiscalName: string; preparedBy: string; sucursal: string; logo: string | null; }) => void;
    user: User;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, user, onExport, onImport }) => {
    const [preparedBy, setPreparedBy] = useState(user.preparedBy || '');
    const [fiscalName, setFiscalName] = useState(user.fiscalName || user.companyName || '');
    const [sucursal, setSucursal] = useState(user.sucursal || '');
    const [logo, setLogo] = useState<string | null>(user.logo || null);
    const importInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPreparedBy(user.preparedBy || '');
            setFiscalName(user.fiscalName || user.companyName || '');
            setSucursal(user.sucursal || '');
            setLogo(user.logo || null);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ preparedBy, fiscalName, sucursal, logo });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Ajustes de PDF</h3>
                            <p className="text-sm text-slate-500">Personaliza la información en tus presupuestos.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-6">
                     <LogoUploader logo={logo} onLogoChange={setLogo} />
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


// --- PDF Preview Modal ---
interface PdfPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: SavedQuote | null;
    user: User;
    calculateItemPrice: (item: QuoteItem, allItems: QuoteItem[], includeVat: boolean) => number;
    welcomePromoIsActive: boolean;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ isOpen, onClose, quote, user, calculateItemPrice, welcomePromoIsActive }) => {
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
            const userLogoData = user.logo ? await processImageForPdf(user.logo).catch(e => { console.error(e); return null; }) : null;
            
            if (userLogoData) {
                const aspectRatio = userLogoData.width / userLogoData.height;
                const logoHeight = 20;
                const logoWidth = logoHeight * aspectRatio;
                doc.addImage(userLogoData.imageData, userLogoData.format, 15, 15, logoWidth, logoHeight);
            }

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
                if (item.productLine === 'KITS Y ACCESORIOS') {
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
                
                const itemPriceWithoutVAT = calculateItemPrice(item, quote.quoteItems, false);
                const unitPrice = item.quantity > 0 ? itemPriceWithoutVAT / item.quantity : 0;
            
                return [
                    item.quantity,
                    description.trim(),
                    unitPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
                    itemPriceWithoutVAT.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                ];
            });

            // @ts-ignore
            doc.autoTable({
                startY: 90,
                head: [['Cant.', 'Descripción', 'P. Unitario', 'Total']],
                body: tableRows,
                theme: 'grid',
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
            const subtotal = quote.quoteItems.reduce((sum, item) => sum + calculateItemPrice(item, quote.quoteItems, false), 0);
            
            let currentY = finalY + 10;
            doc.setFontSize(10);

            const drawTotalLine = (label: string, value: string, isBold = false) => {
                doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                doc.text(label, 140, currentY);
                doc.text(value, 195, currentY, { align: 'right' });
                currentY += 6;
            };

            drawTotalLine('Subtotal', subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            
            let baseImponible = subtotal;

            if (welcomePromoIsActive) {
                const promoDiscount1 = subtotal * 0.5;
                const subtotalAfterPromo1 = subtotal - promoDiscount1;
                const promoDiscount2 = subtotalAfterPromo1 * 0.25;
                baseImponible = subtotalAfterPromo1 - promoDiscount2;
                
                drawTotalLine('Dto. Bienvenida (50%)', `- ${promoDiscount1.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);
                drawTotalLine('Dto. Adicional (25%)', `- ${promoDiscount2.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);
                doc.setDrawColor(226, 232, 240);
                doc.line(140, currentY - 8, 195, currentY - 8);
                drawTotalLine('Base Imponible', baseImponible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            } else if (user.discount && user.discount > 0) {
                const discountPercent = user.discount;
                const discountAmount = subtotal * (discountPercent / 100);
                baseImponible = subtotal - discountAmount;
                
                drawTotalLine(`Descuento (${discountPercent}%)`, `- ${discountAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);
                doc.setDrawColor(226, 232, 240);
                doc.line(140, currentY - 8, 195, currentY - 8);
                drawTotalLine('Base Imponible', baseImponible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            }

            const ivaAmount = baseImponible * 0.21;
            const total = baseImponible + ivaAmount;

            drawTotalLine('IVA (21%)', ivaAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
            doc.setDrawColor(textColor);
            doc.setLineWidth(0.5);
            doc.line(140, currentY - 2, 195, currentY - 2);
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
    }, [quote, user, calculateItemPrice, welcomePromoIsActive]);

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


const VAT_RATE = 0.21;
const PROMO_DURATION_DAYS = 60;
const PROMO_ID = 'new_client_promo';

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
            const storedUsers = localStorage.getItem('users');
            if (!storedUsers) {
                localStorage.setItem('users', JSON.stringify(authorizedUsers));
            }
            const loggedInUserEmail = localStorage.getItem('currentUserEmail');
            if (loggedInUserEmail) {
                const allUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
                const user = allUsers.find(u => u.email === loggedInUserEmail);
                if (user) {
                    const { password, ...userToSet } = user;
                    setCurrentUser(userToSet);
                }
            }
        } catch (error) {
            console.error("Error initializing user data from localStorage:", error);
        }
    }, []);

    const handleLogin = useCallback(async (email: string, passwordAttempt: string) => {
        const allUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user && user.password === passwordAttempt) {
            const { password, ...userToSet } = user;
            setCurrentUser(userToSet);
            localStorage.setItem('currentUserEmail', user.email);
        } else {
            throw new Error('El email o la contraseña son incorrectos.');
        }
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUserEmail');
        setView('app');
        setQuoteItems([]);
        setCurrentItemConfig(INITIAL_QUOTE_STATE);
        setCurrentStep(0);
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setCurrentUser(updatedUser);
        const allUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = allUsers.findIndex(u => u.email === updatedUser.email);
        if (userIndex !== -1) {
            const updatedStoredUser = { ...allUsers[userIndex], ...updatedUser };
            allUsers[userIndex] = updatedStoredUser;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }
    }, []);

    const handleSettingsSave = (settings: { fiscalName: string; preparedBy: string; sucursal: string; logo: string | null; }) => {
        if (currentUser) {
            updateUser({ ...currentUser, ...settings });
        }
    };
    
    // --- Price Calculation ---
    const welcomePromoIsActive = useMemo(() => {
        if (!currentUser?.promotion || currentUser.promotion.id !== PROMO_ID) return false;
        const expiryTime = currentUser.promotion.activationTimestamp + (PROMO_DURATION_DAYS * 24 * 60 * 60 * 1000);
        return Date.now() < expiryTime;
    }, [currentUser]);

    const calculateBaseItemPrice = useCallback((item: QuoteState | QuoteItem): number => {
        if (item.productLine === 'KITS Y ACCESORIOS') {
            return item.kitProduct?.price || 0;
        }

        if (!item.productLine || !PRICE_LIST[item.productLine]) return 0;
        const priceForWidth = PRICE_LIST[item.productLine][item.width];
        if (!priceForWidth || !priceForWidth[item.length]) return 0; // Should not happen with selects
        
        let price = priceForWidth[item.length];

        if (item.model?.priceFactor) {
            price *= item.model.priceFactor;
        }

        item.extras.forEach(extra => {
            price += extra.price;
        });

        if (item.productLine === 'STRUCT DETAIL' && item.structFrames) {
            const discounts = { 4: 0, 3: 0.05, 2: 0.10, 1: 0.15 };
            price *= (1 - discounts[item.structFrames]);
        }
        
        return price;
    }, []);

    const calculateCustomerItemPrice = useCallback((item: QuoteItem, allItems: QuoteItem[], includeVat: boolean): number => {
        const basePrice = calculateBaseItemPrice(item);
        const priceWithQuantity = basePrice * item.quantity;
        return includeVat ? priceWithQuantity * (1 + VAT_RATE) : priceWithQuantity;
    }, [calculateBaseItemPrice]);
    
     const calculateInternalItemPrice = useCallback((item: QuoteItem, allItems: QuoteItem[]): number => {
        // This is a placeholder for a potentially different internal price logic
        // For now, it's the same as the customer's base price before quote-level discounts
        const basePrice = calculateBaseItemPrice(item);
        return basePrice * item.quantity;
    }, [calculateBaseItemPrice]);


    const currentItemPrice = useMemo(() => {
        const basePrice = calculateBaseItemPrice(currentItemConfig) * currentItemConfig.quantity;
        return basePrice * (1 + VAT_RATE);
    }, [currentItemConfig, calculateBaseItemPrice]);

    const totalPrice = useMemo(() => {
        const subtotal = quoteItems.reduce((sum, item) => sum + (calculateBaseItemPrice(item) * item.quantity), 0);
        let finalBase = subtotal;

        if (welcomePromoIsActive) {
            const promoDiscount1 = subtotal * 0.5;
            const subtotalAfterPromo1 = subtotal - promoDiscount1;
            const promoDiscount2 = subtotalAfterPromo1 * 0.25;
            finalBase = subtotalAfterPromo1 - promoDiscount2;
        } else if (currentUser?.discount && currentUser.discount > 0) {
            finalBase = subtotal * (1 - currentUser.discount / 100);
        }

        return finalBase * (1 + VAT_RATE);
    }, [quoteItems, currentUser, calculateBaseItemPrice, welcomePromoIsActive]);


    // --- Step Navigation & State Updates ---
    const steps = useMemo(() => 
        currentItemConfig.productLine === 'KITS Y ACCESORIOS' ? KITS_STEPS : SHOWER_TRAY_STEPS,
        [currentItemConfig.productLine]
    );

    const handleUpdateItemConfig = useCallback((updates: Partial<QuoteState>) => {
        setCurrentItemConfig(prev => ({ ...prev, ...updates }));
    }, []);
    
    const handleUpdateProductLine = useCallback((line: string) => {
        if (line === 'CUSTOM') {
            setIsCustomQuoteModalOpen(true);
            return;
        }
        const isKit = line === 'KITS Y ACCESORIOS';
        const newDefaults = isKit ? { 
            width: 0, length: 0, model: null, extras: [], bitonoColor: null, structFrames: undefined 
        } : { 
            kitProduct: null, invoiceReference: undefined 
        };
        // Keep quantity when changing product line
        setCurrentItemConfig(prev => ({ ...INITIAL_QUOTE_STATE, quantity: prev.quantity, productLine: line, ...newDefaults }));
    }, []);

    const handleToggleExtra = useCallback((extra: ProductOption) => {
        setCurrentItemConfig(prev => {
            const isSelected = prev.extras.some(e => e.id === extra.id);
            const newExtras = isSelected ? prev.extras.filter(e => e.id !== extra.id) : [...prev.extras, extra];
            
            // If toggling off bitono, clear bitono color
            if (extra.id === 'bitono' && isSelected) {
                return { ...prev, extras: newExtras, bitonoColor: null };
            }
            // If toggling off RAL for main color, clear ralCode
            if (extra.id === 'ral' && isSelected) {
                return { ...prev, extras: newExtras, ralCode: undefined, color: STANDARD_COLORS[0] };
            }
            return { ...prev, extras: newExtras };
        });
    }, []);
    
    // --- Quote Management ---
    const resetCurrentItemAndStartOver = useCallback(() => {
        setCurrentItemConfig(INITIAL_QUOTE_STATE);
        setEditingItemId(null);
        setCurrentStep(1);
    }, []);

    const handleAddItemToQuote = useCallback(() => {
        if (editingItemId) {
            setQuoteItems(items => items.map(item => item.id === editingItemId ? { ...currentItemConfig, id: editingItemId } : item));
        } else {
            const newItem: QuoteItem = { ...currentItemConfig, id: `item_${Date.now()}` };
            setQuoteItems(items => [...items, newItem]);
        }
        setEditingItemId(null);
        setCurrentItemConfig(prev => ({...INITIAL_QUOTE_STATE, quantity: prev.quantity}));
        setCurrentStep(steps.length);
    }, [currentItemConfig, editingItemId, steps.length]);

    const handleNext = useCallback(() => {
        if (currentStep === steps.length - 1) {
            handleAddItemToQuote();
        } else {
            setCurrentStep(s => s + 1);
        }
    }, [currentStep, steps, handleAddItemToQuote]);
    
    const isNextDisabled = useMemo(() => {
        const isKit = currentItemConfig.productLine === 'KITS Y ACCESORIOS';
        if (currentStep === 1 && !currentItemConfig.productLine) return true;
        if (isKit) {
            if (currentStep === 2 && !currentItemConfig.kitProduct) return true;
            if (currentStep === 3 && currentItemConfig.kitProduct?.id === 'kit-pintura') {
                const isRal = currentItemConfig.extras.some(e => e.id === 'ral');
                if (isRal && !currentItemConfig.ralCode?.trim()) return true;
                if (!isRal && !currentItemConfig.color) return true;
            }
        } else {
            if (currentStep === 3 && !currentItemConfig.model) return true;
            if (currentStep === 4) {
                 const isRal = currentItemConfig.extras.some(e => e.id === 'ral');
                 if (isRal && !currentItemConfig.ralCode?.trim()) return true;
                 if (!isRal && !currentItemConfig.color) return true;
            }
            if (currentStep === 5 && currentItemConfig.extras.some(e => e.id === 'bitono') && !currentItemConfig.bitonoColor) return true;
        }
        return false;
    }, [currentStep, currentItemConfig]);

    const handleStartNewItem = () => {
        setEditingItemId(null);
        setCurrentItemConfig(prev => ({...INITIAL_QUOTE_STATE, quantity: prev.quantity})); // Preserve quantity
        setCurrentStep(1);
    };

    const handleEditItem = (itemId: string) => {
        const itemToEdit = quoteItems.find(item => item.id === itemId);
        if (itemToEdit) {
            setEditingItemId(itemId);
            setCurrentItemConfig(itemToEdit);
            setCurrentStep(1); // Go back to the first configuration step
            setView('app'); // Ensure we are in the main app view
        }
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
            setQuoteItems(items => items.filter(item => item.id !== itemId));
        }
    };

    const handleFullQuoteReset = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar y descartar todo el presupuesto actual?')) {
            setQuoteItems([]);
            setCurrentItemConfig(INITIAL_QUOTE_STATE);
            setEditingItemId(null);
            setCurrentStep(0); // Go back to welcome screen
        }
    };
    
    // --- Save, PDF & Print ---
    const handleSaveQuote = useCallback((details: { customerName: string; projectReference: string }) => {
        if (!currentUser) return;
        const pvpTotalPrice = quoteItems.reduce((sum, item) => sum + (calculateBaseItemPrice(item) * item.quantity), 0);
        const newQuote: SavedQuote = {
            id: `quote_c_${Date.now()}`,
            timestamp: Date.now(),
            userEmail: currentUser.email,
            quoteItems,
            totalPrice,
            pvpTotalPrice,
            customerName: details.customerName,
            projectReference: details.projectReference,
            type: 'customer',
        };
        const allQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
        allQuotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(allQuotes));
        alert('Presupuesto guardado con éxito.');
        // After saving, reset everything and go to welcome page
        setQuoteItems([]);
        setCurrentItemConfig(INITIAL_QUOTE_STATE);
        setEditingItemId(null);
        setCurrentStep(0);
    }, [currentUser, quoteItems, totalPrice, calculateBaseItemPrice]);

    const handleGeneratePdf = useCallback(() => {
        if (!currentUser || quoteItems.length === 0) return;
        const pvpTotalPrice = quoteItems.reduce((sum, item) => sum + (calculateBaseItemPrice(item) * item.quantity), 0);
        const temporaryQuote: SavedQuote = {
            id: `quote_temp_${Date.now()}`,
            timestamp: Date.now(),
            userEmail: currentUser.email,
            quoteItems,
            totalPrice,
            pvpTotalPrice,
            customerName: 'Cliente (temporal)',
            type: 'customer'
        };
        setQuoteForPdf(temporaryQuote);
        setIsPdfPreviewModalOpen(true);
    }, [currentUser, quoteItems, totalPrice, calculateBaseItemPrice]);
    
    const handleViewPdfForSavedQuote = useCallback((quote: SavedQuote) => {
        setQuoteForPdf(quote);
        setIsPdfPreviewModalOpen(true);
    }, []);

    const handlePrint = () => window.print();

    const handleDuplicateQuote = (items: QuoteItem[]) => {
        setQuoteItems(items);
        setCurrentItemConfig(INITIAL_QUOTE_STATE);
        setCurrentStep(items.length > 0 ? SHOWER_TRAY_STEPS.length : 1);
        setView('app');
    };
    
    const handleActivatePromotion = (promoId: string) => {
        if (!currentUser || promoId !== PROMO_ID) return;
        if (window.confirm(`¿Activar la promoción de bienvenida? Durará ${PROMO_DURATION_DAYS} días a partir de ahora.`)) {
             updateUser({
                ...currentUser,
                promotion: { id: PROMO_ID, activationTimestamp: Date.now() }
            });
        }
    };
    
    const handleExportData = () => {
        if (!currentUser) return;
        const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const data = {
            quotes,
            users
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aqg_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read");
                const data = JSON.parse(text);
                if (data.users && data.quotes && window.confirm("¿Seguro que quieres reemplazar todos los datos? Esta acción es irreversible.")) {
                    localStorage.setItem('users', JSON.stringify(data.users));
                    localStorage.setItem('quotes', JSON.stringify(data.quotes));
                    alert("Datos importados con éxito. La página se recargará.");
                    window.location.reload();
                } else {
                    throw new Error("El archivo no tiene el formato correcto.");
                }
            } catch (err) {
                alert(`Error al importar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
            }
        };
        reader.readAsText(file);
    };


    // --- Render Logic ---
    if (!currentUser) {
        return (
            <main className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
                <AuthPage onLogin={handleLogin} />
            </main>
        );
    }
    
    const renderStepContent = () => {
        const isKitFlow = currentItemConfig.productLine === 'KITS Y ACCESORIOS';
        
        if (isKitFlow) {
            switch (currentStep) {
                case 1: return <Step1ModelSelection selectedProductLine={currentItemConfig.productLine} onUpdate={handleUpdateProductLine} quantity={currentItemConfig.quantity} onUpdateQuantity={(q) => handleUpdateItemConfig({ quantity: q })} />;
                case 2: return <Step2KitSelection selectedKit={currentItemConfig.kitProduct ?? null} onSelect={(kit) => handleUpdateItemConfig({ kitProduct: kit })} />;
                case 3: return <Step3KitDetails currentItemConfig={currentItemConfig} onSelectColor={(c) => handleUpdateItemConfig({ color: c, extras: currentItemConfig.extras.filter(e => e.id !== 'ral'), ralCode: undefined })} onToggleRal={() => handleToggleExtra(SHOWER_EXTRAS.find(e => e.id === 'ral')!)} onRalCodeChange={(c) => handleUpdateItemConfig({ ralCode: c })} onInvoiceRefChange={(ref) => handleUpdateItemConfig({ invoiceReference: ref })} />;
                default: return null;
            }
        }
        
        switch (currentStep) {
            case 1: return <Step1ModelSelection selectedProductLine={currentItemConfig.productLine} onUpdate={handleUpdateProductLine} quantity={currentItemConfig.quantity} onUpdateQuantity={(q) => handleUpdateItemConfig({ quantity: q })} />;
            case 2: return <Step1Dimensions quote={currentItemConfig} onUpdate={(w, l) => handleUpdateItemConfig({ width: w, length: l })} />;
            case 3: return <Step2Model onSelect={(m) => handleUpdateItemConfig({ model: m })} selectedModel={currentItemConfig.model} productLine={currentItemConfig.productLine} />;
            case 4: return <Step3Color onSelectColor={(c) => handleUpdateItemConfig({ color: c, extras: currentItemConfig.extras.filter(e => e.id !== 'ral'), ralCode: undefined })} selectedColor={currentItemConfig.color} productLine={currentItemConfig.productLine} onToggleRal={() => handleToggleExtra(SHOWER_EXTRAS.find(e => e.id === 'ral')!)} isRalSelected={currentItemConfig.extras.some(e => e.id === 'ral')} ralCode={currentItemConfig.ralCode ?? ''} onRalCodeChange={(code) => handleUpdateItemConfig({ ralCode: code })} />;
            case 5: return <Step4Extras onToggle={handleToggleExtra} selectedExtras={currentItemConfig.extras} productLine={currentItemConfig.productLine} mainColor={currentItemConfig.color} bitonoColor={currentItemConfig.bitonoColor} onSelectBitonoColor={(c) => handleUpdateItemConfig({ bitonoColor: c })} structFrames={currentItemConfig.structFrames} onUpdateStructFrames={(f) => handleUpdateItemConfig({ structFrames: f })} />;
            default: return null;
        }
    };
    
    const renderAppView = () => {
        // Welcome page if no quote is active
        if (currentStep === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center p-4">
                    <WelcomePage
                        userName={currentUser.companyName}
                        onNewQuote={resetCurrentItemAndStartOver}
                        onViewQuotes={() => setView('my_quotes')}
                        hasActiveQuote={isQuoteActive}
                        onResumeQuote={() => setView('app')}
                    />
                </div>
            );
        }

        const showSummary = currentStep === steps.length;
        return (
            <>
                <div className={`w-full overflow-y-auto main-content ${showSummary ? 'lg:w-full' : 'lg:w-3/5 xl:w-1/2 lg:pr-8'}`}>
                    {welcomePromoIsActive && currentUser.promotion && <PromotionBanner expirationDate={new Date(currentUser.promotion.activationTimestamp + (PROMO_DURATION_DAYS * 24 * 60 * 60 * 1000))} />}
                    
                    {/* Header for configuration steps */}
                    {!showSummary && (
                        <div className="mb-8">
                            <StepTracker currentStep={currentStep} steps={steps} onStepClick={(step) => setCurrentStep(step)} />
                        </div>
                    )}

                    {showSummary ? (
                        <Step5Summary items={quoteItems} totalPrice={totalPrice} onReset={handleFullQuoteReset} onSaveRequest={() => setIsSaveModalOpen(true)} onGeneratePdfRequest={handleGeneratePdf} onPrintRequest={handlePrint} onStartNew={handleStartNewItem} onEdit={handleEditItem} onDelete={handleDeleteItem} calculateItemPrice={(item) => calculateCustomerItemPrice(item, quoteItems, true)} />
                    ) : (
                        <>
                            {renderStepContent()}
                             <NextPrevButtons onNext={handleNext} onPrev={() => setCurrentStep(s => s - 1)} currentStep={currentStep} totalSteps={steps.length} isNextDisabled={isNextDisabled} isLastStep={currentStep === steps.length - 1} onDiscard={handleFullQuoteReset} />
                        </>
                    )}
                </div>
                {!showSummary && (
                   <div className="hidden lg:block lg:w-2/5 xl:w-1/2 pl-8 border-l border-slate-200">
                        <div className="sticky top-8">
                            <LivePreview item={currentItemConfig} price={currentItemPrice} />
                        </div>
                    </div>
                )}
            </>
        );
    }
    
    const renderMainView = () => {
        switch (view) {
            case 'my_quotes':
                return <MyQuotesPage user={currentUser} onDuplicateQuote={handleDuplicateQuote} onViewPdf={handleViewPdfForSavedQuote} calculateInternalItemPrice={calculateInternalItemPrice} />;
            case 'promotions':
                return <PromotionsPage user={currentUser} onActivatePromotion={handleActivatePromotion} />;
            case 'guides':
                return <MaintenanceGuidesPage />;
            case 'app':
            default:
                return renderAppView();
        }
    }

    const NavButton: React.FC<{ viewName: 'app' | 'my_quotes' | 'promotions' | 'guides'; label: string; icon: React.ReactNode; }> = ({ viewName, label, icon }) => (
        <button
            onClick={() => setView(viewName)}
            className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${view === viewName ? 'bg-teal-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            <aside className="sidebar w-64 bg-slate-800 text-white p-6 flex-col flex-shrink-0 hidden md:flex">
                <div className="flex-shrink-0">
                   <div className="h-12 w-auto flex items-center text-xl font-bold text-white">AQG Bathrooms</div>
                </div>
                
                <div className="mt-10 flex-grow">
                     <nav className="space-y-2">
                         <NavButton viewName="app" label="Inicio" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} />
                         <NavButton viewName="my_quotes" label="Mis Presupuestos" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>} />
                        <NavButton viewName="promotions" label="Promociones" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.111l-.473.175A2 2 0 002.13 6.06L4 9.799V14a2 2 0 002 2h8a2 2 0 002-2V9.8l1.87-3.74a2 2 0 00-1.397-2.774l-.473-.175V3a1 1 0 00-1-1H5zm2 5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>} />
                        <NavButton viewName="guides" label="Guías de Mantenimiento" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} />
                    </nav>
                </div>
                
                <div className="flex-shrink-0 space-y-3">
                    <div className="text-center text-sm border-t border-slate-700 pt-4">
                        <p className="font-semibold text-white">{currentUser.companyName}</p>
                        <p className="text-slate-400">{currentUser.email}</p>
                    </div>
                     <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                        Ajustes
                    </button>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
            <main className="flex-grow flex flex-col">
                 <div className="flex-grow p-4 sm:p-6 md:p-8 flex overflow-hidden">
                    {renderMainView()}
                 </div>
            </main>
            
            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} user={currentUser} onSave={handleSettingsSave} onExport={handleExportData} onImport={handleImportData} />
            <SaveQuoteModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onConfirm={handleSaveQuote} disabled={quoteItems.length === 0} />
            <PdfPreviewModal isOpen={isPdfPreviewModalOpen} onClose={() => setIsPdfPreviewModalOpen(false)} quote={quoteForPdf} user={currentUser} calculateItemPrice={calculateCustomerItemPrice} welcomePromoIsActive={welcomePromoIsActive} />
            <CustomQuoteModal isOpen={isCustomQuoteModalOpen} onClose={() => setIsCustomQuoteModalOpen(false)} />
        </div>
    );
};

export default App;
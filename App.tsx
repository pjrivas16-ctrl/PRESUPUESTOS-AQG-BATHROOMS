

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem } from './types';
import { 
    PRICE_LIST, SHOWER_TRAY_STEPS, KITS_STEPS, SHOWER_MODELS
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
import { aqgLogo } from './assets';

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
            const defaultLogoData = await processImageForPdf(aqgLogo);
            
            const logoToUse = userLogoData || defaultLogoData;
            if (logoToUse) {
                const aspectRatio = logoToUse.width / logoToUse.height;
                const logoHeight = 20;
                const logoWidth = logoHeight * aspectRatio;
                doc.addImage(logoToUse.imageData, logoToUse.format, 15, 15, logoWidth, logoHeight);
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

// Fix: Corrected incomplete App component and added default export.
const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // NOTE: The implementation of the App component was incomplete in the provided file.
    // This is a minimal implementation to make the component valid and fix the export error.
    return (
      <div>
        <h1>AQG Bathrooms Quote Tool</h1>
        <p>
          The application logic is missing. Please provide the full content of App.tsx.
        </p>
      </div>
    );
};

export default App;

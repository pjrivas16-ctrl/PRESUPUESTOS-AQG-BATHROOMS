import React, { useMemo } from 'react';
import type { QuoteItem, PriceDetails } from '../../types';

interface Step5SummaryProps {
    items: QuoteItem[];
    totalPrice: number;
    onReset: () => void;
    onSaveRequest: () => void;
    onGeneratePdfRequest: () => void;
    onPrintRequest: () => void;
    onStartNew: () => void;
    onEdit: (itemId: string) => void;
    onDelete: (itemId: string) => void;
    calculatePriceDetails: (item: QuoteItem) => PriceDetails;
    appliedDiscounts: { [key: string]: number };
    onUpdateDiscounts: (discounts: { [key: string]: number }) => void;
}


const QuoteItemCard: React.FC<{ item: QuoteItem; onEdit: () => void; onDelete: () => void; priceDetails: PriceDetails; }> = ({ item, onEdit, onDelete, priceDetails }) => {
    const isKitProduct = item.productLine === 'KITS';

    const renderExtras = () => {
        if (!item.extras || item.extras.length === 0) return null;

        const extrasList = item.extras.map(e => {
            if (e.id === 'bitono' && item.bitonoColor) return `Tapa bitono: ${item.bitonoColor.name}`;
            return e.name;
        }).join(', ');

        return <p className="text-xs text-slate-400 mt-1">({extrasList})</p>;
    };

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
                <div>
                    {isKitProduct ? (
                        <>
                            <h4 className="font-bold text-slate-800">{item.kitProduct?.name} ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</h4>
                            {(item.kitProduct?.id === 'kit-pintura' || item.kitProduct?.id === 'kit-reparacion') && <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>}
                            {item.invoiceReference && <p className="text-sm text-slate-500">Ref. Factura: {item.invoiceReference}</p>}
                        </>
                    ) : (
                        <>
                            <h4 className="font-bold text-slate-800">{item.productLine} - {item.model?.name}</h4>
                            <p className="text-sm text-slate-500">{item.width}cm x {item.length}cm ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</p>
                            {item.cutWidth && item.cutLength && (
                                <p className="text-sm text-slate-500 font-medium">Corte a: <span className="text-teal-600">{item.cutWidth}cm x {item.cutLength}cm</span></p>
                            )}
                            <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>
                            {item.productLine === 'STRUCT DETAIL' && <p className="text-sm text-slate-500">Marcos: {item.structFrames}</p>}
                            {renderExtras()}
                        </>
                    )}
                </div>
                 <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800">{priceDetails.finalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    {priceDetails.discountPercent > 0 && (
                        <>
                            <p className="text-xs text-green-600 font-semibold">{priceDetails.discountPercent.toFixed(2)}% Dto.</p>
                            <p className="text-xs text-slate-400 line-through">
                                {(priceDetails.basePrice * 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </>
                    )}
                    <p className="text-xs text-slate-400">IVA incl.</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 no-print">
                 <button onClick={onEdit} className="text-xs font-semibold text-teal-600 hover:underline">Editar</button>
                 <span className="text-slate-300">|</span>
                 <button onClick={onDelete} className="text-xs font-semibold text-red-600 hover:underline">Eliminar</button>
            </div>
        </div>
    )
}


const Step5Summary: React.FC<Step5SummaryProps> = ({ 
    items, 
    totalPrice, 
    onReset, 
    onSaveRequest, 
    onGeneratePdfRequest,
    onPrintRequest,
    onStartNew,
    onEdit,
    onDelete,
    calculatePriceDetails,
    appliedDiscounts,
    onUpdateDiscounts,
}) => {
    
    const VAT_RATE = 0.21;
    const basePrice = totalPrice / (1 + VAT_RATE);
    const taxAmount = totalPrice - basePrice;

    const productLinesInQuote = useMemo(() => {
        const lines = new Set(items.map(item => item.productLine).filter(Boolean));
        return Array.from(lines) as string[];
    }, [items]);

    const handleDiscountChange = (line: string, value: string) => {
        const percentage = parseFloat(value);
        const newDiscounts = { ...appliedDiscounts };

        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
            newDiscounts[line] = percentage;
        } else {
            // If the value is empty or invalid, remove the discount for that line
            delete newDiscounts[line];
        }
        onUpdateDiscounts(newDiscounts);
    };

    return (
        <div id="printable-summary" className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Resumen de tu presupuesto</h2>
            <p className="text-slate-500 mb-8">Revisa los artículos de tu presupuesto. Puedes añadir más, editarlos o guardarlo.</p>

            <div className="space-y-4 mb-6">
                {items.map(item => (
                    <QuoteItemCard 
                        key={item.id} 
                        item={item} 
                        onEdit={() => onEdit(item.id)}
                        onDelete={() => onDelete(item.id)}
                        priceDetails={calculatePriceDetails(item)}
                    />
                ))}
            </div>

            {items.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                    <h3 className="text-lg font-medium text-slate-800">Tu presupuesto está vacío</h3>
                    <p className="mt-1 text-sm text-slate-500">Añade un modelo para empezar.</p>
                </div>
            ) : (
                <>
                    <div className="mt-6 pt-6 border-t border-dashed border-slate-200 no-print">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Aplicar Descuentos</h3>
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            {productLinesInQuote.map(line => (
                                <div key={line} className="flex items-center justify-between">
                                    <label htmlFor={`discount-${line}`} className="font-medium text-slate-700">{line}</label>
                                    <div className="relative w-28">
                                        <input
                                            id={`discount-${line}`}
                                            type="number"
                                            value={appliedDiscounts[line] || ''}
                                            onChange={(e) => handleDiscountChange(line, e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="w-full p-2 text-right border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition pr-6"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 space-y-4 mt-6">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Base imponible</span>
                            <span>{basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>IVA (21%)</span>
                            <span>{taxAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-slate-800 pt-3 mt-3 border-t border-slate-300">
                            <span>Total Presupuesto</span>
                            <span className="text-teal-600">
                                {totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </span>
                        </div>
                    </div>
                </>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
                <button
                    onClick={onStartNew}
                    className="w-full px-4 py-3 font-semibold text-teal-600 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Añadir otro artículo
                </button>
                 <button
                    onClick={onReset}
                    className="w-full px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Vaciar presupuesto
                </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-dashed border-slate-200 no-print">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-4 text-center">Acciones del Presupuesto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <button
                        onClick={onSaveRequest}
                        disabled={items.length === 0}
                        className="w-full px-4 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 flex items-center justify-center gap-2"
                    >
                        Guardar Presupuesto
                    </button>
                     <button
                        onClick={onGeneratePdfRequest}
                        disabled={items.length === 0}
                        className="w-full px-4 py-3 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:bg-slate-300 disabled:text-slate-500 flex items-center justify-center gap-2"
                    >
                        Descargar PDF
                    </button>
                     <button
                        onClick={onPrintRequest}
                        disabled={items.length === 0}
                        className="w-full px-4 py-3 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:bg-slate-300 disabled:text-slate-500 flex items-center justify-center gap-2"
                    >
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step5Summary;
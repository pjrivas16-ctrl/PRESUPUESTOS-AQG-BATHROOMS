import React from 'react';
import type { QuoteItem } from '../../types';

interface Step5SummaryProps {
    items: QuoteItem[];
    totalPrice: number;
    onReset: () => void;
    onSaveRequest: () => void;
    onGeneratePdfRequest: () => void;
    onGenerateCustomerQuoteRequest: () => void;
    onStartNew: () => void;
    onEdit: (itemId: string) => void;
    onDelete: (itemId: string) => void;
    calculateItemPrice: (item: QuoteItem) => number;
}


const QuoteItemCard: React.FC<{ item: QuoteItem; onEdit: () => void; onDelete: () => void; price: number; }> = ({ item, onEdit, onDelete, price }) => {
    const isKitProduct = item.productLine === 'KITS Y ACCESORIOS';

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
                <div>
                    {isKitProduct ? (
                        <>
                            <h4 className="font-bold text-slate-800">{item.kitProduct?.name} ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</h4>
                            {item.kitProduct?.id === 'kit-pintura' && <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>}
                            {item.invoiceReference && <p className="text-sm text-slate-500">Ref. Factura: {item.invoiceReference}</p>}
                        </>
                    ) : (
                        <>
                            <h4 className="font-bold text-slate-800">{item.productLine} - {item.model?.name}</h4>
                            <p className="text-sm text-slate-500">{item.width}cm x {item.length}cm ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</p>
                            <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>
                            {item.productLine === 'STRUCT DETAIL' && <p className="text-sm text-slate-500">Marcos: {item.structFrames}</p>}
                            {item.extras.length > 0 && 
                                <p className="text-xs text-slate-400 mt-1">
                                    ({item.extras.map(e => {
                                        if (e.id === 'bitono' && item.bitonoColor) {
                                            return `Tapa bitono: ${item.bitonoColor.name}`;
                                        }
                                        return e.name;
                                    }).join(', ')})
                                </p>
                            }
                        </>
                    )}
                </div>
                 <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800">{price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    <p className="text-xs text-slate-400">IVA incl.</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
    onGenerateCustomerQuoteRequest,
    onStartNew,
    onEdit,
    onDelete,
    calculateItemPrice,
}) => {
    
    const VAT_RATE = 0.21;
    const basePrice = totalPrice / (1 + VAT_RATE);
    const taxAmount = totalPrice - basePrice;

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Resumen de tu presupuesto</h2>
            <p className="text-slate-500 mb-8">Revisa los artículos de tu presupuesto. Puedes añadir más, editarlos o guardarlo.</p>

            <div className="space-y-4 mb-6">
                {items.map(item => (
                    <QuoteItemCard 
                        key={item.id} 
                        item={item} 
                        onEdit={() => onEdit(item.id)}
                        onDelete={() => onDelete(item.id)}
                        price={calculateItemPrice(item)}
                    />
                ))}
            </div>

            {items.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                    <h3 className="text-lg font-medium text-slate-800">Tu presupuesto está vacío</h3>
                    <p className="mt-1 text-sm text-slate-500">Añade un modelo para empezar.</p>
                </div>
            ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Base imponible</span>
                        <span>{basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>IVA (21%)</span>
                        <span>{taxAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="border-t border-slate-300 !my-3"></div>
                    <div className="flex justify-between items-center text-xl font-bold text-slate-800">
                        <span>Total Presupuesto</span>
                        <span className="text-teal-600">
                            {totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-4 text-center">Acciones del Presupuesto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 flex flex-col">
                        <h4 className="font-bold text-slate-700">Presupuesto Interno (Fábrica)</h4>
                        <p className="text-xs text-slate-500 mb-3 flex-grow">Guardar o generar un PDF con tus condiciones especiales.</p>
                        <div className="space-y-2">
                             <button
                                onClick={onSaveRequest}
                                disabled={items.length === 0}
                                className="w-full px-4 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300"
                            >
                                Guardar Presupuesto
                            </button>
                             <button
                                onClick={onGeneratePdfRequest}
                                disabled={items.length === 0}
                                className="w-full px-4 py-3 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:bg-slate-300 disabled:text-slate-500"
                            >
                                Descargar PDF Interno
                            </button>
                        </div>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 flex flex-col">
                        <h4 className="font-bold text-teal-800">Presupuesto para Cliente</h4>
                        <p className="text-xs text-teal-600 mb-3 flex-grow">Generar un PDF para tu cliente final aplicando descuentos sobre el PVP.</p>
                         <button
                            onClick={onGenerateCustomerQuoteRequest}
                            disabled={items.length === 0}
                            className="w-full px-4 py-3 font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-teal-300"
                        >
                            Crear PDF para Cliente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5Summary;
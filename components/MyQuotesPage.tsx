


import React, { useState, useEffect, useMemo } from 'react';
import type { User, SavedQuote, QuoteItem } from '../types';

interface MyQuotesPageProps {
    user: User;
    onDuplicateQuote: (quote: SavedQuote) => void;
    onViewPdf: (quote: SavedQuote) => void;
}


const MyQuotesPage: React.FC<MyQuotesPageProps> = ({ user, onDuplicateQuote, onViewPdf }) => {
    const [allQuotes, setAllQuotes] = useState<SavedQuote[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'ordered' | 'pending'>('all');

    useEffect(() => {
        try {
            const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
            const userQuotes = storedQuotes
                .filter(q => q.userEmail === user.email)
                .sort((a, b) => b.timestamp - a.timestamp);
            
            setAllQuotes(userQuotes);
        } catch (error) {
            console.error("Failed to load quotes from localStorage", error);
        }
    }, [user.email]);

    const stats = useMemo(() => {
        const ordered = allQuotes.filter(q => q.orderedTimestamp).length;
        const total = allQuotes.length;
        return {
            total,
            ordered,
            pending: total - ordered,
        };
    }, [allQuotes]);

    const filteredQuotes = useMemo(() => {
        let quotes = allQuotes;

        if (filter === 'ordered') {
            quotes = quotes.filter(q => q.orderedTimestamp);
        } else if (filter === 'pending') {
            quotes = quotes.filter(q => !q.orderedTimestamp);
        }

        if (!searchTerm) return quotes;
        
        const lowercasedFilter = searchTerm.toLowerCase();
        return quotes.filter(quote => 
            (quote.id.toLowerCase().includes(lowercasedFilter)) ||
            (quote.customerName?.toLowerCase().includes(lowercasedFilter)) ||
            (quote.fiscalName?.toLowerCase().includes(lowercasedFilter)) ||
            (quote.projectReference?.toLowerCase().includes(lowercasedFilter))
        );
    }, [allQuotes, searchTerm, filter]);


    const handleToggleOrdered = (quoteId: string) => {
        const timestamp = Date.now();
        
        const updatedQuotes = allQuotes.map(q => 
            q.id === quoteId ? { ...q, orderedTimestamp: q.orderedTimestamp ? undefined : timestamp } : q
        );
        setAllQuotes(updatedQuotes);

        if (selectedQuote?.id === quoteId) {
            setSelectedQuote(prev => prev ? { ...prev, orderedTimestamp: prev.orderedTimestamp ? undefined : timestamp } : null);
        }

        try {
            const allStoredQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
            const quotesToSave = allStoredQuotes.map(q => 
                q.id === quoteId ? { ...q, orderedTimestamp: q.orderedTimestamp ? undefined : timestamp } : q
            );
            localStorage.setItem('quotes', JSON.stringify(quotesToSave));
        } catch (error) {
            console.error("Failed to update quote in localStorage", error);
        }
    };
    
    const handleDuplicate = () => {
        if (!selectedQuote) return;
        onDuplicateQuote(selectedQuote);
    };

    const handleDeleteQuote = (quoteId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto? Esta acción es permanente.')) {
            const updatedQuotes = allQuotes.filter(q => q.id !== quoteId);
            setAllQuotes(updatedQuotes);
            setSelectedQuote(null);
            
            try {
                const allStoredQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
                const quotesToSave = allStoredQuotes.filter(q => q.id !== quoteId);
                localStorage.setItem('quotes', JSON.stringify(quotesToSave));
            } catch (error) {
                console.error("Failed to delete quote from localStorage", error);
                alert("Hubo un error al eliminar el presupuesto.");
                // Optionally, revert state if localStorage fails
                setAllQuotes(allQuotes);
            }
        }
    };

    const renderModal = () => {
        if (!selectedQuote) return null;

        const { quoteItems } = selectedQuote;
        const quoteNumber = selectedQuote.id.replace(/quote_i_|quote_c_/g, '');
        const clientIdentifier = user.fiscalName || user.companyName;
        
        const subject = `Nuevo Pedido de ${clientIdentifier} - Presupuesto Nº ${quoteNumber}`;
        
        let body = `Hola,\n\n` +
                   `El comercial ${user.preparedBy || user.companyName} ha solicitado tramitar el pedido correspondiente al presupuesto Nº ${quoteNumber}.\n\n`;
        
        if (user.sucursal) {
            body += `Sucursal Comercial: ${user.sucursal}\n\n`;
        }
        
        body += `--- DATOS DEL CLIENTE FINAL ---\n` +
                `Nombre Fiscal: ${selectedQuote.fiscalName || 'No especificado'}\n` +
                `Nombre Comercial: ${selectedQuote.customerName || 'No especificado'}\n` +
                `Población/Sucursal: ${selectedQuote.sucursal || 'No especificada'}\n`;

        if (selectedQuote.projectReference) {
            body += `Referencia del Proyecto: ${selectedQuote.projectReference}\n`;
        }
        
        if(selectedQuote.deliveryAddress) {
            body += `\nDIRECCIÓN DE ENTREGA:\n${selectedQuote.deliveryAddress}\n`;
        } else {
            body += `\n(Utilizar dirección principal del cliente para la entrega)\n`;
        }

        body += `\n--- DETALLES DEL PEDIDO ---\n`;


        quoteItems.forEach((item, index) => {
             body += `\nArtículo ${index + 1}: `;
            if (item.productLine === 'KITS') {
                body += `${item.kitProduct?.name}\n` +
                        `- Unidades: ${item.quantity || 1}\n`;
                if(item.kitProduct?.id === 'kit-pintura' || item.kitProduct?.id === 'kit-reparacion') {
                    body += `- Color: ${item.color?.name || `RAL ${item.ralCode}`}\n`;
                }
                if(item.invoiceReference) {
                    body += `- Ref. Factura: ${item.invoiceReference}\n`;
                }
            } else {
                body += `Plato de ducha ${item.productLine}\n` +
                        `- Unidades: ${item.quantity || 1}\n` +
                        `- Textura: ${item.model?.name}\n` +
                        `- Dimensiones: ${item.width}x${item.length}cm\n`;
                if (item.cutWidth && item.cutLength) {
                    body += `- Corte a medida: ${item.cutWidth}x${item.cutLength}cm\n`;
                }
                body += `- Color: ${item.color?.name || `RAL ${item.ralCode}`}\n`;

                if (item.extras.length > 0) {
                    body += `  Extras:\n`;
                    item.extras.forEach(extra => {
                        let extraLine = `  - ${extra.name}`;
                        if (extra.id === 'bitono') {
                            if (item.bitonoColor) extraLine += ` (Tapa: ${item.bitonoColor.name})`;
                        }
                        body += `${extraLine}\n`;
                    });
                }
            }
        });
        
        
        body += `\n--- DESCUENTOS APLICADOS ---\n`;
        if (selectedQuote.customerDiscounts && Object.keys(selectedQuote.customerDiscounts).length > 0) {
            for (const [line, discount] of Object.entries(selectedQuote.customerDiscounts)) {
                body += `${line}: ${discount}%\n`;
            }
        } else {
            body += `Aplicar descuentos por defecto de la ficha del cliente.\n`;
        }

        body += `\n--- TOTALES ---\n` +
                `Subtotal (PVP): ${ (selectedQuote.pvpTotalPrice || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }\n` +
                `Base Imponible (con Dtos.): ${ (selectedQuote.totalPrice / 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }\n` +
                `Total (IVA Incl.): ${ selectedQuote.totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }\n\n` +
                `Gracias.`;

        const mailtoLink = `mailto:sandra.martinez@aqgbathrooms.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedQuote(null)}>
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-xl font-bold text-slate-800">Detalles del Presupuesto</h3>
                             <p className="text-sm text-slate-500">Nº <span className="font-semibold">{quoteNumber}</span></p>
                             <p className="text-sm text-slate-500">Cliente: <span className="font-semibold">{selectedQuote.fiscalName || selectedQuote.customerName}</span></p>
                             {selectedQuote.sucursal && <p className="text-xs text-slate-500">Sucursal: {selectedQuote.sucursal}</p>}
                             {selectedQuote.projectReference && <p className="text-xs text-slate-500">Ref: {selectedQuote.projectReference}</p>}
                             {selectedQuote.deliveryAddress && <p className="text-xs text-slate-500 mt-2"><b>Entrega:</b> {selectedQuote.deliveryAddress}</p>}
                        </div>
                        <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                    </div>
                    
                    {selectedQuote.orderedTimestamp && (
                        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm font-semibold text-center">
                            Confirmado como pedido el {new Date(selectedQuote.orderedTimestamp).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                        </div>
                    )}

                    <div className="mt-6 border-t border-slate-200">
                        {quoteItems.map((item, index) => (
                             <div key={item.id} className="py-4 border-b border-slate-200 last:border-b-0">
                                <h4 className="font-bold text-teal-700 mb-2">Artículo {index + 1}: {item.productLine === 'KITS' ? item.kitProduct?.name : `${item.productLine} - ${item.model?.name}`}</h4>
                                {item.productLine !== 'KITS' ? (
                                    <>
                                        <p className="text-sm text-slate-500">{item.width}cm x {item.length}cm &bull; ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</p>
                                        {item.cutWidth && item.cutLength && (
                                            <p className="text-sm text-slate-500 font-medium">Corte a: <span className="text-teal-600">{item.cutWidth}cm x {item.cutLength}cm</span></p>
                                        )}
                                        <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>
                                        {item.extras.length > 0 && <p className="text-xs text-slate-400 mt-1">Extras: {item.extras.map(e => e.name).join(', ')}</p>}
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-500">({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</p>
                                        {(item.kitProduct?.id === 'kit-pintura' || item.kitProduct?.id === 'kit-reparacion') && <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>}
                                        {item.invoiceReference && <p className="text-sm text-slate-500">Ref. Factura: {item.invoiceReference}</p>}
                                    </>
                                )}
                             </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200 text-right">
                        {selectedQuote.type === 'customer' && selectedQuote.pvpTotalPrice && (
                             <div className="text-sm text-slate-500">Subtotal (PVP): <span className="font-semibold">{selectedQuote.pvpTotalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                        )}
                        <div className="text-lg font-bold text-slate-800">Total (IVA Incl.): <span className="text-teal-600">{selectedQuote.totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
                         <button 
                            onClick={() => handleDeleteQuote(selectedQuote.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                        </button>
                        <div className="flex flex-wrap justify-end gap-3">
                            <button onClick={handleDuplicate} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Duplicar</button>
                            <button onClick={() => onViewPdf(selectedQuote)} className="px-4 py-2 text-sm font-semibold text-teal-600 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors">Ver PDF</button>
                            <button onClick={() => handleToggleOrdered(selectedQuote.id)} className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors ${selectedQuote.orderedTimestamp ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-700 hover:bg-slate-800'}`}>
                                {selectedQuote.orderedTimestamp ? 'Desmarcar Pedido' : 'Marcar como Pedido'}
                            </button>
                            <a href={mailtoLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors inline-block">
                                Tramitar Pedido
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const StatCard: React.FC<{label: string; value: number; color: string}> = ({label, value, color}) => (
        <div className={`bg-white border-l-4 ${color} p-4 rounded-r-lg shadow-sm`}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    );

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="flex-shrink-0">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Mis Presupuestos</h2>
                <p className="text-slate-500 mb-6">Gestiona tus presupuestos guardados. Puedes ver los detalles, duplicarlos o tramitar el pedido.</p>
                
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Total" value={stats.total} color="border-teal-500" />
                    <StatCard label="Pedidos" value={stats.ordered} color="border-green-500" />
                    <StatCard label="Pendientes" value={stats.pending} color="border-amber-500" />
                </div>
                
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por cliente, referencia o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    />
                </div>

                <div className="flex space-x-2">
                    {(['all', 'ordered', 'pending'] as const).map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                        >
                           { {all: 'Todos', ordered: 'Pedidos', pending: 'Pendientes'}[f] }
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pt-6 -mx-4 px-4 pb-4">
                {filteredQuotes.length > 0 ? (
                    <div className="space-y-3">
                        {filteredQuotes.map(quote => (
                            <div 
                                key={quote.id} 
                                onClick={() => setSelectedQuote(quote)} 
                                className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="font-bold text-slate-800">{quote.fiscalName || quote.customerName}</p>
                                        <p className="text-sm text-slate-500">{quote.customerName && quote.fiscalName ? quote.customerName : quote.projectReference}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(quote.timestamp).toLocaleDateString('es-ES')} - ID: {quote.id.replace(/quote_i_|quote_c_/g, '')}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-slate-800">
                                            {quote.totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </p>
                                        {quote.orderedTimestamp && (
                                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Pedido
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
                        <h3 className="text-lg font-medium text-slate-800">No hay presupuestos que mostrar</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {searchTerm ? 'Prueba con otro término de búsqueda.' : 'Crea un nuevo presupuesto para empezar.'}
                        </p>
                    </div>
                )}
            </div>
            
            {renderModal()}
        </div>
    );
};

export default MyQuotesPage;
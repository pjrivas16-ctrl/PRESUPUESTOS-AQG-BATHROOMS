import React, { useState, useEffect, useMemo } from 'react';
import type { User, SavedQuote, QuoteItem } from '../types';

interface MyQuotesPageProps {
    user: User;
    onDuplicateQuote: (quoteItems: QuoteItem[]) => void;
    onViewPdf: (quote: SavedQuote) => void;
    calculateInternalItemPrice: (item: QuoteItem, allItems: QuoteItem[]) => number;
}


const MyQuotesPage: React.FC<MyQuotesPageProps> = ({ user, onDuplicateQuote, onViewPdf, calculateInternalItemPrice }) => {
    const [internalQuotes, setInternalQuotes] = useState<SavedQuote[]>([]);
    const [customerQuotes, setCustomerQuotes] = useState<SavedQuote[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'internal' | 'customer'>('internal');

    useEffect(() => {
        try {
            const allQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
            const userQuotes = allQuotes
                .filter(q => q.userEmail === user.email)
                .sort((a, b) => b.timestamp - a.timestamp);
            
            setInternalQuotes(userQuotes.filter(q => q.type === 'internal' || !q.type));
            setCustomerQuotes(userQuotes.filter(q => q.type === 'customer'));
        } catch (error) {
            console.error("Failed to load quotes from localStorage", error);
        }
    }, [user.email]);

    const quotesToDisplay = activeTab === 'internal' ? internalQuotes : customerQuotes;

    const filteredQuotes = useMemo(() => {
        if (!searchTerm) return quotesToDisplay;
        const lowercasedFilter = searchTerm.toLowerCase();
        return quotesToDisplay.filter(quote => 
            (quote.id.toLowerCase().includes(lowercasedFilter)) ||
            (quote.customerName?.toLowerCase().includes(lowercasedFilter)) ||
            (quote.projectReference?.toLowerCase().includes(lowercasedFilter))
        );
    }, [quotesToDisplay, searchTerm]);


    const handleToggleOrdered = (quoteId: string) => {
        const timestamp = Date.now();
        const updateQuotes = (quotesList: SavedQuote[]) => 
            quotesList.map(q => 
                q.id === quoteId ? { ...q, orderedTimestamp: q.orderedTimestamp ? undefined : timestamp } : q
            );

        if (activeTab === 'internal') {
            setInternalQuotes(updateQuotes(internalQuotes));
        } else {
            setCustomerQuotes(updateQuotes(customerQuotes));
        }

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
        const duplicatedItems = JSON.parse(JSON.stringify(selectedQuote.quoteItems));
        onDuplicateQuote(duplicatedItems);
    };

    const renderModal = () => {
        if (!selectedQuote) return null;

        const { quoteItems } = selectedQuote;
        const quoteNumber = selectedQuote.id.replace(/quote_i_|quote_c_/g, '');
        const isCustomerQuote = selectedQuote.type === 'customer';

        const subject = `Pedido para Presupuesto: ${selectedQuote.projectReference || quoteNumber}`;
        
        let body = `Hola,\n\nPor favor, tramiten el siguiente pedido para el cliente ${selectedQuote.customerName}:\n\n` +
                     `Referencia: ${selectedQuote.projectReference || 'N/A'}\n` +
                     `Nº Presupuesto: ${quoteNumber}\n\n` +
                     `--- DETALLES DEL PEDIDO ---\n`;

        quoteItems.forEach((item, index) => {
            body += `\nArtículo ${index + 1}: Plato de ducha ${item.productLine}\n` +
                    `- Unidades: ${item.quantity || 1}\n` +
                    `- Textura: ${item.model?.name}\n` +
                    `- Dimensiones: ${item.width}x${item.length}cm\n` +
                    `- Color: ${item.color?.name || `RAL ${item.ralCode}`}\n`;

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
        });
        
        const internalTotalBase = quoteItems.reduce((sum, item) => sum + calculateInternalItemPrice(item, quoteItems), 0);
        const internalTotal = internalTotalBase * 1.21;

        body += `\n--- FIN DETALLES ---\n\n` +
                `Preparado por: ${user.companyName} (${user.email})\n`;

        if (user.preparedBy) {
            body += `Contacto: ${user.preparedBy}\n`;
        }
        
        body += `\nTotal (condiciones internas): ${internalTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}\n\n` +
                `Gracias.`;

        const mailtoLink = `mailto:sandra.martinez@aqgbathrooms.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedQuote(null)}>
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-xl font-bold text-slate-800">Detalles del Presupuesto {isCustomerQuote ? ' (Cliente)' : '(Interno)'}</h3>
                             <p className="text-sm text-slate-500">Nº <span className="font-semibold">{isCustomerQuote ? 'C-' : ''}{quoteNumber}</span></p>
                             <p className="text-sm text-slate-500">Para: <span className="font-semibold">{selectedQuote.customerName}</span></p>
                             {selectedQuote.projectReference && <p className="text-xs text-slate-500">Ref: {selectedQuote.projectReference}</p>}
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
                             <div key={item.id} className="py-4 border-b border-slate-200">
                                <h4 className="font-bold text-teal-700 mb-2">Artículo {index+1}: {item.productLine}</h4>
                                <div className="pl-4 border-l-2 border-teal-100 space-y-1 text-sm">
                                    <p><span className="text-slate-500">Dimensiones:</span> <span className="font-medium text-slate-800">{item.width}cm x {item.length}cm</span></p>
                                    <p><span className="text-slate-500">Textura:</span> <span className="font-medium text-slate-800">{item.model?.name}</span></p>
                                    <p><span className="text-slate-500">Color:</span> <span className="font-medium text-slate-800">{item.color?.name || `RAL ${item.ralCode}`}</span></p>
                                    <p><span className="text-slate-500">Unidades:</span> <span className="font-medium text-slate-800">{item.quantity}</span></p>
                                    {item.extras.length > 0 && <p><span className="text-slate-500">Extras:</span> <span className="font-medium text-slate-800">{item.extras.map(e => e.name).join(', ')}</span></p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 bg-slate-50 p-4 rounded-lg space-y-2">
                        {isCustomerQuote ? (
                            <>
                                <div className="flex justify-between items-center text-sm text-slate-600"><span>Subtotal (PVP)</span><span>{selectedQuote.pvpTotalPrice?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                                <div className="flex justify-between items-center text-sm text-slate-600"><span>Descuento</span><span className="text-red-600">-{((selectedQuote.pvpTotalPrice || 0) - (selectedQuote.totalPrice / 1.21)).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                                <div className="border-t border-slate-200 !my-2"></div>
                                <div className="flex justify-between items-center text-sm font-semibold text-slate-800"><span>Base Imponible</span><span>{(selectedQuote.totalPrice / 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                            </>
                        ) : (
                             <div className="flex justify-between items-center text-sm font-semibold text-slate-800"><span>Base Imponible</span><span>{(selectedQuote.totalPrice / 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                        )}
                         <div className="flex justify-between items-center text-sm text-slate-600"><span>IVA (21%)</span><span>{(selectedQuote.totalPrice - selectedQuote.totalPrice / 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                         <div className="border-t-2 border-slate-200 !my-3"></div>
                         <div className="flex justify-between items-center text-xl font-bold"><span>TOTAL</span><span className="text-teal-600">{selectedQuote.totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                        <button
                            onClick={() => handleToggleOrdered(selectedQuote.id)}
                            className={`w-full col-span-2 md:col-span-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${selectedQuote.orderedTimestamp ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                            {selectedQuote.orderedTimestamp ? 'Desmarcar' : 'Pedido'}
                        </button>
                         <button
                            onClick={handleDuplicate}
                            className="w-full px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                         >
                            Duplicar
                         </button>
                         <button
                            onClick={() => onViewPdf(selectedQuote)}
                            className="w-full px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                        >
                            Ver PDF
                        </button>
                        <a
                            href={mailtoLink}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full col-span-2 px-4 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors text-center text-sm flex items-center justify-center"
                        >
                            Enviar Pedido
                        </a>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Mis Presupuestos</h2>
                <p className="text-slate-500 mt-2">Busca, visualiza y gestiona tu historial de cotizaciones.</p>
            </div>
            
             <div className="mb-4">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('internal')}
                        className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'internal' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Presupuestos Internos
                    </button>
                    <button
                        onClick={() => setActiveTab('customer')}
                        className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'customer' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Presupuestos para Clientes
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por cliente, referencia o ID..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 focus:border-teal-500 transition"
                />
            </div>
            
            {filteredQuotes.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-slate-800">
                        {searchTerm ? 'No se encontraron resultados' : `No tienes ${activeTab === 'internal' ? 'presupuestos internos' : 'presupuestos de cliente'} guardados`}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {searchTerm ? 'Prueba con otros términos de búsqueda.' : 'Crea un nuevo presupuesto para verlo aquí.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredQuotes.map(savedQuote => (
                        <div 
                            key={savedQuote.id}
                            onClick={() => setSelectedQuote(savedQuote)}
                            className="w-full text-left bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedQuote(savedQuote)}
                            aria-label={`Ver detalles del presupuesto para ${savedQuote.customerName}`}
                        >
                           <div className="flex justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {savedQuote.orderedTimestamp && (
                                            <span className="flex-shrink-0 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                                                PEDIDO EL {new Date(savedQuote.orderedTimestamp).toLocaleDateString('es-ES')}
                                            </span>
                                        )}
                                        <p className="font-bold text-slate-800">
                                           {savedQuote.customerName}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {savedQuote.projectReference ? `Ref: ${savedQuote.projectReference}` : `Nº Presupuesto: ${savedQuote.id.replace(/quote_i_|quote_c_/g, '')}`}
                                    </p>
                                     <p className="text-xs text-slate-400 mt-1">
                                        {new Date(savedQuote.timestamp).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-bold text-teal-600">
                                        {savedQuote.totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                    </p>
                                    <p className="text-xs text-slate-400">{savedQuote.quoteItems.length} artículo(s)</p>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            )}
            {renderModal()}
        </div>
    );
};

export default MyQuotesPage;
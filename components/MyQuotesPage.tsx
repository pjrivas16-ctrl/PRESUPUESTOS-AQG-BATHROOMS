import React, { useState, useEffect, useMemo } from 'react';
import type { User, SavedQuote, QuoteItem } from '../types';
import { VAT_RATE } from '../constants';

interface MyQuotesPageProps {
    user: User;
    onDuplicateQuote: (quote: SavedQuote) => void;
    onViewPdf: (quote: SavedQuote) => void;
    onGenerateAndDownloadPdf: (quote: SavedQuote) => void;
}

const SendEmailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Enviar Presupuesto por Email</h3>
                        <p className="text-sm text-slate-500">Sigue los pasos para enviar el documento.</p>
                    </div>
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <p>
                        Por limitaciones de seguridad del navegador, el proceso es en dos pasos:
                    </p>
                    <p>
                        1. Al pulsar el botón, <strong>se descargará el PDF</strong> del presupuesto en tu dispositivo.
                    </p>
                    <p>
                        2. Inmediatamente después, <strong>se abrirá tu programa de correo</strong> con un email listo para que puedas <strong>adjuntar el PDF descargado</strong> y enviarlo.
                    </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                        Cancelar
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }} 
                        className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                        Descargar PDF y Abrir Email
                    </button>
                </div>
            </div>
        </div>
    );
};


const MyQuotesPage: React.FC<MyQuotesPageProps> = ({ user, onDuplicateQuote, onViewPdf, onGenerateAndDownloadPdf }) => {
    const [allQuotes, setAllQuotes] = useState<SavedQuote[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'ordered' | 'pending'>('all');
    const [isSendEmailModalOpen, setSendEmailModalOpen] = useState(false);

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
    
    const handleDuplicate = () => {
        if (!selectedQuote) return;
        onDuplicateQuote(selectedQuote);
        setSelectedQuote(null);
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
                setAllQuotes(allQuotes);
            }
        }
    };

    const handleConfirmSendEmail = () => {
        if (!selectedQuote) return;

        // 1. Start PDF Download
        onGenerateAndDownloadPdf(selectedQuote);

        // 2. Prepare and open email client
        const subject = `Presupuesto de AQG Bathrooms Nº ${selectedQuote.id.replace(/quote_c_/g, '')}`;
        const body = `Estimado/a ${selectedQuote.fiscalName || selectedQuote.customerName || 'cliente'},\n\nAdjunto encontrará el presupuesto que nos ha solicitado.\n\nPara cualquier consulta, no dude en contactarnos.\n\nSaludos cordiales,\n${user.preparedBy || user.companyName}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Use a timeout to allow the download to initiate before the browser navigates away
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 500);
    };

    const renderModal = () => {
        if (!selectedQuote) return null;

        const { quoteItems } = selectedQuote;
        const quoteNumber = selectedQuote.id.replace(/quote_c_/g, '');
        
        const pvpTotalPrice = selectedQuote.pvpTotalPrice || 0;
        const finalPrice = selectedQuote.totalPrice;
        const baseImponible = finalPrice / (1 + VAT_RATE);
        const iva = finalPrice - baseImponible;
        const descuentoTotal = pvpTotalPrice > 0 ? pvpTotalPrice - baseImponible : 0;
        const discountPercentage = pvpTotalPrice > 0 ? (descuentoTotal / pvpTotalPrice) * 100 : 0;

        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedQuote(null)}>
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-xl font-bold text-slate-800">Visualización de Presupuesto</h3>
                             <p className="text-sm text-slate-500">Nº <span className="font-semibold">{quoteNumber}</span></p>
                             <p className="text-sm text-slate-500">Cliente: <span className="font-semibold">{selectedQuote.fiscalName || selectedQuote.customerName}</span></p>
                             {selectedQuote.sucursal && <p className="text-xs text-slate-500">Sucursal: {selectedQuote.sucursal}</p>}
                             {selectedQuote.projectReference && <p className="text-xs text-slate-500">Ref: {selectedQuote.projectReference}</p>}
                             {selectedQuote.deliveryAddress && <p className="text-xs text-slate-500 mt-2"><b>Entrega:</b> {selectedQuote.deliveryAddress}</p>}
                        </div>
                        <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                    </div>

                    <div className="mt-6 border-t border-slate-200">
                        {quoteItems.map((item, index) => {
                             const techProductsWithoutColor = ['CLASSIC TECH', 'CENTRAL TECH', 'RATIO TECH'];
                             const showColor = !techProductsWithoutColor.includes(item.productLine || '');
                             return (
                             <div key={item.id} className="py-4 border-b border-slate-200 last:border-b-0">
                                <h4 className="font-bold text-teal-700 mb-2">Artículo {index + 1}: {item.productLine === 'KITS' ? item.kitProduct?.name : `${item.productLine} - ${item.model?.name}`}</h4>
                                {item.productLine !== 'KITS' ? (
                                    <>
                                        <p className="text-sm text-slate-500">{item.width}cm x {item.length}cm &bull; ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'})</p>
                                        {item.cutWidth && item.cutLength && (
                                            <p className="text-sm text-slate-500 font-medium">Corte a: <span className="text-teal-600">{item.cutWidth}cm x {item.cutLength}cm</span></p>
                                        )}
                                        {showColor && <p className="text-sm text-slate-500">Color: {item.color?.name || `RAL ${item.ralCode}`}</p>}
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
                        )})}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 mt-6">
                        <div className="flex justify-between items-center text-sm text-slate-600">
                            <span>Subtotal (PVP)</span>
                            <span className="font-semibold">{pvpTotalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                         {descuentoTotal > 0.01 && (
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Descuentos ({discountPercentage.toFixed(2)}%)</span>
                                <span className="font-semibold text-red-600">- {descuentoTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm text-slate-600">
                            <span>Base Imponible</span>
                            <span className="font-semibold">{baseImponible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-600">
                            <span>IVA (21%)</span>
                            <span className="font-semibold">{iva.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-slate-800 pt-2 mt-2 border-t border-slate-300">
                            <span>TOTAL</span>
                            <span className="text-teal-600">
                                {finalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
                        <button 
                            onClick={() => handleDeleteQuote(selectedQuote.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                        </button>
                        <div className="flex flex-wrap justify-end gap-3">
                            <button onClick={() => onViewPdf(selectedQuote)} className="px-4 py-2 text-sm font-semibold text-teal-600 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors">Visualización de Presupuesto</button>
                            <button onClick={() => setSendEmailModalOpen(true)} className="px-5 py-2.5 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors inline-flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Enviar Presupuesto por Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const FilterButton: React.FC<{
        label: string;
        count: number;
        filterKey: 'all' | 'ordered' | 'pending';
    }> = ({ label, count, filterKey }) => {
        const isActive = filter === filterKey;
        return (
             <button
                onClick={() => setFilter(filterKey)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ease-in-out
                ${isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
            >
                {label}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full 
                    ${isActive
                        ? 'bg-white text-teal-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                >
                    {count}
                </span>
            </button>
        )
    };

    return (
        <div className="animate-fade-in h-full flex flex-col p-4 md:p-8">
            <div className="flex-shrink-0">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Mis Presupuestos</h2>
                <p className="text-slate-500 mb-6">Gestiona tus presupuestos guardados. Puedes ver los detalles, duplicarlos o tramitar el pedido.</p>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Buscar por cliente, referencia o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    />

                    <div className="flex items-center gap-2">
                        <FilterButton label="Todos" count={stats.total} filterKey="all" />
                        <FilterButton label="Pedidos" count={stats.ordered} filterKey="ordered" />
                        <FilterButton label="Pendientes" count={stats.pending} filterKey="pending" />
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pt-6 pb-4">
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
            <SendEmailModal
                isOpen={isSendEmailModalOpen}
                onClose={() => setSendEmailModalOpen(false)}
                onConfirm={handleConfirmSendEmail}
            />
        </div>
    );
};

export default MyQuotesPage;
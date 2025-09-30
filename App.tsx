// Fix: Import useState, useEffect, useRef, useCallback, and useMemo from React to resolve multiple hook-related errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// Fix: Import PriceDetails from types.ts to use a shared type definition.
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem, PriceDetails } from './types';
// Fix: Added STANDARD_COLORS to the import to resolve an undefined variable error.
import { 
    SHOWER_TRAY_STEPS, KITS_STEPS, ACCESSORY_EXTRAS, STANDARD_COLORS, VAT_RATE
} from './constants';
import { authorizedEmails } from './authorizedUsers';
import { calculateItemPrice as calculateItemPriceUtil, calculatePriceDetails as calculatePriceDetailsUtil } from './utils/priceUtils';


import StepTracker from './components/StepTracker';
import Step1ModelSelection from './components/steps/Step1ModelSelection';
import Step1Dimensions from './components/steps/Step1Dimensions';
import Step2Model from './components/steps/Step2Model';
import Step3Color from './components/steps/Step3Color';
import Step5Cuts from './components/steps/Step5Cuts';
import Step6Accessories from './components/steps/Step6Accessories';
import Step5Summary from './components/steps/Step5Summary';
import Step2KitSelection from './components/steps/kits/Step2KitSelection';
import Step3KitDetails from './components/steps/kits/Step3KitDetails';
import NextPrevButtons from './components/NextPrevButtons';
import AuthPage from './components/auth/AuthPage';
import MyQuotesPage from './components/MyQuotesPage';
import CommercialConditionsPage from './components/CommercialConditionsPage';
import MaintenanceGuidesPage from './components/MaintenanceGuidesPage';
import TransparencyPage from './components/TransparencyPage';
import CommunicationsPage from './components/CommunicationsPage';
import CurrentItemPreview from './components/CurrentItemPreview';

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
                Estás en la herramienta comercial de tu equipo AQG. Gestiona presupuestos y accede a información esencial para desarrollar tu actividad de representación.
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
                        <p className="text-xs text-slate-500 text-center">Exporta tus presupuestos y ajustes. Importa un archivo para restaurar tus datos en otro dispositivo.</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button onClick={handleSave} className="w-full max-w-xs px-8 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};


// PDF Preview Modal
const PdfPreviewModal = ({ url, onClose }: { url: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl p-4 w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Vista Previa del PDF</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
            </div>
            <iframe src={url} className="w-full h-full border-0 rounded" title="PDF Preview"></iframe>
        </div>
    </div>
);


// Save Quote Modal
const SaveQuoteModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (details: { customerName?: string, projectReference?: string, fiscalName?: string, sucursal?: string, deliveryAddress?: string }) => void;
    currentUser: User;
}> = ({ isOpen, onClose, onSave, currentUser }) => {
    const [customerName, setCustomerName] = useState('');
    const [projectReference, setProjectReference] = useState('');
    const [fiscalName, setFiscalName] = useState('');
    const [sucursal, setSucursal] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    if (!isOpen) return null;

    const handleSaveClick = () => {
        onSave({ customerName, projectReference, fiscalName, sucursal, deliveryAddress });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Guardar Presupuesto</h3>
                            <p className="text-sm text-slate-500">Añade los detalles del cliente para finalizar.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="save-fiscal-name" className="block text-sm font-medium text-slate-700 mb-2">Nombre Fiscal Cliente</label>
                        <input id="save-fiscal-name" type="text" value={fiscalName} onChange={(e) => setFiscalName(e.target.value)} placeholder="Nombre fiscal del cliente final" className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition" />
                    </div>
                     <div>
                        <label htmlFor="save-customer-name" className="block text-sm font-medium text-slate-700 mb-2">Nombre Comercial (Opcional)</label>
                        <input id="save-customer-name" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ej: Baños Elegantes S.L." className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition" />
                    </div>
                     <div>
                        <label htmlFor="save-sucursal" className="block text-sm font-medium text-slate-700 mb-2">Población / Sucursal Cliente (Opcional)</label>
                        <input id="save-sucursal" type="text" value={sucursal} onChange={(e) => setSucursal(e.target.value)} placeholder="Ej: Tienda Valencia" className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="save-project-ref" className="block text-sm font-medium text-slate-700 mb-2">Referencia del Proyecto (Opcional)</label>
                        <input id="save-project-ref" type="text" value={projectReference} onChange={(e) => setProjectReference(e.target.value)} placeholder="Ej: Reforma Baño Principal" className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="save-delivery-address" className="block text-sm font-medium text-slate-700 mb-2">Dirección de Entrega (Opcional)</label>
                        <textarea id="save-delivery-address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Si es diferente a la habitual del cliente" rows={3} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"></textarea>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancelar</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors">Guardar Presupuesto</button>
                </div>
            </div>
        </div>
    );
};

const VisitModal = ({ onClose }: { onClose: () => void }) => {
    const addressForUrl = "Carretera Almoradi-Rojales, km.1, 03160 Almoradi, Alicante, España";
    const encodedAddress = encodeURIComponent(addressForUrl);

    const links = [
        { name: 'Google Maps', url: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}` },
        { name: 'Waze', url: `https://waze.com/ul?q=${encodedAddress}` },
        { name: 'Apple Maps', url: `http://maps.apple.com/?daddr=${encodedAddress}` },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Cómo Llegar a Fábrica</h3>
                        <div className="text-sm text-slate-500 mt-1">
                            <p className="font-semibold">AQG BATHROOMS</p>
                            <p>Carretera Almoradi-Rojales, km.1</p>
                            <p>03160 Almoradi (Alicante)</p>
                            <p>España</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
                </div>
                <p className="text-slate-600 mb-6 text-sm">
                    Selecciona tu aplicación de navegación preferida para obtener la ruta.
                </p>
                <div className="flex flex-col gap-3">
                    {links.map(link => (
                         <a 
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center px-6 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors inline-flex items-center justify-center gap-2"
                        >
                           Abrir en {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const InfoModal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
            </div>
            <div className="text-slate-600 mb-6 text-sm space-y-2">
                {children}
            </div>
            <div className="flex justify-end">
                <button onClick={onClose} className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                    Entendido
                </button>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<'auth' | 'welcome' | 'quote' | 'my-quotes' | 'conditions' | 'guides' | 'transparency' | 'communications'>('auth');

    // --- QUOTE STATE ---
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [currentItemConfig, setCurrentItemConfig] = useState<QuoteState>({
        productLine: null,
        width: 70,
        length: 100,
        quantity: 1,
        model: null,
        color: null,
        extras: [],
    });
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [appliedDiscounts, setAppliedDiscounts] = useState<{ [key: string]: number }>({});
    
    // UI State
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isSaveModalOpen, setSaveModalOpen] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCustomModalOpen, setCustomModalOpen] = useState(false);
    const [isDrainerModalOpen, setDrainerModalOpen] = useState(false);
    const [isVisitModalOpen, setVisitModalOpen] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        if (loggedInUserEmail) {
            const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
            const user = users.find(u => u.email === loggedInUserEmail);
            if (user) {
                setCurrentUser(user);
                setView('welcome');
            }
        }
    }, []);

    // --- DERIVED STATE & MEMOS ---

    // Determine which steps to show based on product line
    const STEPS = useMemo(() => {
        const baseSteps = currentItemConfig.productLine === 'KITS' ? KITS_STEPS : SHOWER_TRAY_STEPS;
        
        let filteredSteps = baseSteps;

        if (currentItemConfig.productLine === 'FLAT TERRAZO') {
            filteredSteps = baseSteps.filter(step => step.id !== 4);
        } else if (currentItemConfig.productLine === 'CLASSIC TECH' || currentItemConfig.productLine === 'CENTRAL TECH' || currentItemConfig.productLine === 'RATIO TECH') {
            // For CLASSIC TECH and CENTRAL TECH, remove Color (4) and Accessories (6)
            filteredSteps = baseSteps.filter(step => step.id !== 4 && step.id !== 6);
        }

        // Re-assign sequential numbers for UI display (StepTracker, etc.)
        return filteredSteps.map((step, index) => ({
            ...step,
            number: index + 1
        }));
    }, [currentItemConfig.productLine]);
    
    const isNextStepDisabled = useMemo(() => {
        const stepDetails = STEPS.find(s => s.number === currentStep);
        if (!stepDetails) return true;

        switch (stepDetails.id) {
            case 1: // Collection
                return !currentItemConfig.productLine;
            case 2: // Dimensions
                return !currentItemConfig.width || !currentItemConfig.length;
             case 10: // Kit Selection
                return !currentItemConfig.kitProduct;
            case 3: // Texture
                return !currentItemConfig.model;
             case 11: // Kit Details
                if (currentItemConfig.kitProduct?.id === 'kit-pintura' || currentItemConfig.kitProduct?.id === 'kit-reparacion') {
                    const isRalSelected = currentItemConfig.extras.some(e => e.id === 'ral');
                    return !currentItemConfig.color && (!isRalSelected || !currentItemConfig.ralCode);
                }
                return false;
            case 4: // Color
                const isRalSelected = currentItemConfig.extras.some(e => e.id === 'ral');
                return !currentItemConfig.color && (!isRalSelected || !currentItemConfig.ralCode);
            case 5: // Cuts
                const hasCut = currentItemConfig.extras.some(e => e.id.startsWith('corte'));
                if (hasCut) {
                    const { cutWidth, cutLength, width, length } = currentItemConfig;
                    if (!cutWidth || !cutLength || cutWidth <= 0 || cutLength <= 0) return true;
                     const baseSorted = [width, length].sort((a, b) => a - b);
                    const cutSorted = [cutWidth, cutLength].sort((a, b) => a - b);
                     if (cutSorted[0] > baseSorted[0] || cutSorted[1] > baseSorted[1]) return true;
                }
                return false;
            case 6: // Accessories
                const isBitonoSelected = currentItemConfig.extras.some(e => e.id === 'bitono');
                return isBitonoSelected && !currentItemConfig.bitonoColor;
            default:
                return false;
        }
    }, [currentStep, currentItemConfig, STEPS]);

    
    // --- PRICE CALCULATION ---

    // Get the base price for the current item being configured (for the preview)
    const currentItemBasePrice = useMemo(() => calculateItemPriceUtil(currentItemConfig), [currentItemConfig]);

    // Create a memoized version of calculatePriceDetails that can be passed down
    // to child components without causing re-renders, as it's wrapped in useCallback.
    const calculatePriceDetails = useCallback((item: QuoteItem): PriceDetails => {
        return calculatePriceDetailsUtil(item, appliedDiscounts, currentUser);
    }, [appliedDiscounts, currentUser]);

    // Calculate total prices for the entire quote
    const { pvpTotalPrice, discountedTotalPrice } = useMemo(() => {
        let pvpTotal = 0;
        let discountedTotal = 0;
        quoteItems.forEach(item => {
            const details = calculatePriceDetails(item);
            pvpTotal += details.basePrice;
            discountedTotal += details.discountedPrice;
        });
        return { pvpTotalPrice: pvpTotal, discountedTotalPrice: discountedTotal };
    }, [quoteItems, calculatePriceDetails]);

    const finalTotalPrice = discountedTotalPrice * (1 + VAT_RATE);
    
    // --- AUTHENTICATION HANDLERS ---
    
    const handleLogin = useCallback(async (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (user && user.password === password) {
                    setCurrentUser(user);
                    localStorage.setItem('loggedInUser', user.email);
                    setView('welcome');
                    resolve();
                } else {
                    reject(new Error('Email o contraseña incorrectos.'));
                }
            }, 500);
        });
    }, []);

    const handleRegister = useCallback(async (newUser: Omit<StoredUser, 'promotion'>): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                 const lowercasedEmail = newUser.email.toLowerCase();

                if (!authorizedEmails.map(e => e.toLowerCase()).includes(lowercasedEmail)) {
                    return reject(new Error('Este email no está autorizado para registrarse.'));
                }

                const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
                
                const existingUser = users.find(u => u.email.toLowerCase() === lowercasedEmail);
                if (existingUser) {
                    return reject(new Error('Ya existe una cuenta registrada con este email.'));
                }

                const userToStore: StoredUser = { ...newUser, email: lowercasedEmail };
                const updatedUsers = [...users, userToStore];
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                
                handleLogin(newUser.email, newUser.password).then(resolve).catch(reject);
            }, 500);
        });
    }, [handleLogin]);

    const handleLogout = useCallback(() => {
        if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            setCurrentUser(null);
            localStorage.removeItem('loggedInUser');
            setView('auth');
            setIsSidebarOpen(false);
        }
    }, []);

    // --- NAVIGATION & VIEW HANDLERS ---
    
    const resetQuoteState = useCallback(() => {
        setCurrentItemConfig({
            productLine: null,
            width: 70,
            length: 100,
            quantity: 1,
            model: null,
            color: STANDARD_COLORS[0],
            extras: [],
        });
        setCurrentStep(1);
        setEditingItemId(null);
    }, []);

    const handleNewQuote = useCallback(() => {
        setQuoteItems([]);
        setAppliedDiscounts({});
        resetQuoteState();
        setView('quote');
    }, [resetQuoteState]);

    const handleResumeQuote = useCallback(() => {
        setView('quote');
        // If there are items, jump to summary. Otherwise, start from step 1.
        if (quoteItems.length > 0) {
            setCurrentStep(STEPS.length);
        } else {
            setCurrentStep(1);
        }
    }, [quoteItems.length, STEPS]);

    const handleNavigate = (targetView: typeof view) => {
        setView(targetView);
        setIsSidebarOpen(false);
    };

    const handleNavigateToQuote = () => {
        handleResumeQuote();
        setIsSidebarOpen(false);
    };


    const handleNextStep = useCallback(() => {
        const isLastConfigStep = currentStep === STEPS.length - 1;

        if (isLastConfigStep) {
            // Finalize the item being configured
            const finalItem: QuoteItem = {
                ...currentItemConfig,
                id: editingItemId || `item_${Date.now()}`,
            };
            
            // Before resetting state, we need to know if the item was a Kit
            // to navigate to the correct summary step number later.
            const wasKits = currentItemConfig.productLine === 'KITS';

            // Use functional updates for `setQuoteItems` to prevent stale state issues
            if (editingItemId) {
                // We are editing an item, so map over the existing items and replace it.
                setQuoteItems(prevItems => 
                    prevItems.map(item =>
                        item.id === editingItemId ? finalItem : item
                    )
                );
            } else {
                // We are adding a new item.
                setQuoteItems(prevItems => [...prevItems, finalItem]);
            }
            
            // Reset the configuration for the next item.
            resetQuoteState();
            
            // After resetting, the STEPS logic will recalculate to the default flow.
            // To avoid showing the wrong step, we explicitly navigate to the summary
            // step number of the now-active default flow.
            const summaryStepNumber = wasKits ? KITS_STEPS.length : SHOWER_TRAY_STEPS.length;
            setCurrentStep(summaryStepNumber);

        } else if (currentStep < STEPS.length) {
            // It's not the last step, so just advance to the next one.
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, STEPS, currentItemConfig, editingItemId, resetQuoteState]);

    const handlePrevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleStepClick = useCallback((step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    }, [currentStep]);
    
    // --- QUOTE ITEM MANAGEMENT ---
    
    const handleUpdateQuoteItem = useCallback((updates: Partial<QuoteState>) => {
        setCurrentItemConfig(prev => {
            const newConfig = { ...prev, ...updates };
    
            // Auto-select color when a Terrazo model is chosen
            if (newConfig.productLine === 'FLAT TERRAZO' && newConfig.model?.id.startsWith('terrazo-')) {
                const colorId = newConfig.model.id.replace('terrazo-', '');
                const correspondingColor = STANDARD_COLORS.find(c => c.id === colorId);
                if (correspondingColor && prev.model?.id !== newConfig.model.id) {
                    newConfig.color = correspondingColor;
                }
            }
            return newConfig;
        });
    }, []);

    const handleProductLineSelect = (val: string) => {
        if (val === 'CUSTOM') {
            setCustomModalOpen(true);
        } else if (val === 'DRAINER') {
            setDrainerModalOpen(true);
        } else {
            handleUpdateQuoteItem({
                productLine: val,
                quantity: 1,
                model: null,
                color: val === 'CLASSIC TECH' || val === 'CENTRAL TECH' || val === 'RATIO TECH' ? null : STANDARD_COLORS[0],
                extras: [],
                structFrames: val === 'STRUCT DETAIL' ? 4 : undefined,
            });
        }
    };

    const handleEditItem = (itemId: string) => {
        const itemToEdit = quoteItems.find(item => item.id === itemId);
        if (itemToEdit) {
            setCurrentItemConfig(itemToEdit);
            setEditingItemId(itemId);
            // Determine start step based on product line
            const startStep = itemToEdit.productLine === 'KITS' ? KITS_STEPS[0].id : SHOWER_TRAY_STEPS[0].id;
            setCurrentStep(startStep);
        }
    };
    
    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
            setQuoteItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    const handleResetQuote = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar el presupuesto actual?')) {
            setQuoteItems([]);
            setAppliedDiscounts({});
        }
    };
    
    // --- PDF & PRINTING ---
    const generateCustomerPdf = async (quote: SavedQuote, user: User, forDownload: boolean) => {
        // Dynamic import of PDF generation utilities
        const { default: generatePdf } = await import('./utils/pdfGenerator');
        const pdfBlob = await generatePdf(quote, user, quote.customerDiscounts || appliedDiscounts);
        
        if (forDownload) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `Presupuesto_AQG_${quote.id.replace(/quote_c_/g, '')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } else {
            // For preview
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfPreviewUrl(pdfUrl);
        }
    };

    const handleGeneratePdf = async (savedQuote?: SavedQuote) => {
        if (!currentUser) return;
        const quoteToProcess = savedQuote || createSavedQuoteObject();
        if (!quoteToProcess || quoteToProcess.quoteItems.length === 0) {
            alert("No hay artículos en el presupuesto para generar un PDF.");
            return;
        }
        await generateCustomerPdf(quoteToProcess, currentUser, true);
    };

    const handleViewPdf = async (savedQuote: SavedQuote) => {
        if (!currentUser) return;
        await generateCustomerPdf(savedQuote, currentUser, false);
    };

    const handleGenerateAndDownloadPdf = async (quote: SavedQuote) => {
        if (!currentUser) return;
        const { default: generatePdf } = await import('./utils/pdfGenerator');
        // Use the correct discounts from the saved quote object
        const pdfBlob = await generatePdf(quote, currentUser, quote.customerDiscounts || {});
        
        // Download logic
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `Presupuesto_AQG_${quote.id.replace(/quote_c_/g, '')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };


    const handlePrint = () => {
        window.print();
    };


    // --- SAVING & DATA MANAGEMENT ---
    const createSavedQuoteObject = (): SavedQuote | null => {
        if (!currentUser) return null;
        return {
            id: `quote_c_${Date.now()}`,
            timestamp: Date.now(),
            userEmail: currentUser.email,
            quoteItems,
            totalPrice: finalTotalPrice,
            pvpTotalPrice: pvpTotalPrice,
            customerDiscounts: appliedDiscounts,
            type: 'customer' // This is a customer-facing quote
        };
    };

    const handleSaveQuote = (details: { customerName?: string, projectReference?: string, fiscalName?: string; sucursal?: string; deliveryAddress?: string; }) => {
        const newQuote = createSavedQuoteObject();
        if (newQuote) {
            const quoteWithDetails = { ...newQuote, ...details };
            try {
                const existingQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
                localStorage.setItem('quotes', JSON.stringify([...existingQuotes, quoteWithDetails]));
                alert('Presupuesto guardado con éxito.');
                setView('my-quotes');
                // Clear the current quote after saving
                setQuoteItems([]);
                setAppliedDiscounts({});
            } catch (error) {
                console.error("Error saving quote to localStorage:", error);
                alert("Hubo un error al guardar el presupuesto.");
            }
        }
    };
    
    // Duplicates a quote and sets it as the active quote for editing.
    const handleDuplicateQuote = (quoteToDuplicate: SavedQuote) => {
        if (window.confirm('Esto reemplazará tu presupuesto actual. ¿Quieres continuar?')) {
            setQuoteItems(quoteToDuplicate.quoteItems.map(item => ({ ...item, id: `item_${Date.now()}_${Math.random()}` })));
            setAppliedDiscounts(quoteToDuplicate.customerDiscounts || {});
            setView('quote');
            setCurrentStep(STEPS.length); // Go to summary
        }
    };

    const handleExportData = () => {
        try {
            const quotes = localStorage.getItem('quotes') || '[]';
            const dataToExport = {
                quotes: JSON.parse(quotes).filter((q: SavedQuote) => q.userEmail === currentUser?.email),
            };
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `aqg_backup_${currentUser?.companyName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Error exporting data:', e);
            alert('No se pudo exportar los datos.');
        }
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error('Invalid file content');
                
                const data = JSON.parse(text);
                const importedQuotes = data.quotes as SavedQuote[];

                if (!Array.isArray(importedQuotes)) throw new Error('Invalid quotes format');

                if (window.confirm(`Se encontraron ${importedQuotes.length} presupuestos. ¿Quieres importarlos? Esto se añadirá a tus presupuestos existentes.`)) {
                    const allQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as SavedQuote[];
                    
                    // Filter out duplicates based on ID
                    const existingIds = new Set(allQuotes.map(q => q.id));
                    const newQuotes = importedQuotes.filter(q => !existingIds.has(q.id));

                    localStorage.setItem('quotes', JSON.stringify([...allQuotes, ...newQuotes]));
                    alert(`${newQuotes.length} nuevos presupuestos importados con éxito.`);
                    // Refresh view if on MyQuotes page
                    if(view === 'my-quotes') {
                        setView('welcome');
                        setTimeout(() => setView('my-quotes'), 0);
                    }
                }
            } catch (error) {
                console.error('Error importing data:', error);
                alert('El archivo de importación no es válido o está corrupto.');
            }
        };
        reader.readAsText(file);
    };


    // --- RENDER LOGIC ---

    const renderCurrentStep = () => {
        // Common props for update handlers
        const updateProps = {
            onUpdate: handleUpdateQuoteItem,
            quote: currentItemConfig,
        };
        
        const updateColorProps = {
            selectedColor: currentItemConfig.color,
            onSelectColor: (color: ColorOption) => handleUpdateQuoteItem({ color, extras: currentItemConfig.extras.filter(e => e.id !== 'ral'), ralCode: '' }),
            isRalSelected: currentItemConfig.extras.some(e => e.id === 'ral'),
            onToggleRal: () => {
                const ralExtra = ACCESSORY_EXTRAS.find(e => e.id === 'ral');
                if (!ralExtra) return;
                const isRal = currentItemConfig.extras.some(e => e.id === 'ral');
                if (isRal) {
                    handleUpdateQuoteItem({ extras: currentItemConfig.extras.filter(e => e.id !== 'ral'), ralCode: '', color: STANDARD_COLORS[0] });
                } else {
                    handleUpdateQuoteItem({ extras: [...currentItemConfig.extras, ralExtra], color: null, ralCode: '' });
                }
            },
            ralCode: currentItemConfig.ralCode || '',
            onRalCodeChange: (code: string) => handleUpdateQuoteItem({ ralCode: code }),
        };

        const stepDetails = STEPS.find(s => s.number === currentStep);
        const stepId = stepDetails?.id;


        if (currentItemConfig.productLine === 'KITS') {
            switch (stepId) {
                case 1: return <Step1ModelSelection selectedProductLine={currentItemConfig.productLine} onUpdate={handleProductLineSelect} quantity={currentItemConfig.quantity} onUpdateQuantity={(q) => handleUpdateQuoteItem({ quantity: q })} />;
                case 10: return <Step2KitSelection selectedKit={currentItemConfig.kitProduct} onSelect={(kit) => handleUpdateQuoteItem({ kitProduct: kit })} />;
                case 11: return <Step3KitDetails currentItemConfig={currentItemConfig} onSelectColor={updateColorProps.onSelectColor} onToggleRal={updateColorProps.onToggleRal} onRalCodeChange={updateColorProps.onRalCodeChange} onInvoiceRefChange={(ref) => handleUpdateQuoteItem({ invoiceReference: ref })} />;
                case 12: return <Step5Summary items={quoteItems} totalPrice={finalTotalPrice} onReset={handleResetQuote} onSaveRequest={() => setSaveModalOpen(true)} onGeneratePdfRequest={() => handleGeneratePdf()} onPrintRequest={handlePrint} onStartNew={() => { resetQuoteState(); setCurrentStep(1); }} onEdit={handleEditItem} onDelete={handleDeleteItem} calculatePriceDetails={calculatePriceDetails} appliedDiscounts={appliedDiscounts} onUpdateDiscounts={setAppliedDiscounts} />;
                default: return null;
            }
        }

        switch (stepId) {
            case 1: return <Step1ModelSelection selectedProductLine={currentItemConfig.productLine} onUpdate={handleProductLineSelect} quantity={currentItemConfig.quantity} onUpdateQuantity={(q) => handleUpdateQuoteItem({ quantity: q })} />;
            case 2: return <Step1Dimensions quote={currentItemConfig} onUpdate={(width, length) => handleUpdateQuoteItem({ width, length })} />;
            case 3: return <Step2Model selectedModel={currentItemConfig.model} productLine={currentItemConfig.productLine} onSelect={(model) => handleUpdateQuoteItem({ model })} />;
            case 4: return <Step3Color {...updateColorProps} productLine={currentItemConfig.productLine} />;
            case 5: 
                return <Step5Cuts 
                    selectedExtras={currentItemConfig.extras} 
                    productLine={currentItemConfig.productLine} 
                    baseWidth={currentItemConfig.width} 
                    baseLength={currentItemConfig.length} 
                    cutWidth={currentItemConfig.cutWidth} 
                    cutLength={currentItemConfig.cutLength}
                    onUpdateCutDimensions={(dims) => handleUpdateQuoteItem(dims)} 
                    structFrames={currentItemConfig.structFrames} 
                    onUpdateStructFrames={(frames) => handleUpdateQuoteItem({ structFrames: frames })}
                    onToggle={(extra) => {
                         const isSelected = currentItemConfig.extras.some(e => e.id === extra.id);
                         const otherCuts = currentItemConfig.extras.filter(e => !e.id.startsWith('corte'));
                         if (isSelected) {
                            // If it's a cut, deselecting it removes all cuts
                             handleUpdateQuoteItem({ extras: otherCuts, cutWidth: undefined, cutLength: undefined });
                         } else {
                            // Selecting a cut deselects any other cut first
                             handleUpdateQuoteItem({ extras: [...otherCuts, extra] });
                         }
                    }}
                />;
            case 6: 
                return <Step6Accessories 
                    selectedExtras={currentItemConfig.extras} 
                    productLine={currentItemConfig.productLine} 
                    width={currentItemConfig.width}
                    mainColor={currentItemConfig.color} 
                    bitonoColor={currentItemConfig.bitonoColor} 
                    onSelectBitonoColor={(color) => handleUpdateQuoteItem({ bitonoColor: color })}
                    onToggle={(extra) => {
                        let newExtras = [...currentItemConfig.extras];
                        const isSelected = newExtras.some(e => e.id === extra.id);
                        const isGrate = extra.id.startsWith('rejilla-');
                        
                        if (isSelected) {
                            newExtras = newExtras.filter(e => e.id !== extra.id);
                        } else {
                            if (isGrate) {
                                // Deselect any other grate before selecting the new one
                                newExtras = newExtras.filter(e => !e.id.startsWith('rejilla-'));
                            }
                            newExtras.push(extra);
                        }
                        handleUpdateQuoteItem({ extras: newExtras });
                    }}
                />;
            case 7: 
                return <Step5Summary 
                    items={quoteItems} 
                    totalPrice={finalTotalPrice} 
                    onReset={handleResetQuote} 
                    onSaveRequest={() => setSaveModalOpen(true)} 
                    onGeneratePdfRequest={() => handleGeneratePdf()} 
                    onPrintRequest={handlePrint} 
                    onStartNew={() => { resetQuoteState(); setCurrentStep(1); }} 
                    onEdit={handleEditItem} 
                    onDelete={handleDeleteItem} 
                    calculatePriceDetails={calculatePriceDetails}
                    appliedDiscounts={appliedDiscounts}
                    onUpdateDiscounts={setAppliedDiscounts}
                />;
            default: 
                return null;
        }
    };

    const renderView = () => {
        if (!currentUser) {
            return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
        }

        switch (view) {
            case 'welcome':
                return <WelcomePage 
                    userName={currentUser.preparedBy || currentUser.companyName}
                    onNewQuote={handleNewQuote}
                    onViewQuotes={() => setView('my-quotes')}
                    onResumeQuote={handleResumeQuote}
                    hasActiveQuote={quoteItems.length > 0 || !!currentItemConfig.productLine}
                />;
            case 'my-quotes':
                return <MyQuotesPage user={currentUser} onDuplicateQuote={handleDuplicateQuote} onViewPdf={handleViewPdf} onGenerateAndDownloadPdf={handleGenerateAndDownloadPdf} />;
            case 'conditions':
                return <CommercialConditionsPage />;
            case 'guides':
                return <MaintenanceGuidesPage />;
            case 'transparency':
                return <TransparencyPage />;
            case 'communications':
                return <CommunicationsPage onPlanVisit={() => setVisitModalOpen(true)} />;
            case 'quote':
                 const currentVisibleStep = STEPS.find(s => s.number === currentStep);

                return (
                    <div className="flex-grow flex flex-col min-h-0">
                        <div className="main-content-body flex-grow p-4 md:p-8 overflow-y-auto">
                           {currentVisibleStep && renderCurrentStep()}
                        </div>
                        {currentStep < STEPS.length && (
                             <>
                                <CurrentItemPreview config={currentItemConfig} price={currentItemBasePrice * currentItemConfig.quantity} />
                                <NextPrevButtons
                                    onNext={handleNextStep}
                                    onPrev={handlePrevStep}
                                    currentStep={currentStep}
                                    totalSteps={STEPS.length}
                                    isNextDisabled={isNextStepDisabled}
                                    isLastStep={currentStep === STEPS.length - 1}
                                    onDiscard={() => {
                                        if (window.confirm('¿Descartar el artículo actual y volver al resumen?')) {
                                            resetQuoteState();
                                            setCurrentStep(STEPS.length);
                                        }
                                    }}
                                />
                             </>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };
    
    // Sidebar Navigation Link
    const NavLink: React.FC<{
        onClick: () => void;
        icon: React.ReactNode;
        label: string;
        isActive: boolean;
    }> = ({ onClick, icon, label, isActive }) => (
        <button 
            onClick={onClick} 
            className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive 
                ? 'bg-teal-500 text-white font-semibold shadow' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span className="flex-1">{label}</span>
        </button>
    );

    const hasActiveQuote = quoteItems.length > 0 || !!currentItemConfig.productLine;

    return (
        <div className="h-screen w-screen bg-slate-100 font-sans flex text-slate-800">
             {currentUser && (
                <>
                    {/* --- Mobile Header --- */}
                    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-4 z-40">
                         <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="font-bold text-teal-600">AQG Comercial</h1>
                        <div className="w-8"></div>
                    </header>

                    {/* --- Sidebar --- */}
                    <div 
                        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        w-72 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 shadow-xl md:shadow-none`}
                    >
                         <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                             <h1 className="text-2xl font-bold text-teal-600 tracking-tight">AQG</h1>
                             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 p-1">&times;</button>
                        </div>

                        <nav className="flex-grow space-y-2">
                            <NavLink onClick={() => handleNavigate('welcome')} isActive={view === 'welcome'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} label="Inicio" />
                            <NavLink onClick={handleNavigateToQuote} isActive={view === 'quote'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" /></svg>} label={hasActiveQuote ? "Presupuesto Activo" : "Nuevo Presupuesto"} />
                            <NavLink onClick={() => handleNavigate('my-quotes')} isActive={view === 'my-quotes'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>} label="Mis Presupuestos" />
                           
                           <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                                <NavLink onClick={() => handleNavigate('conditions')} isActive={view === 'conditions'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h14a1 1 0 011 1v5a.997.997 0 01-.293-.707zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>} label="Promociones" />
                                <NavLink onClick={() => handleNavigate('guides')} isActive={view === 'guides'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} label="Descargas" />
                                <NavLink onClick={() => handleNavigate('transparency')} isActive={view === 'transparency'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm5 2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H9zM8 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm4 0a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" /></svg>} label="Transparencia" />
                                <NavLink onClick={() => handleNavigate('communications')} isActive={view === 'communications'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>} label="Comunicaciones" />
                            </div>
                        </nav>

                        <div className="mt-auto pt-4 border-t border-slate-200 space-y-2">
                             <div className="text-xs text-center text-slate-400 mb-2">
                                <p className="font-semibold text-slate-600">{currentUser.companyName}</p>
                                <p>{currentUser.email}</p>
                            </div>
                            <NavLink onClick={() => setSettingsModalOpen(true)} isActive={false} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734 2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>} label="Ajustes" />
                            <NavLink onClick={handleLogout} isActive={false} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>} label="Cerrar Sesión" />
                        </div>
                    </div>
                </>
             )}

            <main className={`main-content flex-grow flex flex-col h-screen ${!currentUser ? 'items-center justify-center' : ''} ${isSidebarOpen ? 'md:w-[calc(100vw-288px)]' : 'w-full'} pt-16 md:pt-0`}>
                {renderView()}
            </main>
            
            {/* --- Modals --- */}
            {currentUser && <SettingsModal 
                isOpen={isSettingsModalOpen} 
                onClose={() => setSettingsModalOpen(false)}
                onSave={(settings) => {
                    const updatedUser = { ...currentUser, ...settings };
                    setCurrentUser(updatedUser);
                    try {
                         const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
                         const updatedUsers = users.map(u => u.email === updatedUser.email ? { ...u, ...settings } : u);
                         localStorage.setItem('users', JSON.stringify(updatedUsers));
                    } catch(e) { console.error(e); }
                }}
                user={currentUser}
                onExport={handleExportData}
                onImport={handleImportData}
            />}
            {isSaveModalOpen && currentUser && <SaveQuoteModal isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} onSave={handleSaveQuote} currentUser={currentUser} />}
            {pdfPreviewUrl && <PdfPreviewModal url={pdfPreviewUrl} onClose={() => { URL.revokeObjectURL(pdfPreviewUrl); setPdfPreviewUrl(null); }} />}
            {isVisitModalOpen && <VisitModal onClose={() => setVisitModalOpen(false)} />}
            {isCustomModalOpen && (
                <InfoModal title="Colección CUSTOM" onClose={() => setCustomModalOpen(false)}>
                    <p>Para platos de ducha <strong>CUSTOM</strong>, es necesario contactar con fábrica para especificar las medidas y características deseadas.</p>
                    <p>El precio se calculará de forma personalizada.</p>
                </InfoModal>
            )}
            {isDrainerModalOpen && (
                <InfoModal title="Colección DRAINER" onClose={() => setDrainerModalOpen(false)}>
                     <p>Para platos de ducha <strong>DRAINER</strong>, es necesario contactar con fábrica para especificar las medidas y características deseadas.</p>
                     <p>El precio se calculará de forma personalizada.</p>
                </InfoModal>
            )}
        </div>
    );
};

export default App;
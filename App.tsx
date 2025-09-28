// Fix: Import useState, useEffect, useRef, useCallback, and useMemo from React to resolve multiple hook-related errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// Fix: Import PriceDetails from types.ts to use a shared type definition.
import type { QuoteState, ProductOption, ColorOption, User, SavedQuote, StoredUser, QuoteItem, PriceDetails } from './types';
// Fix: Added STANDARD_COLORS to the import to resolve an undefined variable error.
import { 
    PRICE_LIST, SHOWER_TRAY_STEPS, KITS_STEPS, SHOWER_MODELS, KIT_PRODUCTS, ACCESSORY_EXTRAS, STANDARD_COLORS, VAT_RATE, PROMO_DURATION_DAYS, PROMO_ID
} from './constants';
import { authorizedUsers } from './authorizedUsers';
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
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 011-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
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
    const [fiscalName, setFiscalName] = useState(currentUser.fiscalName || '');
    const [sucursal, setSucursal] = useState(currentUser.sucursal || '');
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

    // Seed users if none exist
    useEffect(() => {
        const users = localStorage.getItem('users');
        if (!users) {
            localStorage.setItem('users', JSON.stringify(authorizedUsers));
        }
    }, []);
    

    // --- DERIVED STATE & MEMOS ---

    // Determine which steps to show based on product line
    const STEPS = useMemo(() => {
        if (currentItemConfig.productLine === 'KITS') {
            return KITS_STEPS;
        }
        return SHOWER_TRAY_STEPS;
    }, [currentItemConfig.productLine]);
    
    const isNextStepDisabled = useMemo(() => {
        switch (currentStep) {
            case 1: // Collection
                return !currentItemConfig.productLine;
            case 2: // Dimensions or Kit Selection
                if (currentItemConfig.productLine === 'KITS') {
                    return !currentItemConfig.kitProduct;
                }
                return !currentItemConfig.width || !currentItemConfig.length;
            case 3: // Texture or Kit Details
                if (currentItemConfig.productLine === 'KITS') {
                    if (currentItemConfig.kitProduct?.id === 'kit-pintura' || currentItemConfig.kitProduct?.id === 'kit-reparacion') {
                        const isRalSelected = currentItemConfig.extras.some(e => e.id === 'ral');
                        return !currentItemConfig.color && (!isRalSelected || !currentItemConfig.ralCode);
                    }
                    return false; // No extra validation for repair kit
                }
                return !currentItemConfig.model;
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
    }, [currentStep, currentItemConfig]);

    
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
    }, [quoteItems.length, STEPS.length]);

    const handleNavigate = (targetView: typeof view) => {
        setView(targetView);
        setIsSidebarOpen(false);
    };

    const handleNavigateToQuote = () => {
        handleResumeQuote();
        setIsSidebarOpen(false);
    };


    const handleNextStep = useCallback(() => {
        // If we are on the last configuration step, add item and move to summary
        if (currentStep === STEPS.length - 1) {
            const newItem: QuoteItem = {
                ...currentItemConfig,
                id: editingItemId || `item_${Date.now()}`,
            };

            if (editingItemId) {
                setQuoteItems(quoteItems.map(item => item.id === editingItemId ? newItem : item));
            } else {
                setQuoteItems(prevItems => [...prevItems, newItem]);
            }
            
            resetQuoteState();
            setCurrentStep(STEPS.length); // Go to summary
        } 
        // For all other steps, just increment
        else if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, STEPS.length, currentItemConfig, quoteItems, editingItemId, resetQuoteState]);

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
        setCurrentItemConfig(prev => ({ ...prev, ...updates }));
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
                color: STANDARD_COLORS[0],
                extras: [],
            });
        }
    };

    const handleEditItem = (itemId: string) => {
        const itemToEdit = quoteItems.find(item => item.id === itemId);
        if (itemToEdit) {
            setCurrentItemConfig(itemToEdit);
            setEditingItemId(itemId);
            // Determine start step based on product line
            const startStep = itemToEdit.productLine === 'KITS' ? KITS_STEPS[0].number : SHOWER_TRAY_STEPS[0].number;
            setCurrentStep(startStep);
        }
    };
    
    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
            setQuoteItems(quoteItems.filter(item => item.id !== itemId));
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
        const pdfBlob = await generatePdf(quote, user, appliedDiscounts);
        
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

        if (currentItemConfig.productLine === 'KITS') {
            switch (currentStep) {
                case 1: return <Step1ModelSelection selectedProductLine={currentItemConfig.productLine} onUpdate={handleProductLineSelect} quantity={currentItemConfig.quantity} onUpdateQuantity={(q) => handleUpdateQuoteItem({ quantity: q })} />;
                case 2: return <Step2KitSelection selectedKit={currentItemConfig.kitProduct} onSelect={(kit) => handleUpdateQuoteItem({ kitProduct: kit })} />;
                case 3: return <Step3KitDetails currentItemConfig={currentItemConfig} onSelectColor={updateColorProps.onSelectColor} onToggleRal={updateColorProps.onToggleRal} onRalCodeChange={updateColorProps.onRalCodeChange} onInvoiceRefChange={(ref) => handleUpdateQuoteItem({ invoiceReference: ref })} />;
                case 4: return <Step5Summary items={quoteItems} totalPrice={finalTotalPrice} onReset={handleResetQuote} onSaveRequest={() => setSaveModalOpen(true)} onGeneratePdfRequest={() => handleGeneratePdf()} onPrintRequest={handlePrint} onStartNew={() => { resetQuoteState(); setCurrentStep(1); }} onEdit={handleEditItem} onDelete={handleDeleteItem} calculatePriceDetails={calculatePriceDetails} appliedDiscounts={appliedDiscounts} onUpdateDiscounts={setAppliedDiscounts} />;
                default: return null;
            }
        }

        switch (currentStep) {
            case 1: return <Step1ModelSelection selectedProductLine={currentItemConfig.productLine} onUpdate={handleProductLineSelect} quantity={currentItemConfig.quantity} onUpdateQuantity={(q) => handleUpdateQuoteItem({ quantity: q })} />;
            case 2: return <Step1Dimensions quote={currentItemConfig} onUpdate={(width, length) => handleUpdateQuoteItem({ width, length })} />;
            case 3: return <Step2Model selectedModel={currentItemConfig.model} productLine={currentItemConfig.productLine} onSelect={(model) => handleUpdateQuoteItem({ model })} />;
            case 4: return <Step3Color {...updateColorProps} />;
            case 5: return <Step5Cuts selectedExtras={currentItemConfig.extras} productLine={currentItemConfig.productLine} baseWidth={currentItemConfig.width} baseLength={currentItemConfig.length} cutWidth={currentItemConfig.cutWidth} cutLength={currentItemConfig.cutLength} onUpdateCutDimensions={(dims) => handleUpdateQuoteItem(dims)} structFrames={currentItemConfig.structFrames} onUpdateStructFrames={(frames) => handleUpdateQuoteItem({ structFrames: frames })} onToggle={(extra) => { const isSelected = currentItemConfig.extras.some(e => e.id === extra.id); const otherCuts = currentItemConfig.extras.filter(e => e.id !== extra.id && !e.id.startsWith('corte')); handleUpdateQuoteItem({ extras: isSelected ? otherCuts : [...otherCuts, extra] }); }} />;
            case 6: return <Step6Accessories selectedExtras={currentItemConfig.extras} productLine={currentItemConfig.productLine} mainColor={currentItemConfig.color} bitonoColor={currentItemConfig.bitonoColor} onSelectBitonoColor={(color) => handleUpdateQuoteItem({ bitonoColor: color })} onToggle={(extra) => { const isSelected = currentItemConfig.extras.some(e => e.id === extra.id); const otherExtras = currentItemConfig.extras.filter(e => e.id !== extra.id); handleUpdateQuoteItem({ extras: isSelected ? otherExtras : [...otherExtras, extra], bitonoColor: isSelected ? null : currentItemConfig.bitonoColor }); }} />;
            case 7: return <Step5Summary items={quoteItems} totalPrice={finalTotalPrice} onReset={handleResetQuote} onSaveRequest={() => setSaveModalOpen(true)} onGeneratePdfRequest={() => handleGeneratePdf()} onPrintRequest={handlePrint} onStartNew={() => { resetQuoteState(); setCurrentStep(1); }} onEdit={handleEditItem} onDelete={handleDeleteItem} calculatePriceDetails={calculatePriceDetails} appliedDiscounts={appliedDiscounts} onUpdateDiscounts={setAppliedDiscounts} />;
            default: return null;
        }
    };
    
    const mainContent = () => {
        switch (view) {
            case 'welcome': return <WelcomePage userName={currentUser.preparedBy || currentUser.companyName} onNewQuote={handleNewQuote} onViewQuotes={() => handleNavigate('my-quotes')} onResumeQuote={handleNavigateToQuote} hasActiveQuote={quoteItems.length > 0} />;
            case 'my-quotes': return <MyQuotesPage user={currentUser} onDuplicateQuote={handleDuplicateQuote} onViewPdf={handleViewPdf} />;
            case 'conditions': return <CommercialConditionsPage />;
            case 'guides': return <MaintenanceGuidesPage />;
            case 'transparency': return <TransparencyPage />;
            case 'communications': return <CommunicationsPage onPlanVisit={() => setVisitModalOpen(true)} />;
            case 'quote': return (
                <div className="flex flex-col md:flex-row h-full">
                    {/* Main content area (steps, preview, buttons) */}
                    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
                         {/* Mobile Header with Step Info */}
                         <div className="md:hidden flex-shrink-0 p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                            <p className="text-sm font-bold text-slate-700 text-center">
                                Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1]?.title}
                            </p>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(currentStep / STEPS.length) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="p-4 md:p-6 lg:p-8 flex-grow">
                            {renderCurrentStep()}
                        </div>

                        {/* Conditional rendering solves the bug and UX issue */}
                        {currentStep < STEPS.length && (
                            <div className="flex-shrink-0">
                                <CurrentItemPreview config={currentItemConfig} price={currentItemBasePrice * currentItemConfig.quantity * (1 + VAT_RATE)} />
                                <NextPrevButtons 
                                    onNext={handleNextStep}
                                    onPrev={handlePrevStep}
                                    currentStep={currentStep}
                                    totalSteps={STEPS.length}
                                    isNextDisabled={isNextStepDisabled}
                                    isLastStep={currentStep === STEPS.length - 1}
                                    onDiscard={() => {
                                        if (window.confirm('¿Descartar cambios en este artículo y volver al resumen?')) {
                                            resetQuoteState();
                                            setCurrentStep(STEPS.length);
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop Sidebar */}
                    <div className="hidden md:block w-72 bg-white border-l border-slate-200 p-4 md:p-6 overflow-y-auto">
                        <StepTracker currentStep={currentStep} steps={STEPS} onStepClick={handleStepClick} />
                    </div>
                </div>
            );
            default: return null;
        }
    };

    const renderView = () => {
        if (!currentUser) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
                    <AuthPage onLogin={handleLogin} />
                </div>
            );
        }

        const SidebarLink: React.FC<{
            onClick: () => void;
            label: string;
            icon: React.ReactNode;
            isActive: boolean;
        }> = ({ onClick, label, icon, isActive }) => (
            <button
                onClick={onClick}
                className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'bg-teal-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
                <span className="mr-3">{icon}</span>
                {label}
            </button>
        );

        return (
            <div className="flex h-screen font-sans bg-slate-50 overflow-hidden">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-20 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}
                <aside className={`absolute md:relative z-30 w-64 bg-white border-r border-slate-200 p-4 flex-shrink-0 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    <div className="text-center mb-6 hidden md:block">
                        <h2 className="text-xl font-bold text-teal-600">AQG Comercial</h2>
                    </div>
                    <nav className="flex-grow space-y-2">
                        <SidebarLink label="Inicio" onClick={() => handleNavigate('welcome')} isActive={view === 'welcome'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} />
                        <SidebarLink label="Nuevo Presupuesto" onClick={handleNavigateToQuote} isActive={view === 'quote'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>} />
                        <SidebarLink label="Mis Presupuestos" onClick={() => handleNavigate('my-quotes')} isActive={view === 'my-quotes'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 011-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>} />
                         <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                            <SidebarLink label="Promociones" onClick={() => handleNavigate('conditions')} isActive={view === 'conditions'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>} />
                            <SidebarLink label="Descargas" onClick={() => handleNavigate('guides')} isActive={view === 'guides'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>} />
                            <SidebarLink label="Comunicaciones" onClick={() => handleNavigate('communications')} isActive={view === 'communications'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.083-3.083A6.983 6.983 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.417 11.583A5.012 5.012 0 004 10c0-2.209 2.239-4 5-4s5 1.791 5 4-2.239 4-5 4a5.012 5.012 0 00-1.583-.417z" clipRule="evenodd" /></svg>} />
                            <SidebarLink label="Transparencia" onClick={() => handleNavigate('transparency')} isActive={view === 'transparency'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h4v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4V6a2 2 0 00-2-2H4zm2 6a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4zm-6 6a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} />
                        </div>
                    </nav>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold">
                                {currentUser.companyName.charAt(0)}
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-sm text-slate-800">{currentUser.companyName}</p>
                                <p className="text-xs text-slate-500">{currentUser.email}</p>
                            </div>
                            <button onClick={() => setSettingsModalOpen(true)} className="text-slate-500 hover:text-teal-600" aria-label="Ajustes">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <button onClick={handleLogout} className="w-full mt-4 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                            Cerrar Sesión
                        </button>
                    </div>
                </aside>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="md:hidden flex-shrink-0 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-10">
                        <h2 className="text-xl font-bold text-teal-600">AQG Comercial</h2>
                        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-1" aria-label="Abrir menú">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </header>
                    
                    <main className="main-content flex-grow overflow-y-auto">
                        {view !== 'quote' && (
                            <div className="p-4 md:p-6 lg:p-8 h-full">
                                {mainContent()}
                            </div>
                        )}
                        {view === 'quote' && mainContent()}
                    </main>
                </div>
                
                {isCustomModalOpen && <CustomModal onClose={() => setCustomModalOpen(false)} />}
                {isDrainerModalOpen && <DrainerModal onClose={() => setDrainerModalOpen(false)} />}
                {isVisitModalOpen && <VisitModal onClose={() => setVisitModalOpen(false)} />}

                {isSettingsModalOpen && currentUser && (
                    <SettingsModal 
                        isOpen={isSettingsModalOpen}
                        onClose={() => setSettingsModalOpen(false)}
                        user={currentUser}
                        onSave={(settings) => {
                            const updatedUser = { ...currentUser, ...settings };
                            setCurrentUser(updatedUser);
                            const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
                            const updatedUsers = users.map(u => u.email === updatedUser.email ? { ...u, ...settings } : u);
                            localStorage.setItem('users', JSON.stringify(updatedUsers));
                        }}
                        onExport={handleExportData}
                        onImport={handleImportData}
                    />
                )}
                 {pdfPreviewUrl && <PdfPreviewModal url={pdfPreviewUrl} onClose={() => setPdfPreviewUrl(null)} />}
                 {isSaveModalOpen && currentUser && (
                    <SaveQuoteModal 
                        isOpen={isSaveModalOpen}
                        onClose={() => setSaveModalOpen(false)}
                        onSave={handleSaveQuote}
                        currentUser={currentUser}
                    />
                 )}
            </div>
        );
    };

    return renderView();
};

const CustomModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Plato de Ducha a Medida (CUSTOM)</h3>
                    <p className="text-sm text-slate-500">Requiere acción manual</p>
                </div>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
                Has seleccionado una fabricación especial. Este tipo de plato requiere un croquis detallado con las medidas y formas específicas.
                Por favor, envía el croquis a Sandra para poder procesar tu solicitud y proporcionarte un presupuesto.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
                <button onClick={onClose} className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cerrar</button>
                <a 
                    href="mailto:sandra.martinez@aqgbathrooms.com?subject=Solicitud de Presupuesto para Plato CUSTOM"
                    className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Enviar Email a Sandra
                </a>
            </div>
        </div>
    </div>
);

const DrainerModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">Colección DRAINER</h3>
            <p className="text-slate-600 mb-6">
                Este modelo pertenece a nuestro próximo catálogo y estará disponible para presupuestar muy pronto.
                Gracias por tu interés.
            </p>
            <div className="flex justify-center">
                <button onClick={onClose} className="px-10 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors">Entendido</button>
            </div>
        </div>
    </div>
);


export default App;
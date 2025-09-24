export interface ProductOption {
    id: string;
    name: string;
    description: string;
    price: number; // For extras
    priceFactor?: number; // For models
}

export interface ColorOption {
    id: string;
    name: string;
    hex: string;
    price: number;
}

export interface QuoteState {
    productLine: string | null;
    width: number;
    length: number;
    quantity: number;
    model: ProductOption | null;
    color: ColorOption | null;
    extras: ProductOption[];
    ralCode?: string;
    bitonoColor?: ColorOption | null;
    bitonoRalCode?: string;
    structFrames?: 1 | 2 | 3 | 4;

    // For Kits
    kitProduct?: ProductOption | null;
    invoiceReference?: string;
}

export interface QuoteItem extends QuoteState {
    id: string;
}

export interface User {
    email: string;
    companyName: string;
    preparedBy?: string;
    fiscalName?: string;
    sucursal?: string;
    discounts?: {
        showerTrays?: number;
        terrazzoShowerTrays?: number;
        countertops?: number;
        classicSpecialCondition?: string;
        classicSpecial?: {
            minQuantity: number;
            discount: number;
        };
    };
    promotion?: {
        id: string;
        activationTimestamp: number;
    };
}

export interface StoredUser extends User {
    password: string;
}

export interface SavedQuote {
    id: string;
    timestamp: number;
    userEmail: string;
    quoteItems: QuoteItem[];
    totalPrice: number; // For internal, it's the final internal price. For customer, it's the final customer price.
    orderedTimestamp?: number;
    customerName?: string;
    projectReference?: string;
    
    // New fields for quote separation
    type: 'internal' | 'customer';
    pvpTotalPrice?: number; // Total based on PVP, before any discounts
    customerDiscounts?: { [key:string]: number };
}
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
}

export interface QuoteItem extends QuoteState {
    id: string;
}

export interface User {
    email: string;
    companyName: string;
    logo?: string;
    preparedBy?: string;
    commercialName?: string;
}

export interface StoredUser extends User {
    password: string;
}

export interface SavedQuote {
    id: string;
    timestamp: number;
    userEmail: string;
    quoteItems: QuoteItem[];
    totalPrice: number;
    orderedTimestamp?: number;
    customerName?: string;
    projectReference?: string;
}
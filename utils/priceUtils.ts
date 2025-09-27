import type { QuoteState, QuoteItem, PriceDetails, User } from '../types';
import { PRICE_LIST, VAT_RATE, PROMO_ID, PROMO_DURATION_DAYS } from '../constants';

// This function calculates the base PVP price for a single item (quantity = 1)
export const calculateItemPrice = (item: QuoteState): number => {
    if (item.productLine === 'KITS') {
        // For kits, the price is fixed per item. The total for the line item is price * quantity.
        // This function returns the price for a single kit.
        return item.kitProduct?.price || 0;
    }

    const { productLine, width, length, model, color, extras, structFrames } = item;
    if (!productLine || !width || !length) return 0;
    
    // Get base price from the price list for the given dimensions
    let basePrice = PRICE_LIST[productLine]?.[width]?.[length] || 0;

    // Apply STRUCT DETAIL frames discount (price reduction)
    if (productLine === 'STRUCT DETAIL' && structFrames) {
        switch (structFrames) {
            case 3: basePrice *= 0.95; break; // 5% discount
            case 2: basePrice *= 0.90; break; // 10% discount
            case 1: basePrice *= 0.85; break; // 15% discount
            // case 4 has no discount
        }
    }

    // Initialize total with the calculated base price
    let total = basePrice;

    // Apply model price factor if it exists
    if (model?.priceFactor) {
        total *= model.priceFactor;
    }

    // Add price for color option
    if (color) {
        total += color.price;
    }

    // Add prices for all selected extras
    if (extras) {
        extras.forEach(extra => {
            total += extra.price;
        });
    }

    return total;
};


// This function calculates detailed pricing including discounts and VAT for a full quote item (including quantity)
export const calculatePriceDetails = (
    item: QuoteItem, 
    appliedDiscounts: { [key: string]: number }, 
    currentUser: User | null
): PriceDetails => {
    // Calculate the base PVP price for a single unit
    const singleItemPvp = calculateItemPrice(item);
    
    // Calculate the total PVP for the given quantity
    const pvpPrice = singleItemPvp * item.quantity;

    // Check for and apply the welcome promotion discount
    let promoDiscountPercent = 0;
    if (currentUser?.promotion?.id === PROMO_ID) {
        const activationTime = currentUser.promotion.activationTimestamp;
        // Calculate the promotion expiry time
        const expiryTime = activationTime + (PROMO_DURATION_DAYS * 24 * 60 * 60 * 1000);
        // Check if the promotion is still active
        if (Date.now() < expiryTime) {
            // The discount is 50% + 25%, which is a 62.5% total discount.
            // (1 - 0.5) * (1 - 0.25) = 0.5 * 0.75 = 0.375 price factor
            // The discount percentage is 1 - 0.375 = 0.625
            promoDiscountPercent = 0.625;
        }
    }
    
    // Get the specific discount for the product line, if any
    const lineDiscountPercent = (appliedDiscounts[item.productLine || ''] || 0) / 100;

    // Combine discounts multiplicatively: Price * (1 - PromoDiscount) * (1 - LineDiscount)
    const totalDiscountFactor = (1 - promoDiscountPercent) * (1 - lineDiscountPercent);
    
    // Calculate the price after applying all discounts
    const discountedPrice = pvpPrice * totalDiscountFactor;

    return {
        basePrice: pvpPrice, // Total PVP before any discounts
        discountedPrice: discountedPrice, // Price after discounts, before VAT
        finalPrice: discountedPrice * (1 + VAT_RATE), // Final price including VAT
        discountPercent: (1 - totalDiscountFactor) * 100, // The effective total discount percentage
    };
};

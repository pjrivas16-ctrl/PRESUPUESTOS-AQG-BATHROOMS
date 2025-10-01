import type { QuoteState, QuoteItem, PriceDetails } from '../types';
import { PRICE_LIST, VAT_RATE } from '../constants';

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
            if (productLine === 'LUXE' && ['rejilla-oro-cepillado-pvd', 'rejilla-oro-rosa-cepillado-pvd', 'rejilla-gun-metal-pvd'].includes(extra.id)) {
                switch (width) {
                    case 70:
                        total += 86;
                        break;
                    case 80:
                        total += 90;
                        break;
                    case 90:
                        total += 94;
                        break;
                    case 100:
                        total += 98;
                        break;
                    default:
                        // Fallback to static price if width is somehow not available
                        total += extra.price;
                        break;
                }
            } else {
                total += extra.price;
            }
        });
    }

    return total;
};


// This function calculates detailed pricing including discounts and VAT for a full quote item (including quantity)
export const calculatePriceDetails = (
    item: QuoteItem, 
    appliedDiscounts: { [key: string]: number }
): PriceDetails => {
    // Calculate the base PVP price for a single unit
    const singleItemPvp = calculateItemPrice(item);
    
    // Calculate the total PVP for the given quantity
    const pvpPrice = singleItemPvp * item.quantity;

    // KITS do not have discounts.
    if (item.productLine === 'KITS') {
        return {
            basePrice: pvpPrice,
            discountedPrice: pvpPrice,
            finalPrice: pvpPrice * (1 + VAT_RATE),
            discountPercent: 0,
        };
    }
    
    // Get the specific discount for the product line, if any
    const lineDiscountPercent = (appliedDiscounts[item.productLine || ''] || 0) / 100;
    
    // Calculate the price after applying all discounts
    const discountedPrice = pvpPrice * (1 - lineDiscountPercent);

    return {
        basePrice: pvpPrice, // Total PVP before any discounts
        discountedPrice: discountedPrice, // Price after discounts, before VAT
        finalPrice: discountedPrice * (1 + VAT_RATE), // Final price including VAT
        discountPercent: lineDiscountPercent * 100, // The effective total discount percentage
    };
};

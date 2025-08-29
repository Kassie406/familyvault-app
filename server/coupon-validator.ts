import { storage } from './storage';
import { coupons, couponRedemptions } from '../shared/schema';
import { eq, and, count } from 'drizzle-orm';

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  discountAmount?: number;
  discountType?: string;
}

export interface CouponEvaluationInput {
  code: string;
  planId?: string;
  subtotalCents?: number;
  userId?: string;
}

/**
 * Check if coupon is currently active
 */
export function isActive(coupon: any, now = new Date()): boolean {
  if (coupon.archived) return false;
  if (coupon.startsAt && new Date(coupon.startsAt) > now) return false;
  if (coupon.endsAt && new Date(coupon.endsAt) < now) return false;
  return coupon.active;
}

/**
 * Check if coupon can apply to specific plan
 */
export function canApplyToPlan(coupon: any, planId?: string): boolean {
  if (!planId) return true;
  
  // Check denied plans first (takes precedence)
  if (coupon.deniedPlanIds && coupon.deniedPlanIds.includes(planId)) {
    return false;
  }
  
  // Check allowed plans (if specified)
  if (coupon.allowedPlanIds && coupon.allowedPlanIds.length > 0) {
    return coupon.allowedPlanIds.includes(planId);
  }
  
  return true;
}

/**
 * Validate and evaluate coupon discount
 */
export async function validateCoupon(input: CouponEvaluationInput): Promise<CouponValidationResult> {
  const { code, planId, subtotalCents = 0, userId } = input;
  
  // For now, use mock implementation until we connect to real DB
  // In production, this would query the actual enhanced coupons table
  const coupon = null;
  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }
  
  // Check if active
  if (!isActive(coupon)) {
    return { valid: false, error: 'Coupon is not active or has expired' };
  }
  
  // Check plan restrictions
  if (!canApplyToPlan(coupon, planId)) {
    return { valid: false, error: 'Coupon not valid for this plan' };
  }
  
  // Check minimum subtotal
  if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents) {
    return { 
      valid: false, 
      error: `Minimum order value of $${(coupon.minSubtotalCents / 100).toFixed(2)} required`
    };
  }
  
  // Check global usage limit
  if (coupon.maxRedemptions) {
    if (coupon.timesRedeemed >= coupon.maxRedemptions) {
      return { valid: false, error: 'Coupon has reached its usage limit' };
    }
  }
  
  // Check per-user limit
  if (userId && coupon.perUserLimit) {
    const userRedemptions = await db
      .select({ count: count() })
      .from(couponRedemptions)
      .where(and(
        eq(couponRedemptions.couponId, coupon.id),
        eq(couponRedemptions.userId, userId)
      ));
      
    if (userRedemptions[0]?.count >= coupon.perUserLimit) {
      return { valid: false, error: 'You have already used this coupon the maximum number of times' };
    }
  }
  
  // Calculate discount
  let discountAmount = 0;
  const couponValue = parseFloat(coupon.value);
  
  switch (coupon.type) {
    case 'percentage':
      discountAmount = Math.round(subtotalCents * (couponValue / 100));
      break;
    case 'fixed_amount':
      discountAmount = couponValue * 100; // Convert to cents
      break;
    case 'free_trial_days':
      // For subscription trials
      discountAmount = 0;
      break;
    default:
      return { valid: false, error: 'Invalid coupon type' };
  }
  
  // Ensure discount doesn't exceed subtotal
  if (discountAmount > subtotalCents) {
    discountAmount = subtotalCents;
  }
  
  return {
    valid: true,
    discountAmount,
    discountType: coupon.type
  };
}

/**
 * Check if multiple coupons can be stacked
 */
export async function validateCouponStacking(couponCodes: string[]): Promise<{
  valid: boolean;
  error?: string;
  totalDiscount?: number;
}> {
  if (couponCodes.length <= 1) {
    return { valid: true, totalDiscount: 0 };
  }
  
  const couponsResult = await db
    .select()
    .from(coupons)
    .where(and(
      eq(coupons.archived, false),
      eq(coupons.active, true)
    ));
    
  const appliedCoupons = couponsResult.filter(c => 
    couponCodes.includes(c.code.toUpperCase())
  );
  
  // Check if all coupons allow stacking
  const nonStackable = appliedCoupons.find((c: any) => !c.allowStacking);
  if (nonStackable) {
    return { 
      valid: false, 
      error: `Coupon ${nonStackable.code} cannot be combined with other coupons`
    };
  }
  
  return { valid: true, totalDiscount: 0 };
}
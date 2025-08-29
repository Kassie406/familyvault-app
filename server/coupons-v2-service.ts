import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface CouponV2 {
  id?: string;
  code: string;
  campaign_id?: string;
  type: 'percent' | 'amount' | 'free_trial_days';
  value: number;
  currency?: string;
  max_redemptions?: number;
  per_user_limit: number;
  allow_stacking: boolean;
  min_subtotal_cents?: number;
  allowed_plan_ids?: string[];
  denied_plan_ids?: string[];
  starts_at?: Date;
  ends_at?: Date;
  is_recurring: boolean;
  metadata?: any;
  archived: boolean;
}

export interface CouponCampaign {
  id?: string;
  name: string;
  starts_at?: Date;
  ends_at?: Date;
}

export interface CouponRedemption {
  id?: string;
  coupon_id: string;
  user_id: string;
  org_id?: string;
  plan_id?: string;
  order_id?: string;
  amount_cents?: number;
}

export interface CouponEvaluation {
  valid: boolean;
  error?: string;
  discount_amount?: number;
  discount_type?: string;
  final_amount?: number;
}

export class CouponsV2Service {
  async isActive(coupon: CouponV2, now: Date = new Date()): Promise<boolean> {
    if (coupon.archived) return false;
    if (coupon.starts_at && new Date(coupon.starts_at) > now) return false;
    if (coupon.ends_at && new Date(coupon.ends_at) < now) return false;
    return true;
  }

  async canApplyToPlan(coupon: CouponV2, planId: string): Promise<boolean> {
    if (coupon.denied_plan_ids?.includes(planId)) return false;
    if (coupon.allowed_plan_ids && coupon.allowed_plan_ids.length > 0) {
      return coupon.allowed_plan_ids.includes(planId);
    }
    return true;
  }

  async getAllCoupons(): Promise<CouponV2[]> {
    try {
      const rows = await sql`
        SELECT c.*, 
          (SELECT COUNT(*)::int FROM coupon_redemptions r WHERE r.coupon_id = c.id) AS redemption_count
         FROM coupons_v2 c WHERE archived = FALSE ORDER BY created_at DESC`;
      return rows.map((row: any) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        redemption_count: row.redemption_count || 0
      }));
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  }

  async createCoupon(coupon: Partial<CouponV2>): Promise<CouponV2> {
    const rows = await sql`
      INSERT INTO coupons_v2 (code, campaign_id, type, value, currency, max_redemptions, per_user_limit,
        allow_stacking, min_subtotal_cents, allowed_plan_ids, denied_plan_ids, starts_at, ends_at,
        is_recurring, metadata)
       VALUES (${coupon.code}, ${coupon.campaign_id || null}, ${coupon.type}, ${coupon.value}, 
               ${coupon.currency || null}, ${coupon.max_redemptions || null}, ${coupon.per_user_limit ?? 1}, 
               ${coupon.allow_stacking ?? false}, ${coupon.min_subtotal_cents || null},
               ${coupon.allowed_plan_ids || null}, ${coupon.denied_plan_ids || null},
               ${coupon.starts_at || null}, ${coupon.ends_at || null}, ${coupon.is_recurring ?? false}, 
               ${JSON.stringify(coupon.metadata || {})})
       RETURNING *`;
    return rows[0];
  }

  async updateCoupon(id: string, coupon: Partial<CouponV2>): Promise<CouponV2> {
    const rows = await sql`
      UPDATE coupons_v2 SET
         code=${coupon.code}, campaign_id=${coupon.campaign_id || null}, type=${coupon.type}, 
         value=${coupon.value}, currency=${coupon.currency || null},
         max_redemptions=${coupon.max_redemptions || null}, per_user_limit=${coupon.per_user_limit ?? 1}, 
         allow_stacking=${coupon.allow_stacking ?? false}, min_subtotal_cents=${coupon.min_subtotal_cents || null},
         allowed_plan_ids=${coupon.allowed_plan_ids || null}, denied_plan_ids=${coupon.denied_plan_ids || null},
         starts_at=${coupon.starts_at || null}, ends_at=${coupon.ends_at || null},
         is_recurring=${coupon.is_recurring ?? false}, metadata=${JSON.stringify(coupon.metadata || {})}
       WHERE id=${id}
       RETURNING *`;
    return rows[0];
  }

  async archiveCoupon(id: string): Promise<void> {
    await sql`UPDATE coupons_v2 SET archived=TRUE WHERE id=${id}`;
  }

  async evaluateCoupon(
    code: string, 
    planId?: string, 
    subtotalCents?: number, 
    userId?: string
  ): Promise<CouponEvaluation> {
    try {
      const rows = await sql`SELECT * FROM coupons_v2 WHERE code=${code.toUpperCase()} AND archived=FALSE`;
      
      const coupon = rows[0];
      if (!coupon) {
        return { valid: false, error: 'Invalid coupon code' };
      }

      if (!(await this.isActive(coupon))) {
        return { valid: false, error: 'Coupon is not currently active' };
      }

      if (coupon.min_subtotal_cents && subtotalCents && subtotalCents < coupon.min_subtotal_cents) {
        return { valid: false, error: `Minimum order amount is $${(coupon.min_subtotal_cents / 100).toFixed(2)}` };
      }

      if (planId && !(await this.canApplyToPlan(coupon, planId))) {
        return { valid: false, error: 'Coupon not valid for this plan' };
      }

      // Check global usage limit
      if (coupon.max_redemptions) {
        const usage = await sql`SELECT COUNT(*) as count FROM coupon_redemptions WHERE coupon_id=${coupon.id}`;
        if (usage[0].count >= coupon.max_redemptions) {
          return { valid: false, error: 'Coupon usage limit reached' };
        }
      }

      // Check per-user limit
      if (userId && coupon.per_user_limit) {
        const userUsage = await sql`SELECT COUNT(*) as count FROM coupon_redemptions WHERE coupon_id=${coupon.id} AND user_id=${userId}`;
        if (userUsage[0].count >= coupon.per_user_limit) {
          return { valid: false, error: 'You have already used this coupon the maximum number of times' };
        }
      }

      // Calculate discount
      let discount_amount = 0;
      let final_amount = subtotalCents || 0;

      if (coupon.type === 'percent') {
        discount_amount = Math.floor((subtotalCents || 0) * (coupon.value / 100));
        final_amount = (subtotalCents || 0) - discount_amount;
      } else if (coupon.type === 'amount') {
        discount_amount = Math.min(coupon.value * 100, subtotalCents || 0); // Convert to cents
        final_amount = (subtotalCents || 0) - discount_amount;
      }

      return {
        valid: true,
        discount_amount,
        discount_type: coupon.type,
        final_amount: Math.max(0, final_amount)
      };
    } catch (error) {
      console.error('Error evaluating coupon:', error);
      return { valid: false, error: 'Failed to evaluate coupon' };
    }
  }

  async redeemCoupon(
    couponId: string,
    userId: string,
    options: {
      orgId?: string;
      planId?: string;
      orderId?: string;
      amountCents?: number;
    } = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await sql`INSERT INTO coupon_redemptions (coupon_id, user_id, org_id, plan_id, order_id, amount_cents)
         VALUES (${couponId}, ${userId}, ${options.orgId}, ${options.planId}, ${options.orderId}, ${options.amountCents})`;
      return { success: true };
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      return { success: false, error: 'Failed to redeem coupon' };
    }
  }

  // Campaign management
  async getAllCampaigns(): Promise<CouponCampaign[]> {
    try {
      const rows = await sql`
        SELECT c.*, 
          (SELECT COUNT(*) FROM coupons_v2 cp WHERE cp.campaign_id = c.id) as coupon_count
         FROM coupon_campaigns c ORDER BY created_at DESC`;
      return rows;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async createCampaign(campaign: Partial<CouponCampaign>): Promise<CouponCampaign> {
    const rows = await sql`
      INSERT INTO coupon_campaigns (name, starts_at, ends_at)
       VALUES (${campaign.name}, ${campaign.starts_at}, ${campaign.ends_at}) RETURNING *`;
    return rows[0];
  }
}

export const couponsV2Service = new CouponsV2Service();
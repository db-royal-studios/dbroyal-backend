import { Injectable, BadRequestException } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeProvider {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    this.stripe = new Stripe(apiKey, {
      apiVersion: "2025-11-17.clover",
    });
  }

  /**
   * Create a Payment Intent for UK payments
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: {
      bookingId: string;
      clientId: string;
      description?: string;
    },
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Retrieve a Payment Intent
   */
  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Confirm a Payment Intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(
        `Failed to confirm payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Cancel a Payment Intent
   */
  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(
        `Failed to cancel payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<Stripe.Refund> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = amount;
      }

      if (reason) {
        refundData.reason = reason as Stripe.RefundCreateParams.Reason;
      }

      return await this.stripe.refunds.create(refundData);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create refund: ${error.message}`,
      );
    }
  }

  /**
   * Retrieve customer payment methods
   */
  async listPaymentMethods(
    customerId: string,
  ): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });
      return paymentMethods.data;
    } catch (error) {
      throw new BadRequestException(
        `Failed to list payment methods: ${error.message}`,
      );
    }
  }

  /**
   * Construct webhook event from request
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${error.message}`,
      );
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_PRIVATE_API_KEY') as string, {
    });
  }

  async createProduct(productData: any) {
    const product = await this.stripe.products.create({
      name: productData.name,
      default_price_data: { currency: "eur", unit_amount_decimal: productData.default_price },
      description: productData.description,
    });
  }

  // async createPaymentIntent(paymentData: any) {
  //   try {
  //     const response = await axios.post('STRIPE_API_ENDPOINT', {
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException('An error occurred when creating the payment intent.');
  //   }
  // }
}


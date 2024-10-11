// src/stripe/stripe.controller.ts

import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('create-product')
  async createProduct(@Body() productData: any) {
    return await this.stripeService.createProduct(productData);
  }

  // @Post('payment')
  // async createPaymentIntent(@Body() paymentData: any) {
  //   return await this.stripeService.createPaymentIntent(paymentData);
  // }
}

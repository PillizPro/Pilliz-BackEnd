import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'src/prisma/prisma.service'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private _stripe: Stripe | undefined
  // constructor(
  //   private readonly prismaService: PrismaService,
  //   private readonly configService: ConfigService
  // ) {
  //   this._stripe =
  //     process.env.NODE_ENV === 'gha'
  //       ? undefined
  //       : new Stripe(
  //           this.configService.get('STRIPE_PRIVATE_API_KEY') as string,
  //           {}
  //         )
  // }

  async createProduct(productData: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const product = await this._stripe?.products.create({
      name: productData.name,
      default_price_data: {
        currency: 'eur',
        unit_amount_decimal: productData.default_price,
      },
      description: productData.description,
    })
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

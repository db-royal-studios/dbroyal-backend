import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ConfirmStripePaymentDto {
  @ApiProperty({
    description: "Stripe Payment Intent ID",
    example: "pi_xxxxxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  paymentIntentId: string;
}

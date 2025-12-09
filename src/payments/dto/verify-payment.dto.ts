import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class VerifyPaymentDto {
  @ApiProperty({
    description: "Payment ID to verify",
    example: "clxxx123456789",
  })
  @IsUUID()
  paymentId: string;

  @ApiProperty({
    description: "Whether to approve or reject the payment",
    example: true,
  })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({
    description: "Admin notes about the verification",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

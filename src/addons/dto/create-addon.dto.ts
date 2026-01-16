import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsArray,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { Country } from "@prisma/client";

export class AddOnPricingDto {
  @ApiProperty({ enum: Country, description: "Country for pricing" })
  @IsEnum(Country)
  country: Country;

  @ApiProperty({ description: "Price in local currency" })
  @IsNumber()
  price: number;

  @ApiProperty({ description: "Currency code (e.g., GBP, NGN)" })
  @IsString()
  currency: string;
}

export class CreateAddOnDto {
  @ApiProperty({ description: "Service ID this add-on belongs to" })
  @IsString()
  serviceId: string;

  @ApiProperty({ description: "Add-on name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "URL-friendly slug" })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: "Add-on description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Whether add-on is visible",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: "Sort order for display", default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    description: "Pricing for different countries",
    type: [AddOnPricingDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnPricingDto)
  pricing: AddOnPricingDto[];
}

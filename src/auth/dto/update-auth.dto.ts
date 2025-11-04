import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}

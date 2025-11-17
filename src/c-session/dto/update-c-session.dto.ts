import { PartialType } from '@nestjs/mapped-types';
import { CreateCSessionDto } from './create-c-session.dto';

export class UpdateCSessionDto extends PartialType(CreateCSessionDto) {}

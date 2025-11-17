import { PartialType } from '@nestjs/mapped-types';
import { CreateASessionDto } from './create-a-session.dto';

export class UpdateASessionDto extends PartialType(CreateASessionDto) {}

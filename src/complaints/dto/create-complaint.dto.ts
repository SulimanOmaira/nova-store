import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ComplaintPriority } from '../entities/complaint.entity';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  Subject: string;

  @IsString()
  @IsNotEmpty()
  Description: string;

  @IsOptional()
  @IsEnum(ComplaintPriority)
  Priority?: ComplaintPriority;
}

// src/auth/dto/create-super-admin.dto.ts
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSuperAdminDto {
  @IsString() F_Name: string;
  @IsString() M_Name: string;
  @IsString() L_Name: string;

  @IsString() UserName: string;
  @IsString() Phone_Number: string;

  @IsString()
  @MinLength(6)
  Password: string;

  // فقط للـ bootstrap
  @IsOptional()
  @IsString()
  bootstrapSecret?: string;

  @IsOptional()
  @IsString()
  Status_Id?: string;
}

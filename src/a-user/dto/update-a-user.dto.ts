import { PartialType } from '@nestjs/mapped-types';
import { CreateAUserDto } from './create-a-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAUserDto extends PartialType(CreateAUserDto) {
        @IsString()
        @IsOptional()
        F_Name;
    
        @IsString()
        @IsOptional()
        M_Name;
    
        @IsString()
        @IsOptional()
        L_Name;
    
        @IsString()
        @IsOptional()
        Phone_Number;
        
        @IsString()
        @IsOptional()
        Password;
}

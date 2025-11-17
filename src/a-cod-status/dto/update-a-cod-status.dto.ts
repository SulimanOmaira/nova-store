import { PartialType } from '@nestjs/mapped-types';
import { CreateACodStatusDto } from './create-a-cod-status.dto';
import { IsString } from 'class-validator';

export class UpdateACodStatusDto extends PartialType(CreateACodStatusDto) {
        @IsString() 
        Ar_Name : string;
    
        @IsString()
        En_Name : string;
}

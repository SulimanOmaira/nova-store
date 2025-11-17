import { PartialType } from '@nestjs/mapped-types';
import { CreateACodLangDto } from './create-a-cod-lang.dto';
import { IsString } from 'class-validator';

export class UpdateACodLangDto extends PartialType(CreateACodLangDto) {
        @IsString() 
        Ar_Name : string;
    
        @IsString()
        En_Name : string;
}

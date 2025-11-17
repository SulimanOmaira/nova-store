import { IsString } from "class-validator";

export class CreateACodStatusDto {
        @IsString() 
        Ar_Name : string;
    
        @IsString()
        En_Name : string;
}

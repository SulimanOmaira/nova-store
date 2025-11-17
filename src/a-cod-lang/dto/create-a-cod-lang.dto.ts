import { IsString } from "class-validator";

export class CreateACodLangDto {
    @IsString() 
    Ar_Name : string;

    @IsString()
    En_Name : string;
}

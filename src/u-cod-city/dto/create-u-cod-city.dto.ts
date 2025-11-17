import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUCodCityDto {

    @IsString()
    @IsNotEmpty()
    Ar_Name: string;

    @IsString()
    @IsNotEmpty()
    En_Name: string;

    @IsOptional()
    @IsString()
    Created_By?:String
}

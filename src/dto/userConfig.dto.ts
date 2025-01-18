import { IsOptional, IsString } from "class-validator";

export class UserConfigDTO {

    @IsString()
    @IsOptional()
    twitchChannel?: string
}
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserConfigDTO } from "../dto/userConfig.dto";

export async function validateUserConfig(input: any) {
    const userConfig = plainToInstance(UserConfigDTO, input);
    const errors = await validate(userConfig);

    if (errors.length > 0) {
        console.error("Erro na validação:", errors);
        throw new Error("Configuração inválida.");
    }

    return userConfig;
}

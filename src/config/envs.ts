import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    PRODUCT_MICROSERVICE_HOST: string;
    PRODUCT_MICROSERVICE_PORT: number;
}

const envVarsSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCT_MICROSERVICE_HOST: joi.string().required(),
    PRODUCT_MICROSERVICE_PORT: joi.number().required(),
}).unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    productMicroservice: {
        host: envVars.PRODUCT_MICROSERVICE_HOST,
        port: envVars.PRODUCT_MICROSERVICE_PORT,
    },
};
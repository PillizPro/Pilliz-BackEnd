import * as Joi from 'joi'

const CONFIG_SCHEMA_VALIDATAION = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_SCHEMA: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
})

export default CONFIG_SCHEMA_VALIDATAION

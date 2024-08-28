import * as Joi from 'joi'

const ENV = process.env.NODE_ENV

const CONFIG_SCHEMA_VALIDATAION = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'gha', 'staging', 'production')
    .required(),
  DB_HOST: ENV === 'gha' ? Joi.string() : Joi.string().required(),
  DB_PORT: ENV === 'gha' ? Joi.number() : Joi.number().required(),
  POSTGRES_PASSWORD: ENV === 'gha' ? Joi.string() : Joi.string().required(),
  POSTGRES_USER: ENV === 'gha' ? Joi.string() : Joi.string().required(),
  POSTGRES_DB: ENV === 'gha' ? Joi.string() : Joi.string().required(),
  POSTGRES_SCHEMA: ENV === 'gha' ? Joi.string() : Joi.string().required(),
  DATABASE_URL:
    ENV === 'gha'
      ? Joi.string().default(
          'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA}'
        )
      : Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET:
    ENV === 'gha' ? Joi.string().default('default') : Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME:
    ENV === 'gha' ? Joi.string() : Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET:
    ENV === 'gha' ? Joi.string().default('default') : Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME:
    ENV === 'gha' ? Joi.string() : Joi.string().required(),
})

export default CONFIG_SCHEMA_VALIDATAION

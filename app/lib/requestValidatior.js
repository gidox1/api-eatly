import logger from "./logger.js";

const requestValidator = (
  dataObject,
  schema,
  res,
  next,
) => {
  const resolver = schema.validate(dataObject);
  if (resolver.error instanceof Error) {
    logger.error('Validation erorr: ', resolver.error);
    return res.status(422).send({
      error: true,
      code: 'schemaValidationFailed',
      json: resolver.error
    });
  }
  next();
};

export default requestValidator;
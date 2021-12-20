const Joi = require("joi");

const AnimalSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(30).required(),
  image: Joi.string().min(3).required(),
});

module.exports = AnimalSchema;

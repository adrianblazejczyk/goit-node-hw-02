const Joi = require("joi");

const customMessages = {
  "any.required": `Missing required {{#label}} - field`,
};

const userSchema = Joi.object({
  email: Joi.string().email().required().messages(customMessages),
  password: Joi.string().min(3).required().messages(customMessages),
});
const userEmail = Joi.object({
  email: Joi.string().email().required().messages(customMessages),
});

module.exports = { userSchema, userEmail };

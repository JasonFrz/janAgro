const Joi = require("joi");

const cartItemSchema = Joi.object({
  prodcts: Joi.string().hex().length(24),
  quantitas: Joi.number().integer().min(1),
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(5).max(20).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  alamat: Joi.string().required(),
  no_telp: Joi.string().required(),
  role: Joi.string().valid("pengguna", "admin", "pemilik").required(),
  cart: Joi.array().items(cartItemSchema).optional(),
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(5).max(20).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

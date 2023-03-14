const Joi = require("joi");

const schemaCreateContact = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
})

const schemaUpdateContact = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
}).min(1);

const schemaUpdateStatusContact = Joi.object({
    favorite: Joi.boolean().required(),
})

module.exports = {
    schemaCreateContact,
    schemaUpdateContact,
    schemaUpdateStatusContact
}
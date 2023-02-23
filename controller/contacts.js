const Contact = require('../models/contact');
const {
    schemaCreateContact,
    schemaUpdateContact,
    schemaUpdateStatusContact
} = require("../schema/validateSchema");

const getAll = async (req, res, next) => {
    try {
        const contactList = await Contact.find()
        res.json(contactList)
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const getContactById = async (req, res, next) => {
    const { contactId } = req.params;

    try {
        const result = await Contact.findById({ _id: contactId })
        if (result) {
            res.json(result)
        }
        else {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: `Not found contact id: ${contactId}`,
                data: 'Not Found',
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const addContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const { error, value } = schemaCreateContact.validate({ name, phone, email })

    if (error) {
        return res.status(400).json({ message: "missing required name field" });
    }

    try {
        const newContact = await Contact.create(value)
        res.status(201).json(newContact);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const removeContact = async (req, res, next) => {
    const { contactId } = req.params;

    try {
        const result = await Contact.findByIdAndRemove({ _id: contactId })
        if (result) {
            res.json(result)
        }
        else {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: `Not found contact id: ${contactId}`,
                data: 'Not Found',
            })
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const { error, value } = schemaUpdateContact.validate({ name, phone, email })

    if (error) {
        return res.status(400).json({ message: "missing required name field" });
    }

    try {
        const result = await Contact.findOneAndUpdate({ _id: contactId }, value, { returnOriginal: false });
        if (result) {
            res.json(result)
        }
        else {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: `Not found contact id: ${contactId}`,
                data: 'Not Found',
            })
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const updateStatusContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite = false } = req.body;

    if (!favorite) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'missing field favorite',
        })
    }

    const { error, value } = schemaUpdateStatusContact.validate({ favorite })

    if (error) {
        return res.status(400).json({ message: "missing required name field" });
    }

    try {
        const result = await Contact.findByIdAndUpdate({ _id: contactId }, value, { returnOriginal: false })
        if (result) {
            res.json(result)
        }
        else {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: `Not found contact id: ${contactId}`,
                data: 'Not Found',
            })
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    getAll,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact
}

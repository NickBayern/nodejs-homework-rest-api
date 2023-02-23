const route = require("express").Router();
const { getAll, getContactById, addContact, removeContact, updateContact, updateStatusContact } = require("../../controller/contacts");

route.get('/', getAll);
route.post('/', addContact);
route.get('/:contactId', getContactById);
route.delete('/:contactId', removeContact);
route.put('/:contactId', updateContact);
route.patch('/:contactId/favorite', updateStatusContact)

module.exports = route;
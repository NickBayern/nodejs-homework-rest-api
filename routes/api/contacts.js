const route = require("express").Router();
const { getAll, getContactById, addContact, removeContact, updateContact, updateStatusContact } = require("../../controller/contacts");
const authenticate = require("../../middlewares/authenticate")


route.get('/', authenticate, getAll);
route.post('/', authenticate, addContact);
route.get('/:contactId', authenticate, getContactById);
route.delete('/:contactId', authenticate, removeContact);
route.put('/:contactId', authenticate, updateContact);
route.patch('/:contactId/favorite', authenticate, updateStatusContact)

module.exports = route;
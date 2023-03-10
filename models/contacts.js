const fs = require("fs/promises");
const path = require('path');
// const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json')

const listContacts = async () => {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  return result || null
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result
}

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    // id: uuidv4(),
    id: String(contacts.length + 1),
    name,
    email,
    phone,
  }
  const contactList = JSON.stringify([...contacts, newContact], null, 2)
  await fs.writeFile(contactsPath, contactList)
  return newContact
}

const updateContact = async (contactId, { name, phone, email }) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId)
  const [contact] = contacts.filter((el) => el.id === contactId)

  if (!contact) {
    return null
  }
  console.log(contact);
  if (name) {
    contact.name = name
  }
  if (phone) {
    contact.phone = phone
  }
  if (email) {
    contact.email = email
  }

  const [result] = contacts.splice(index, 1, contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result

}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
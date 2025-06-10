import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for runtime modifications
let contacts = [...contactsData];

const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastContact: null
    };
    contacts = [newContact, ...contacts];
    return { ...newContact };
  },

  async update(id, updates) {
    await delay(350);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts[index] = { ...contacts[index], ...updates };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts = contacts.filter(c => c.id !== id);
    return true;
  }
};

export default contactService;
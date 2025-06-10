import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for runtime modifications
let deals = [...dealsData];

const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    deals = [newDeal, ...deals];
    return { ...newDeal };
  },

  async update(id, updates) {
    await delay(350);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals[index] = { ...deals[index], ...updates };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals = deals.filter(d => d.id !== id);
    return true;
  }
};

export default dealService;
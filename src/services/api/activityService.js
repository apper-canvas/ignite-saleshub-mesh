import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for runtime modifications
let activities = [...activitiesData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      date: activityData.date || new Date().toISOString()
    };
    activities = [newActivity, ...activities];
    return { ...newActivity };
  },

  async update(id, updates) {
    await delay(350);
    const index = activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    activities[index] = { ...activities[index], ...updates };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    activities = activities.filter(a => a.id !== id);
    return true;
  }
};

export default activityService;
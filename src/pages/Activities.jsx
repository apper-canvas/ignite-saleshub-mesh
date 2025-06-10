import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { activityService, contactService, dealService } from '../services';

const ActivityCard = ({ activity, contact, deal, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      case 'meeting': return 'Calendar';
      case 'note': return 'FileText';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'bg-info/10 text-info border-info/20';
      case 'email': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'meeting': return 'bg-accent/10 text-accent border-accent/20';
      case 'note': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
            <ApperIcon name={getActivityIcon(activity.type)} size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{activity.description}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {contact?.name || 'Unknown'}
              </p>
              {deal && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Deal:</span> {deal.title}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Clock" size={14} className="mr-1" />
                  {activity.duration} min
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(activity)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityModal = ({ activity, contacts, deals, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'call',
    contactId: '',
    dealId: '',
    description: '',
    date: '',
    duration: 30
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        ...activity,
        date: activity.date ? activity.date.split('T')[0] : ''
      });
    } else {
      setFormData({
        type: 'call',
        contactId: contacts[0]?.id || '',
        dealId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        duration: 30
      });
    }
  }, [activity, contacts, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {activity ? 'Edit Activity' : 'Log Activity'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <select
                required
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select a contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} - {contact.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal (Optional)
              </label>
              <select
                value={formData.dealId}
                onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">No associated deal</option>
                {deals.map(deal => (
                  <option key={deal.id} value={deal.id}>
                    {deal.title} - ${deal.value.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the activity..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {activity ? 'Update' : 'Log Activity'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (activityData) => {
    try {
      if (editingActivity) {
        const updated = await activityService.update(editingActivity.id, activityData);
        setActivities(prev => prev.map(a => a.id === editingActivity.id ? updated : a));
        toast.success('Activity updated successfully');
      } else {
        const created = await activityService.create(activityData);
        setActivities(prev => [created, ...prev]);
        toast.success('Activity logged successfully');
      }
      setModalOpen(false);
      setEditingActivity(null);
    } catch (err) {
      toast.error('Failed to save activity');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.delete(id);
        setActivities(prev => prev.filter(a => a.id !== id));
        toast.success('Activity deleted successfully');
      } catch (err) {
        toast.error('Failed to delete activity');
      }
    }
  };

  const filteredActivities = activities.filter(activity => 
    typeFilter === 'all' || activity.type === typeFilter
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load activities</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Track all customer interactions and touchpoints</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingActivity(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Log Activity</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Activities', icon: 'Activity' },
          { id: 'call', label: 'Calls', icon: 'Phone' },
          { id: 'email', label: 'Emails', icon: 'Mail' },
          { id: 'meeting', label: 'Meetings', icon: 'Calendar' },
          { id: 'note', label: 'Notes', icon: 'FileText' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setTypeFilter(filter.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ApperIcon name={filter.icon} size={14} />
            <span>{filter.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              typeFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {filter.id === 'all' 
                ? activities.length 
                : activities.filter(a => a.type === filter.id).length
              }
            </span>
          </button>
        ))}
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Activity" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {typeFilter === 'all' ? 'No activities yet' : `No ${typeFilter} activities`}
          </h3>
          <p className="text-gray-600 mb-4">
            {typeFilter === 'all' 
              ? 'Start logging your customer interactions'
              : 'Try adjusting your filter or log a new activity'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingActivity(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Log First Activity
          </motion.button>
        </div>
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActivityCard
                  activity={activity}
                  contact={contacts.find(c => c.id === activity.contactId)}
                  deal={deals.find(d => d.id === activity.dealId)}
                  onEdit={setEditingActivity}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Activity Modal */}
      <ActivityModal
        activity={editingActivity}
        contacts={contacts}
        deals={deals}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Activities;
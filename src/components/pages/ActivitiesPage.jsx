import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import EmptyState from '@/components/atoms/EmptyState';
import ActivityCard from '@/components/organisms/ActivityCard';
import ActivityFormModal from '@/components/organisms/ActivityFormModal';
import { activityService, contactService, dealService } from '@/services'; // Keep service imports as in original

const ActivitiesPage = () => {
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
        <EmptyState
          iconName="AlertCircle"
          title="Unable to load activities"
          description={error}
          buttonText="Try Again"
          onButtonClick={loadData}
        />
      </div>
    );
  }

  const activityFilters = [
    { id: 'all', label: 'All Activities', icon: 'Activity' },
    { id: 'call', label: 'Calls', icon: 'Phone' },
    { id: 'email', label: 'Emails', icon: 'Mail' },
    { id: 'meeting', label: 'Meetings', icon: 'Calendar' },
    { id: 'note', label: 'Notes', icon: 'FileText' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Track all customer interactions and touchpoints</p>
        </div>
        <Button
          onClick={() => {
            setEditingActivity(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Log Activity</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {activityFilters.map(filter => (
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
        <EmptyState
          iconName="Activity"
          title={typeFilter === 'all' ? 'No activities yet' : `No ${typeFilter} activities`}
          description={typeFilter === 'all'
            ? 'Start logging your customer interactions'
            : 'Try adjusting your filter or log a new activity'
          }
          buttonText={!typeFilter || typeFilter === 'all' ? 'Log First Activity' : null}
          onButtonClick={() => {
            setEditingActivity(null);
            setModalOpen(true);
          }}
        />
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
                  onEdit={(act) => {
                    setEditingActivity(act);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Activity Modal */}
      <ActivityFormModal
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

export default ActivitiesPage;
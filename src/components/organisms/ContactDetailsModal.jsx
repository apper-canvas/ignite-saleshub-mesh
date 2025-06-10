import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Spinner from '@/components/atoms/Spinner';
import { toast } from 'react-toastify';
import { dealService, activityService } from '@/services'; // Keep service imports as in original

const ContactDetailsModal = ({ contact, isOpen, onClose }) => {
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && contact) {
      loadContactData();
    }
  }, [isOpen, contact]);

  const loadContactData = async () => {
    setLoading(true);
    try {
      const [dealsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        activityService.getAll()
      ]);
      setDeals(dealsData.filter(deal => deal.contactId === contact.id));
      setActivities(activitiesData.filter(activity => activity.contactId === contact.id));
    } catch (err) {
      toast.error('Failed to load contact details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                <p className="text-gray-600">{contact.position} at {contact.company}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="text-gray-900">{contact.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="text-gray-900">{contact.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <p className="text-gray-900 capitalize">{contact.status}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="text-gray-900">{new Date(contact.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Deals ({deals.length})</h4>
                    {deals.length === 0 ? (
                      <p className="text-gray-500 text-sm">No deals yet</p>
                    ) : (
                      <div className="space-y-2">
                        {deals.map(deal => (
                          <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-gray-900">{deal.title}</p>
                              <p className="text-sm text-gray-600">{deal.stage}</p>
                            </div>
                            <span className="font-medium text-gray-900">${deal.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recent Activities ({activities.length})</h4>
                    {activities.length === 0 ? (
                      <p className="text-gray-500 text-sm">No activities yet</p>
                    ) : (
                      <div className="space-y-2">
                        {activities.slice(0, 5).map(activity => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                            <div className={`p-1 rounded ${
                              activity.type === 'call' ? 'bg-info/20 text-info' :
                              activity.type === 'email' ? 'bg-secondary/20 text-secondary' :
                              'bg-accent/20 text-accent'
                            }`}>
                              <ApperIcon
                                name={activity.type === 'call' ? 'Phone' : activity.type === 'email' ? 'Mail' : 'Calendar'}
                                size={12}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactDetailsModal;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ActivityFormModal = ({ activity, contacts, deals, isOpen, onClose, onSave }) => {
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

  const activityTypeOptions = [
    { value: 'call', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'note', label: 'Note' },
  ];

  const contactOptions = [
    { value: '', label: 'Select a contact', disabled: true },
    ...contacts.map(contact => ({
      value: contact.id,
      label: `${contact.name} - ${contact.company}`
    }))
  ];

  const dealOptions = [
    { value: '', label: 'No associated deal' },
    ...deals.map(deal => ({
      value: deal.id,
      label: `${deal.title} - $${deal.value.toLocaleString()}`
    }))
  ];

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
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {activity ? 'Edit Activity' : 'Log Activity'}
              </h3>
              <Button onClick={onClose} variant="ghost" className="p-2">
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Activity Type"
                type="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={activityTypeOptions}
                id="activity-type"
              />

              <FormField
                label="Contact"
                type="select"
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                options={contactOptions}
                id="activity-contact"
                required
              />

              <FormField
                label="Deal (Optional)"
                type="select"
                value={formData.dealId}
                onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                options={dealOptions}
                id="activity-deal"
              />

              <FormField
                label="Description"
                type="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the activity..."
                id="activity-description"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  id="activity-date"
                  required
                />
                <FormField
                  label="Duration (min)"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  id="activity-duration"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {activity ? 'Update' : 'Log Activity'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActivityFormModal;
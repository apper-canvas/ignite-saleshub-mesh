import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const DealFormModal = ({ deal, contacts, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: 0,
    stage: 'lead',
    probability: 10,
    contactId: '',
    expectedClose: ''
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        ...deal,
        expectedClose: deal.expectedClose ? deal.expectedClose.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        value: 0,
        stage: 'lead',
        probability: 10,
        contactId: contacts[0]?.id || '',
        expectedClose: new Date().toISOString().split('T')[0]
      });
    }
  }, [deal, contacts, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const contactOptions = [
    { value: '', label: 'Select a contact', disabled: true },
    ...contacts.map(contact => ({
      value: contact.id,
      label: `${contact.name} - ${contact.company}`
    }))
  ];

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' },
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
                {deal ? 'Edit Deal' : 'Add Deal'}
              </h3>
              <Button onClick={onClose} variant="ghost" className="p-2">
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Deal Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                id="deal-title"
                required
              />

              <FormField
                label="Value ($)"
                type="number"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                id="deal-value"
                required
              />

              <FormField
                label="Contact"
                type="select"
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                options={contactOptions}
                id="deal-contact"
                required
              />

              <FormField
                label="Stage"
                type="select"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                options={stageOptions}
                id="deal-stage"
              />

              <FormField
                label={`Probability (${formData.probability}%)`}
                type="range"
                min="0"
                max="100"
                step="10"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                id="deal-probability"
              />

              <FormField
                label="Expected Close"
                type="date"
                value={formData.expectedClose}
                onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
                id="deal-expected-close"
                required
              />

              <div className="flex space-x-3 pt-4">
                <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {deal ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DealFormModal;
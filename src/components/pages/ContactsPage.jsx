import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Spinner from '@/components/atoms/Spinner';
import EmptyState from '@/components/atoms/EmptyState';
import ContactCard from '@/components/organisms/ContactCard';
import ContactFormModal from '@/components/organisms/ContactFormModal';
import ContactDetailsModal from '@/components/organisms/ContactDetailsModal';
import { contactService, dealService, activityService } from '@/services'; // Keep service imports as in original

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [detailContact, setDetailContact] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSave = async (contactData) => {
    try {
      if (editingContact) {
        const updated = await contactService.update(editingContact.id, contactData);
        setContacts(prev => prev.map(c => c.id === editingContact.id ? updated : c));
        toast.success('Contact updated successfully');
      } else {
        const created = await contactService.create(contactData);
        setContacts(prev => [created, ...prev]);
        toast.success('Contact created successfully');
      }
      setModalOpen(false);
      setEditingContact(null);
    } catch (err) {
      toast.error('Failed to save contact');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(id);
        setContacts(prev => prev.filter(c => c.id !== id));
        toast.success('Contact deleted successfully');
      } catch (err) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          title="Unable to load contacts"
          description={error}
          buttonText="Try Again"
          onButtonClick={loadContacts}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <Button
          onClick={() => {
            setEditingContact(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Contact</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="lead">Leads</option>
          <option value="qualified">Qualified</option>
          <option value="customer">Customers</option>
        </Select>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          iconName="Users"
          title={searchTerm || statusFilter !== 'all' ? 'No contacts found' : 'No contacts yet'}
          description={searchTerm || statusFilter !== 'all'
            ? 'Try adjusting your search or filters'
            : 'Get started by adding your first contact'
          }
          buttonText={!searchTerm && statusFilter === 'all' ? 'Add First Contact' : null}
          onButtonClick={() => {
            setEditingContact(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContactCard
                  contact={contact}
                  onEdit={(cont) => {
                    setEditingContact(cont);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onClick={(cont) => {
                    setDetailContact(cont);
                    setDetailOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Contact Modal */}
      <ContactFormModal
        contact={editingContact}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSave}
      />

      {/* Contact Detail Modal */}
      <ContactDetailsModal
        contact={detailContact}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailContact(null);
        }}
      />
    </div>
  );
};

export default ContactsPage;
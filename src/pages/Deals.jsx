import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { dealService, contactService } from '../services';

const DealCard = ({ deal, contact, onEdit, onDelete, onStageChange }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', deal.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(deal)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <ApperIcon name="Edit2" size={12} />
          </button>
          <button
            onClick={() => onDelete(deal.id)}
            className="p-1 text-gray-400 hover:text-error rounded"
          >
            <ApperIcon name="Trash2" size={12} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{contact?.name || 'Unknown Contact'}</p>
      
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">
          ${deal.value.toLocaleString()}
        </span>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {deal.probability}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Expected: {new Date(deal.expectedClose).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

const PipelineColumn = ({ stage, deals, contacts, onDrop, onEdit, onDelete }) => {
  const [dragOver, setDragOver] = useState(false);
  
  const stageDeals = deals.filter(deal => deal.stage === stage.id);
  const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dealId = e.dataTransfer.getData('text/plain');
    onDrop(dealId, stage.id);
  };

  return (
    <div className="flex-1 min-w-80">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        {/* Column Header */}
        <div className={`p-4 border-b border-gray-200 ${stage.gradient}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{stage.name}</h3>
            <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
              {stageDeals.length}
            </span>
          </div>
          <p className="text-white/90 text-sm mt-1">
            ${totalValue.toLocaleString()}
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 p-4 space-y-3 min-h-96 transition-colors ${
            dragOver ? 'bg-primary/5' : 'bg-gray-50'
          }`}
        >
          <AnimatePresence>
            {stageDeals.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                contact={contacts.find(c => c.id === deal.contactId)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
          
          {stageDeals.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="Target" size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No deals in this stage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DealModal = ({ deal, contacts, isOpen, onClose, onSave }) => {
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
              {deal ? 'Edit Deal' : 'Add Deal'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="lead">Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probability ({formData.probability}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close</label>
              <input
                type="date"
                required
                value={formData.expectedClose}
                onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
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
                {deal ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const pipelineStages = [
    { id: 'lead', name: 'Leads', gradient: 'bg-gradient-to-br from-gray-500 to-gray-600' },
    { id: 'qualified', name: 'Qualified', gradient: 'bg-gradient-to-br from-info to-info/80' },
    { id: 'proposal', name: 'Proposal', gradient: 'bg-gradient-to-br from-secondary to-secondary/80' },
    { id: 'negotiation', name: 'Negotiation', gradient: 'bg-gradient-to-br from-warning to-warning/80' },
    { id: 'closed-won', name: 'Closed Won', gradient: 'bg-gradient-to-br from-success to-success/80' }
  ];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (dealData) => {
    try {
      if (editingDeal) {
        const updated = await dealService.update(editingDeal.id, dealData);
        setDeals(prev => prev.map(d => d.id === editingDeal.id ? updated : d));
        toast.success('Deal updated successfully');
      } else {
        const created = await dealService.create(dealData);
        setDeals(prev => [created, ...prev]);
        toast.success('Deal created successfully');
      }
      setModalOpen(false);
      setEditingDeal(null);
    } catch (err) {
      toast.error('Failed to save deal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealService.delete(id);
        setDeals(prev => prev.filter(d => d.id !== id));
        toast.success('Deal deleted successfully');
      } catch (err) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.id === dealId);
      if (deal && deal.stage !== newStage) {
        const updated = await dealService.update(dealId, { ...deal, stage: newStage });
        setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
        toast.success(`Deal moved to ${pipelineStages.find(s => s.id === newStage)?.name}`);
      }
    } catch (err) {
      toast.error('Failed to update deal stage');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex space-x-6 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-80 bg-white rounded-lg p-4 animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-24 bg-gray-200 rounded"></div>
                ))}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load deals</h3>
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

  const totalPipelineValue = deals.filter(d => !d.stage.includes('closed')).reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600">
            Track and manage your deals through the sales process • 
            <span className="font-medium"> Total Pipeline: ${totalPipelineValue.toLocaleString()}</span>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingDeal(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Deal</span>
        </motion.button>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Target" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
          <p className="text-gray-600 mb-4">Start tracking your sales opportunities</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingDeal(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add First Deal
          </motion.button>
        </div>
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {pipelineStages.map(stage => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={deals}
              contacts={contacts}
              onDrop={handleStageChange}
              onEdit={setEditingDeal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Deal Modal */}
      <DealModal
        deal={editingDeal}
        contacts={contacts}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDeal(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Deals;
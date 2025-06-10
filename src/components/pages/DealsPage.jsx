import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import EmptyState from '@/components/atoms/EmptyState';
import DealFormModal from '@/components/organisms/DealFormModal';
import PipelineColumn from '@/components/organisms/PipelineColumn';
import { dealService, contactService } from '@/services'; // Keep service imports as in original

const DealsPage = () => {
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
        <EmptyState
          iconName="AlertCircle"
          title="Unable to load deals"
          description={error}
          buttonText="Try Again"
          onButtonClick={loadData}
        />
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
        <Button
          onClick={() => {
            setEditingDeal(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Deal</span>
        </Button>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <EmptyState
          iconName="Target"
          title="No deals yet"
          description="Start tracking your sales opportunities"
          buttonText="Add First Deal"
          onButtonClick={() => {
            setEditingDeal(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {pipelineStages.map(stage => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={deals}
              contacts={contacts}
              onDrop={handleStageChange}
              onEdit={(deal) => {
                setEditingDeal(deal);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Deal Modal */}
      <DealFormModal
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

export default DealsPage;
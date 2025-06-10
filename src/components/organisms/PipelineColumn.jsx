import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import DealCard from '@/components/organisms/DealCard';

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

export default PipelineColumn;
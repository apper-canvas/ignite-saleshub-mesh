import React from 'react';
import { motion } from 'framer-motion';

const PipelineStageOverview = ({ stage, deals, contacts }) => {
  const stageDeals = deals.filter(deal => deal.stage === stage.id);
  const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{stage.name}</h3>
        <span className="text-sm text-gray-500">{stageDeals.length}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        ${totalValue.toLocaleString()}
      </p>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {stageDeals.map(deal => {
          const contact = contacts.find(c => c.id === deal.contactId);
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer"
            >
              <p className="font-medium text-gray-900 text-sm">{deal.title}</p>
              <p className="text-sm text-gray-600">{contact?.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-900">
                  ${deal.value.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  {deal.probability}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineStageOverview;
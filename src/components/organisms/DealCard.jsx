import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import DataCard from '@/components/molecules/DataCard';

const DealCard = ({ deal, contact, onEdit, onDelete }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', deal.id);
  };

  return (
    <DataCard
      className="cursor-move hover:shadow-md"
      draggable
      onDragStart={handleDragStart}
      initial={{ opacity: 0, scale: 0.95 }} // Keeping specific initial animation from original
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
        <div className="flex space-x-1">
          <Button
            onClick={() => onEdit(deal)}
            variant="ghost"
            className="p-1" // Smaller padding for this context
          >
            <ApperIcon name="Edit2" size={12} />
          </Button>
          <Button
            onClick={() => onDelete(deal.id)}
            variant="ghostDanger"
            className="p-1" // Smaller padding for this context
          >
            <ApperIcon name="Trash2" size={12} />
          </Button>
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
    </DataCard>
  );
};

export default DealCard;
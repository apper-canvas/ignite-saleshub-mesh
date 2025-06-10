import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import DataCard from '@/components/molecules/DataCard';

const ActivityCard = ({ activity, contact, deal, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      case 'meeting': return 'Calendar';
      case 'note': return 'FileText';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'bg-info/10 text-info border-info/20';
      case 'email': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'meeting': return 'bg-accent/10 text-accent border-accent/20';
      case 'note': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <DataCard className="hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
            <ApperIcon name={getActivityIcon(activity.type)} size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{activity.description}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {contact?.name || 'Unknown'}
              </p>
              {deal && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Deal:</span> {deal.title}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Clock" size={14} className="mr-1" />
                  {activity.duration} min
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={() => onEdit(activity)}
            variant="ghost"
            className="p-2" // Override default button padding
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            onClick={() => onDelete(activity.id)}
            variant="ghostDanger"
            className="p-2" // Override default button padding
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </DataCard>
  );
};

export default ActivityCard;
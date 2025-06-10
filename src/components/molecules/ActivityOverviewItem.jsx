import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const ActivityOverviewItem = ({ activity, contact }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case 'call': return { icon: 'Phone', color: 'bg-info/10 text-info' };
      case 'email': return { icon: 'Mail', color: 'bg-secondary/10 text-secondary' };
      case 'meeting': return { icon: 'Calendar', color: 'bg-accent/10 text-accent' };
      default: return { icon: 'Activity', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const { icon, color } = getIconAndColor(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200"
    >
      <div className="flex-shrink-0">
        <div className={`p-2 rounded-lg ${color}`}>
          <ApperIcon name={icon} size={16} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
        <p className="text-sm text-gray-500">{contact?.name || 'Unknown Contact'}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(activity.date).toLocaleDateString()} • {activity.duration}min
        </p>
      </div>
    </motion.div>
  );
};

export default ActivityOverviewItem;
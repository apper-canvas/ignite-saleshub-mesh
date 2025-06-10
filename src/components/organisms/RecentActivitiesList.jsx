import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import ActivityOverviewItem from '@/components/molecules/ActivityOverviewItem';
import EmptyState from '@/components/atoms/EmptyState';
import { AnimatePresence } from 'framer-motion';

const RecentActivitiesList = ({ activities, contacts }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        <ApperIcon name="Activity" size={20} className="text-gray-400" />
      </div>
      {activities.length === 0 ? (
        <EmptyState
          iconName="Activity"
          title="No recent activities"
          description=""
          className="py-8"
        />
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {activities.map(activity => (
              <ActivityOverviewItem
                key={activity.id}
                activity={activity}
                contact={contacts.find(c => c.id === activity.contactId)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RecentActivitiesList;
import React from 'react';
import MetricDisplay from '@/components/atoms/MetricDisplay';

const DashboardMetrics = ({ contactsCount, activeDealsCount, totalPipelineValue, conversionRate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricDisplay
        title="Total Contacts"
        value={contactsCount}
        change={12} // Hardcoded as per original, can be dynamic
        icon="Users"
        gradient="bg-gradient-to-br from-primary to-primary/80"
      />
      <MetricDisplay
        title="Active Deals"
        value={activeDealsCount}
        change={-5} // Hardcoded as per original, can be dynamic
        icon="Target"
        gradient="bg-gradient-to-br from-secondary to-secondary/80"
      />
      <MetricDisplay
        title="Pipeline Value"
        value={`$${totalPipelineValue.toLocaleString()}`}
        change={8} // Hardcoded as per original, can be dynamic
        icon="DollarSign"
        gradient="bg-gradient-to-br from-accent to-accent/80"
      />
      <MetricDisplay
        title="Conversion Rate"
        value={`${conversionRate}%`}
        change={3} // Hardcoded as per original, can be dynamic
        icon="TrendingUp"
        gradient="bg-gradient-to-br from-info to-info/80"
      />
    </div>
  );
};

export default DashboardMetrics;
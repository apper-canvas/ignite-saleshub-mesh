import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import PipelineStageOverview from '@/components/molecules/PipelineStageOverview';

const PipelineOverviewSection = ({ deals, contacts, pipelineStages }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
        <ApperIcon name="BarChart3" size={20} className="text-gray-400" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
        {pipelineStages.slice(0, 4).map(stage => (
          <PipelineStageOverview
            key={stage.id}
            stage={stage}
            deals={deals}
            contacts={contacts}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineOverviewSection;
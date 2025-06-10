import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { contactService, dealService, activityService } from '../services';

const MetricCard = ({ title, value, change, icon, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-success' : 'text-error'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${gradient}`}>
        <ApperIcon name={icon} size={20} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const QuickAddButton = ({ icon, label, onClick, color = "primary" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      color === "primary" 
        ? "bg-primary text-white hover:bg-primary/90"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    <ApperIcon name={icon} size={16} />
    <span>{label}</span>
  </motion.button>
);

const ActivityItem = ({ activity, contact }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200"
  >
    <div className="flex-shrink-0">
      <div className={`p-2 rounded-lg ${
        activity.type === 'call' ? 'bg-info/10 text-info' :
        activity.type === 'email' ? 'bg-secondary/10 text-secondary' :
        activity.type === 'meeting' ? 'bg-accent/10 text-accent' :
        'bg-gray-100 text-gray-600'
      }`}>
        <ApperIcon 
          name={
            activity.type === 'call' ? 'Phone' :
            activity.type === 'email' ? 'Mail' :
            activity.type === 'meeting' ? 'Calendar' :
            'Activity'
          } 
          size={16} 
        />
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

const PipelineStage = ({ stage, deals, contacts }) => {
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

const MainFeature = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAdd = async (type) => {
    try {
      let newItem;
      switch (type) {
        case 'contact':
          newItem = await contactService.create({
            name: 'New Contact',
            email: '',
            phone: '',
            company: '',
            position: '',
            status: 'lead'
          });
          setContacts(prev => [newItem, ...prev]);
          toast.success('Contact created successfully');
          break;
        case 'deal':
          newItem = await dealService.create({
            title: 'New Deal',
            value: 0,
            stage: 'lead',
            probability: 10,
            contactId: contacts[0]?.id || '',
            expectedClose: new Date().toISOString().split('T')[0]
          });
          setDeals(prev => [newItem, ...prev]);
          toast.success('Deal created successfully');
          break;
        case 'activity':
          newItem = await activityService.create({
            type: 'call',
            contactId: contacts[0]?.id || '',
            dealId: deals[0]?.id || '',
            description: 'New activity',
            date: new Date().toISOString(),
            duration: 30
          });
          setActivities(prev => [newItem, ...prev]);
          toast.success('Activity logged successfully');
          break;
      }
    } catch (err) {
      toast.error(`Failed to create ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Skeleton for metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        {/* Skeleton for content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
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

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const closedDeals = deals.filter(deal => deal.stage === 'closed-won').length;
  const conversionRate = deals.length > 0 ? Math.round((closedDeals / deals.length) * 100) : 0;
  const recentActivities = activities.slice(0, 5);

  const pipelineStages = [
    { id: 'lead', name: 'Leads' },
    { id: 'qualified', name: 'Qualified' },
    { id: 'proposal', name: 'Proposal' },
    { id: 'negotiation', name: 'Negotiation' },
    { id: 'closed-won', name: 'Closed Won' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickAddButton
            icon="UserPlus"
            label="Add Contact"
            onClick={() => handleQuickAdd('contact')}
          />
          <QuickAddButton
            icon="Plus"
            label="Add Deal"
            onClick={() => handleQuickAdd('deal')}
            color="secondary"
          />
          <QuickAddButton
            icon="Activity"
            label="Log Activity"
            onClick={() => handleQuickAdd('activity')}
            color="secondary"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={contacts.length}
          change={12}
          icon="Users"
          gradient="bg-gradient-to-br from-primary to-primary/80"
        />
        <MetricCard
          title="Active Deals"
          value={deals.filter(d => !d.stage.includes('closed')).length}
          change={-5}
          icon="Target"
          gradient="bg-gradient-to-br from-secondary to-secondary/80"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${totalPipelineValue.toLocaleString()}`}
          change={8}
          icon="DollarSign"
          gradient="bg-gradient-to-br from-accent to-accent/80"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change={3}
          icon="TrendingUp"
          gradient="bg-gradient-to-br from-info to-info/80"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <ApperIcon name="Activity" size={20} className="text-gray-400" />
          </div>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Activity" size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivities.map(activity => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  contact={contacts.find(c => c.id === activity.contactId)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pipeline Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
            <ApperIcon name="BarChart3" size={20} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {pipelineStages.slice(0, 4).map(stage => (
              <PipelineStage
                key={stage.id}
                stage={stage}
                deals={deals}
                contacts={contacts}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;
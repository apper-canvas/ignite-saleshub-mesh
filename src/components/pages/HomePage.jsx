import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import QuickActionButton from '@/components/molecules/QuickActionButton';
import DashboardMetrics from '@/components/organisms/DashboardMetrics';
import RecentActivitiesList from '@/components/organisms/RecentActivitiesList';
import PipelineOverviewSection from '@/components/organisms/PipelineOverviewSection';
import EmptyState from '@/components/atoms/EmptyState';
import Spinner from '@/components/atoms/Spinner';
import { contactService, dealService, activityService } from '@/services'; // Keep service imports as in original

const HomePage = () => {
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
            email: 'new@example.com', // Provide default values to avoid issues
            phone: '123-456-7890',
            company: 'New Co',
            position: 'Associate',
            status: 'lead'
          });
          setContacts(prev => [newItem, ...prev]);
          toast.success('Contact created successfully');
          break;
        case 'deal':
          newItem = await dealService.create({
            title: 'New Deal',
            value: 1000,
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
        default:
          break;
      }
    } catch (err) {
      toast.error(`Failed to create ${type}`);
    }
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const closedDeals = deals.filter(deal => deal.stage === 'closed-won').length;
  const conversionRate = deals.length > 0 ? Math.round((closedDeals / deals.length) * 100) : 0;
  const activeDealsCount = deals.filter(d => !d.stage.includes('closed')).length;
  const recentActivities = activities.slice(0, 5);

  const pipelineStages = [
    { id: 'lead', name: 'Leads' },
    { id: 'qualified', name: 'Qualified' },
    { id: 'proposal', name: 'Proposal' },
    { id: 'negotiation', name: 'Negotiation' },
    { id: 'closed-won', name: 'Closed Won' }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
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
        <EmptyState
          iconName="AlertCircle"
          title="Unable to load dashboard"
          description={error}
          buttonText="Try Again"
          onButtonClick={loadData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickActionButton
            icon="UserPlus"
            label="Add Contact"
            onClick={() => handleQuickAdd('contact')}
          />
          <QuickActionButton
            icon="Plus"
            label="Add Deal"
            onClick={() => handleQuickAdd('deal')}
            buttonVariant="secondary"
          />
          <QuickActionButton
            icon="Activity"
            label="Log Activity"
            onClick={() => handleQuickAdd('activity')}
            buttonVariant="secondary"
          />
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics
        contactsCount={contacts.length}
        activeDealsCount={activeDealsCount}
        totalPipelineValue={totalPipelineValue}
        conversionRate={conversionRate}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivitiesList activities={recentActivities} contacts={contacts} />
        <PipelineOverviewSection deals={deals} contacts={contacts} pipelineStages={pipelineStages} />
      </div>
    </div>
  );
};

export default HomePage;
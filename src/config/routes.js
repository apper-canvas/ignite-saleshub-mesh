import HomePage from '@/components/pages/HomePage';
import ActivitiesPage from '@/components/pages/ActivitiesPage';
import ContactsPage from '@/components/pages/ContactsPage';
import DealsPage from '@/components/pages/DealsPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: HomePage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: ContactsPage
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Target',
    component: DealsPage
  },
  activities: {
    id: 'activities',
    label: 'Activities',
    path: '/activities',
    icon: 'Activity',
    component: ActivitiesPage
  }
};

export const routeArray = Object.values(routes);
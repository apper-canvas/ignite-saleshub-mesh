import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Contacts from '../pages/Contacts';
import Deals from '../pages/Deals';
import Activities from '../pages/Activities';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Target',
    component: Deals
  },
  activities: {
    id: 'activities',
    label: 'Activities',
    path: '/activities',
    icon: 'Activity',
    component: Activities
  }
};

export const routeArray = Object.values(routes);
import SalesOrderList from '@/components/cashsales/cashsale-orders/SalesOrderList.vue'
import Login from '../components/user/Login.vue' 
import MainComponent from '@/components/MainComponent.vue' 
import Dashboard from '@/components/dashboard/Dashboard.vue'
import OrdersList from '@/components/orders/OrdersList.vue'
import Users from '@/components/user/Users.vue'

export const routes = [
  {
    path: '/',
    name: 'index',
    component: Login,
    meta: {
      public: true
    }
  },
  {
    path: '/saleslink',
    name: 'Main',
    component: MainComponent,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/saleslink/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/saleslink/orders',
        name: 'orders',
        component: OrdersList,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/saleslink/users',
        name: 'system-users',
        component: Users,
        meta: {
          requiresAuth: true
        }
      },
      //Other application routes will go here
      {
        path: '/saleslink/salesorder/list',
        name: 'orderd',
        component:SalesOrderList,
        meta: {
          requiresAuth: true
        }
      },
    ]
  },


]

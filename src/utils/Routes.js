
import MainComponent from '@/components/MainComponent.vue' 
import List from '@/components/todoList/List.vue'


export const routes = [
   {
   
      path: '/',
      redirect: '/todo/list',
   
    component: List,
  //   meta: {
  //     public: true
  //   }
   },
  {
    path: '/todo',
    name: 'Main',
    component: MainComponent,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/todo/list',
        name: 'list',
        component:List,
        // meta: {
        //   requiresAuth: true
        // }
      },
    ]
  },


]

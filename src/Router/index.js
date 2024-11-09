import { createRouter, createWebHistory } from 'vue-router';
import ProgressBarView from '../views/ProgressBarView.vue';

//will add different Vies here
const routes = [
    {
      path: '/',
      name: 'ProgressBarView',
      component: ProgressBarView
    }
];

//routes setup
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;










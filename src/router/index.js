import { createRouter, createWebHistory } from 'vue-router';
import BlankComponent from '@/components/BlankComponent.vue';
import FlowerProgress from '@/components/FlowerProgress.vue';
import ProgressBar from '@/components/ProgressBar.vue';



const routes = [
  {
    path: '/blankmode',
    name: 'BlankMode',
    component: BlankComponent,
  },
  {
    path: '/flower-progress',
    name: 'FlowerProgress',
    component: FlowerProgress,
  },
  {
    path: '/progress-bar',
    name: 'ProgressBar',
    component: ProgressBar,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

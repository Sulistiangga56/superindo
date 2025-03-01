import { createRouter, createWebHistory } from 'vue-router';
import CreateOrder from '@/components/CreateOrder.vue';
import OrderList from '@/components/OrderList.vue';

const routes = [
    { path: '/', component: OrderList },
    { path: '/create-order', component: CreateOrder }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

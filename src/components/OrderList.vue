<template>
    <div class="order-list-container">
        <div class="header">
            <h1>List Orders</h1>
            <button class="logout-button" @click="logout">Logout</button>
        </div>
        <div class="filters">
            <input v-model="searchOrderId" placeholder="Order ID" class="filter-input" />
            <select v-model="selectedStatus" class="filter-select">
                <option value="">All Status</option>
                <option value="Waiting for Payment">Waiting for Payment</option>
                <option value="On Payment Verification">On Payment Verification</option>
                <option value="On Release Progress">On Release Progress</option>
                <option value="Payment Rejected">Payment Rejected</option>
                <option value="Done">Done</option>
            </select>
            <input type="date" v-model="selectedDate" class="filter-input" />
            <button @click="applyFilters" class="filter-button">Apply</button>
            <button @click="resetFilters" class="filter-button">Reset</button>
        </div>
        <button @click="goToCreateOrder" class="create-order-button">+ Create Order</button>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                    <td>{{ order.status }}</td>
                    <td>{{ order.id }}</td>
                    <td>{{ order.date }}</td>
                    <td>{{ order.total }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import '@/assets/orderList.css';

export default {
    data() {
        return {
            orders: [],
            searchOrderId: '',
            selectedStatus: '',
            selectedDate: ''
        };
    },
    created() {
        fetch('/order_list.json')
            .then(response => response.json())
            .then(data => {
                this.orders = data;
            })
            .catch(error => {
                console.error('Error fetching order list:', error);
            });
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => {
                return (!this.searchOrderId || order.id.includes(this.searchOrderId)) &&
                    (!this.selectedStatus || order.status === this.selectedStatus) &&
                    (!this.selectedDate || order.date.includes(this.selectedDate));
            });
        }
    },
    methods: {
        applyFilters() {
            // Mengambil atau memfilter pesanan berdasarkan filter saat ini
        },
        resetFilters() {
            this.searchOrderId = '';
            this.selectedStatus = '';
            this.selectedDate = '';
        },
        goToCreateOrder() {
            this.$emit('change-component', '/CreateOrder');
            this.$router.push('/create-order');
        },
        logout() {
            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been logged out successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                alert('Redirecting to login page...');
            });
        }
    }
};
</script>
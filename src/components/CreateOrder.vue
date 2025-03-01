<template>
    <div class="create-order-container">
        <!-- Navigation Bar -->
        <div class="sidebar">
            <div class="logo">X</div>
            <ul class="nav-links">
                <li><a href="#Dashboard">Dashboard</a></li>
                <li><a href="#Orders">Orders</a></li>
                <li><a href="#VoucherManage">Voucher Manage</a></li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="voucher-list">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h1>Create Order</h1>
                    <button class="logout-button" @click="logout">Logout</button>
                </div>
                <h2>List Voucher Digital</h2>
                <div v-for="voucher in vouchers" :key="voucher.id" class="voucher-item">
                    <h3>{{ voucher.name }}</h3>
                    <p>Denom: {{ voucher.denom.toLocaleString() }}</p>
                    <p>Codes: {{ voucher.codes }}</p>
                    <div class="qty-control">
                        <button @click="decreaseQty(voucher.id)">-</button>
                        <input type="number" :value="getQty(voucher.id)"
                            @input="updateQty(voucher.id, $event.target.value)" min="0" />
                        <button @click="increaseQty(voucher.id)">+</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
            <h2>Order Summary</h2>
            <div v-for="item in orderItems" :key="item.id" class="summary-item">
                <span>{{ item.name }}</span>
                <span>{{ item.denom.toLocaleString() }} x {{ item.qty }}</span>
                <span>Rp {{ (item.denom * item.qty).toLocaleString() }}</span>
            </div>
            <div class="total">
                <span>Total</span>
                <span>Rp {{ total.toLocaleString() }}</span>
            </div>
            <button @click="placeOrder" class="place-order-button">Place Order</button>

            <!-- Success Message -->
            <div v-if="orderSuccess" class="success-message">
                <p>Order Successfully Created!</p>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import '@/assets/createOrder.css';

export default {
    data() {
        return {
            vouchers: [],
            orderItems: [],
            orderSuccess: false
        };
    },
    created() {
        fetch('/voucher_list.json')
            .then(response => response.json())
            .then(data => {
                this.vouchers = data;
            })
            .catch(error => {
                console.error('Error fetching voucher list:', error);
            });
    },
    computed: {
        total() {
            return this.orderItems.reduce((sum, item) => sum + (item.denom * item.qty), 0);
        }
    },
    methods: {
        increaseQty(id) {
            const item = this.orderItems.find(i => i.id === id);
            if (item) {
                item.qty++;
            } else {
                const voucher = this.vouchers.find(v => v.id === id);
                this.orderItems.push({ ...voucher, qty: 1 });
            }
        },
        decreaseQty(id) {
            const item = this.orderItems.find(i => i.id === id);
            if (item && item.qty > 1) {
                item.qty--;
            } else {
                this.orderItems = this.orderItems.filter(i => i.id !== id);
            }
        },
        getQty(id) {
            const item = this.orderItems.find(i => i.id === id);
            return item ? item.qty : 0;
        },
        updateQty(id, value) {
            let qty = parseInt(value.replace(/\D/g, ''), 10); // Hanya angka yang diperbolehkan
            if (isNaN(qty) || qty < 0) qty = 0;

            const itemIndex = this.orderItems.findIndex(i => i.id === id);
            if (itemIndex !== -1) {
                if (qty === 0) {
                    this.orderItems.splice(itemIndex, 1); // Hapus jika qty 0
                } else {
                    this.orderItems[itemIndex].qty = qty; // Update qty
                }
            } else if (qty > 0) {
                const voucher = this.vouchers.find(v => v.id === id);
                if (voucher) {
                    this.orderItems.push({ ...voucher, qty });
                }
            }
        },
        placeOrder() {
            if (this.orderItems.length === 0) {
                Swal.fire('Error!', 'Your cart is empty!', 'error');
                return;
            }

            const orderData = {
                id: Date.now(), // ID unik
                items: this.orderItems,
                total: this.total,
                date: new Date().toISOString() // Tanggal order
            };

            fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(() => {
                Swal.fire('Success!', 'Order Successfully Created!', 'success').then(() => {
                    this.orderItems = []; // Reset cart setelah berhasil
                    this.$emit('change-component', 'OrderList'); // Pindah ke Order List
                    this.$router.push('/');
                });
            })
            .catch(error => {
                console.error('Failed to save order:', error);
                Swal.fire('Error!', 'Failed to save order!', 'error');
            });
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
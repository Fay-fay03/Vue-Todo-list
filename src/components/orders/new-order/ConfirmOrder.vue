<script>
// import { Const } from '../../utils/constants'
// import axios from 'axios'
import Toastify from 'toastify-js'
import { formatPhoneNumber } from '@/utils/helpers'
import { Const } from '@/utils/constants';
import axios from 'axios';


export default {
    components: {
    },
    props: ["order"],
    data() {
        return {
            imageUrl: '',
            isLoading: false,
            formatter: new Intl.NumberFormat('en-US',
                { style: 'currency', currency: 'USD' }),
        }
    },

    methods: {
        formatPhoneNumber: formatPhoneNumber,
        showToast(message, isDanger) {
            Toastify({
                text: message,
                // className: className,
                style: {
                    background: isDanger ? "#d63939" : "#2fb344",
                }
            }).showToast();
        },
        setImageUrl(imageUrl) {
            this.imageUrl = imageUrl
        },
        createOrder() {
            console.log(this.order)
            this.isLoading = true;
            let config = {
                method: 'post',
                url: `${Const.BASE_URL}order/create`,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                },
                data: this.order
            }
            axios.request(config)
                .then((response) => {
                    this.isLoading = false;
                    if (response.data && response.data.status === 200) {
                        this.showToast(response.data.message, false)
                        this.$router.push(`/saleslink/order/${response.data.data.orderID}`)
                        return
                    }
                    this.showToast(response.data.message, true)

                })
                .catch((error) => {
                    this.isLoading = false;
                    console.log(error)
                    this.showToast(error.message, true)
                })
        }


    },
}
</script>

<template>

    <!-- Page body -->
    <div class="row g-2 align-items-center mb-3 p-0">
        <div class="col m-0">

        </div>
        <div class="col-auto ms-auto d-print-none">
            <button class="btn btn-primary" :disabled="isLoading || order.items.length == 0" @click="createOrder()">
                Submit Order
            </button>
        </div>
    </div>



    <div class="row">
        <div class="col-6">
            <p class="h3 ">Customer</p>
            <address>
                {{ order?.customer?.name }}
                <br>
                {{ order?.customer?.phone }}<br>
                {{ order?.customer?.city }},{{ order?.customer?.state }} <br>
                {{ order?.customer?.address }}
            </address>
        </div>
        <div class="col-6 text-end">
            <p class="h3 pb-0">Shipping Address</p>
            <address>
                {{ order?.shipping?.address }}<br>
                {{ order?.shipping?.city }}, {{ order?.shipping?.country }} <br>
                {{ order?.shipping?.state }}, {{ order?.shipping?.zipCode }}<br>
                {{ order?.shipping?.shippingMethod }}
            </address>
        </div>

    </div>

    <table v-if="order != null" class="table table-transparent table-responsive">
        <thead>
            <tr>
                <th></th>
                <th>Product</th>
                <th class="text-center" style="width: 1%">Qty</th>
                <th class="text-end" style="width: 1%">Sales Tax</th>
                <th class="text-end" style="width: 1%">Amount</th>
            </tr>
        </thead>
        <tr v-for="(item) in order.items" v-bind:key="item.Sku">
            <td>
                <img :src="item.imageUrl" height="60px" width="60px" data-bs-toggle="modal"
                    data-bs-target="#imagePreviewModal" @click="setImageUrl(item.imageUrl)">

            </td>

            <td>
                <p class="strong mb-0">{{ item?.Sku }}</p>
                <div class="text-muted pt-0">{{ item?.vendorItemNumber }} - {{ item?.Description }}</div>
            </td>


            <td class="text-center">
                {{ item?.quantity }}
            </td>
            <td class="text-end">{{ this.formatter.format(item?.tax) }}</td>
            <td class="text-end">{{ this.formatter.format(item?.UnitPrice) }}</td>
        </tr>
        <tr>
            <td colspan="4" class="strong text-end"> </td>
            <td class="text-end"> </td>
        </tr>
        <tr>
            <td colspan="4" class="strong text-end"> </td>
            <td class="text-end"> </td>
        </tr>
        <tr>
            <td colspan="4" class="strong text-end"> </td>
            <td class="text-end"> </td>
        </tr>
        <tr>
            <td colspan="4" class="strong text-end">Subtotal</td>
            <td class="text-end">{{ this.formatter.format(parseFloat(order.orderAmount)
            ) }} </td>
        </tr>

        <tr>
            <td colspan="4" class="strong text-end">Sales Tax</td>
            <td class="text-end"> {{ this.formatter.format(parseFloat(order.tax)) }}</td>
        </tr>
        <tr>
            <td colspan="4" class="strong text-end">Shipping Cost</td>
            <td class="text-end">{{ this.formatter.format(order?.shipping?.shippingCost) }}</td>
        </tr>
        <tr>
            <td colspan="4" class="strong text-end ">Total Due</td>
            <td class="strong text-end">{{ this.formatter.format(order.orderAmount + parseFloat(order.tax)) }}
            </td>
        </tr>
    </table>


    <!-- image preview modal  -->
    <div class="modal fade" id="imagePreviewModal" tabindex="-1" aria-labelledby="imagePreviewModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body">

                    <img :src="imageUrl">

                </div>
            </div>
        </div>
    </div>


</template>

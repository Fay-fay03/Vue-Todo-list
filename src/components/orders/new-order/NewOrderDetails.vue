<script>

import { Const } from '@/utils/constants';
import axios from 'axios';
import Toastify from 'toastify-js'

export default {
    components: {

    }, props: ["stage", "order"],
    data() {
        return {
            paymentMethods: [],
            vendors: [],
            orderDate: '',
            taxAmount: '',
            stdShippingFee: '0',
            dropShipFee: '0',
            stdPackagingCost: '0',
            paymentMethod: '',
            paymentAmount: '',
            paymentReceived: '',
            comments: '',
            vendor: '',
            selectedPaymentMethod: {
                id: '',
                name: ''
            },
            selectedVendor: {
                id: '',
                name: ''
            }

        }
    },
    mounted() {
        this.getPaymentMethods()
        this.getVendors()
        if (this.order != null) {
            this.orderDate = this.order.orderDetails.orderDate
            //   this.taxAmount=this.order.orderDetails.orderDate
            this.stdShippingFee = this.order.orderDetails.stdShippingFee
            this.dropShipFee = this.order.orderDetails.dropShipFee
            this.stdPackagingCost = this.order.orderDetails.stdPackagingCost
            this.paymentMethod = this.order.orderDetails.paymentMethod
            this.paymentAmount = this.order.orderDetails.paymentAmount ? this.order.orderDetails.paymentAmount : this.order.orderAmount
            this.paymentReceived = this.order.orderDetails.paymentReceived ? this.order.orderDetails.paymentReceived : this.order.orderAmount
            this.comments = this.order.orderDetails.comments
            this.vendor = this.order.orderDetails.vendor

            this.selectedVendor = this.order.orderDetails.selectedVendor
            this.selectedPaymentMethod = this.order.orderDetails.selectedPaymentMethod

        }


    },
    methods: {
        next() {
            //validate and then emit
            if (this.orderDate == '') {
                this.showToast("Order Date is required", true)
                return
            }
            if (this.paymentMethod == '') {
                this.showToast("Payment method is required", true)
                return
            }
            if (this.paymentAmount == '' && parseFloat(this.paymentAmount) > 0) {
                this.showToast("Payment amount is required", true)
                return
            }
            var orderDetails = {
                orderDate: this.orderDate,
                // taxAmount: this.taxAmount,
                stdShippingFee: this.stdShippingFee,
                dropShipFee: this.dropShipFee,
                stdPackagingCost: this.stdPackagingCost,
                paymentMethod: this.paymentMethod,
                paymentAmount: this.paymentAmount,
                paymentReceived: this.paymentReceived,
                comments: this.comments
            }

            this.vendors.forEach((element) => {
                if (element.Id == this.vendor)
                    orderDetails['selectedVendor'] = element
            })
            this.paymentMethods.forEach((element) => {
                if (element.Id == this.paymentMethod)
                    orderDetails['selectedPaymentMethod'] = element
            })
            this.$emit('updateStage', 3, orderDetails)
        },
        getPaymentMethods() {

            let config = {
                method: 'get',
                url: `${Const.BASE_URL}static/payment/methods`,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                }
            }
            axios.request(config).then((data) => {
                if (data.data.status == 200)
                    this.paymentMethods = data.data.data

                // console.log(data.data)

            }).catch((err) => {
                console.log(err)
            })


        },
        getVendors() {

            let config = {
                method: 'get',
                url: `${Const.BASE_URL}static/vendors`,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                }
            }
            axios.request(config).then((data) => {
                if (data.data.status == 200)
                    this.vendors = data.data.data

                console.log(this.vendors)

            }).catch((err) => {
                console.log(err)
            })


        },
        showToast(message, isDanger) {
            Toastify({
                text: message,
                style: {
                    background: isDanger ? "#d63939" : "#2fb344",
                }
            }).showToast();
        },
    },

}

</script>
<template>

    <div class="row g-2 align-items-center m-0 p-0">
        <div class="col m-0">

        </div>
        <div class="col-auto ms-auto d-print-none">
            <button class="btn btn-primary" :disabled="orderDate == ''" @click="next()">
                Next
            </button>
        </div>
    </div>


    <div class="row">
        <div class="row">
            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700  required">Order Date</label>
                <input type="date" class="form-control" v-model="orderDate" required>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700 required">Vendor</label>
                <select id="vendors" v-model="vendor" class="form-select">
                    <option v-for="option in vendors" :key="option.Id" :value="option.Id">{{
                        option.DisplayName }}</option>
                </select>

            </div>

            <!-- <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700 ">Back Order Date</label>
                <input type="date" class="form-control" v-model="backOrderDate">
            </div> -->
            <!-- <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700   required">Sales Tax</label>
                <input type="number" min="0" class="form-control" v-model="taxAmount" required>
            </div> -->
            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700   required">Standard Shipping Fee</label>
                <input type="number" min="0" class="form-control" v-model="stdShippingFee" required>
            </div>

            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700   required">Drop Ship Fee</label>
                <input type="number" min="0" class="form-control" v-model="dropShipFee" required>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700  required">Standard Packaging Cost</label>
                <input type="number" min="0" class="form-control" v-model="stdPackagingCost" required>
            </div>

            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700 required">Payment Method</label>

                <select id="paymentMethods" v-model="paymentMethod" class="form-select">
                    <option v-for="option in paymentMethods" :key="option.Id" :value="option.Id">{{
                        option.Name }}</option>
                </select>

            </div>


            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700   required">Payment Amount</label>
                <input type="number" min="0" class="form-control" v-model="paymentAmount">
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700 required">Payment Received</label>
                <input type="number" min="0" class="form-control" v-model="paymentReceived">
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label text-weight-700">Order Comments</label>
                <textarea class="form-control" v-model="comments"></textarea>
            </div>
        </div>

    </div>

</template>
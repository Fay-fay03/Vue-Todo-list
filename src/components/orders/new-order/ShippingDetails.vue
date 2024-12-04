<script>
import { Const } from '@/utils/constants';

import axios from 'axios';
import Toastify from 'toastify-js'

export default {
    components: {

    },
    props: ["stage", "order"],
    data() {
        return {
            shippingCompanies: [],
            shipping: {
                name: '',
                shippingMethod: '',
                insuranceCost: '',
                phoneNumber: '',
                dateBOLCreated: '',
                shipmentDate: '',
                shippingCompanyID: '',
                packedWeight: '',
                shippingCost: '',
                insured: '',
                dateDelivered: '',
                packedDimensions: '',
                address: '',
                country: '',
                zipCode: '',
                state: '',
                city: ''
            }

        }
    },
    mounted() {
        if (this.order != null)
            this.shipping = this.order.shipping

        this.getShippingCompanies()
    },
    methods: {
        next() {
            //validate and then emit 

            if (this.shipping.shippingMethod == '') {
                this.showToast("Shipping method is required", true)
                return
            }
            if (this.shipping.dateBOLCreated == '') {
                this.showToast("Date BOL created is required", true)
                return
            }
            if (this.shipping.shipmentDate == '') {
                this.showToast("Shipment Date is required", true)
                return
            }
            if (this.shipping.address == '') {
                this.showToast("Shipment Address is required", true)
                return
            }
            if (this.shipping.country == '') {
                this.showToast("Shipment Country is required", true)
                return
            }
            if (this.shipping.city == '') {
                this.showToast("Shipment City is required", true)
                return
            }
            this.$emit('updateStage', 5, this.shipping)
        },
        showToast(message, isDanger) {
            Toastify({
                text: message,
                style: {
                    background: isDanger ? "#d63939" : "#2fb344",
                }
            }).showToast();
        },

        getShippingCompanies() {

            let config = {
                method: 'get',
                url: `${Const.BASE_URL}shipping-companies/list`,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                },
            }

            axios.request(config).then((data) => {
                if (data.status == 200)
                    this.shippingCompanies = data.data ? data.data.data : []
            })
                .catch((err) => {
                    console.log(err)
                })
        },
    },

}

</script>
<template>

    <div class="row g-2 align-items-center m-0 p-0">
        <div class="col m-0">

        </div>
        <div class="col-auto ms-auto d-print-none">
            <button class="btn btn-primary" :disabled="shipping.shippingMethod == ''" @click="next()">
                Next
            </button>
        </div>
    </div>

    <div class="row">

        <!-- <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Name</label>
            <input type="text" class="form-control" v-model="shipping.name" required>
        </div>

        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Phone Number</label>
            <input type="text" class="form-control" v-model="shipping.phoneNumber" required>
        </div> -->



        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Shipping Method</label>
            <input type="text" class="form-control" v-model="shipping.shippingMethod" required>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700">Shipping Company</label>
            <select id="shippingCompanyID" v-model="shipping.shippingCompanyID" class="form-control">
                <option v-for="option in shippingCompanies" :key="option.companyID" :value="option.companyID">{{
                    option.name }}</option>
            </select>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Shipping Cost</label>
            <input type="number" min="0" class="form-control" v-model="shipping.shippingCost" required>
        </div>

        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700">Shipment Date</label>
            <input type="date" class="form-control" v-model="shipping.shipmentDate">
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700">Date BOL Created</label>
            <input type="date" class="form-control" v-model="shipping.dateBOLCreated">
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Insured</label>
            <select class="form-select" v-model="shipping.insured" required>
                <option value="NO">No</option>
                <option value="YES">Yes</option>
            </select>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Insurance Cost</label>
            <input type="number" min="0" class="form-control" v-model="shipping.insuranceCost" required>
        </div>

        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700">Packed Dimensions</label>
            <input type="text" class="form-control" v-model="shipping.packedDimensions">
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700">Packed Weight</label>
            <input type="text" class="form-control" v-model="shipping.packedWeight">
        </div>



        <!-- <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700">Date Delivered</label>
            <input type="date" class="form-control" v-model="shipping.dateDelivered">
        </div> -->


        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Country</label>
            <input type="text" class="form-control" v-model="shipping.country" required>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">City</label>
            <input type="text" class="form-control" v-model="shipping.city" required>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">State</label>
            <input type="text" class="form-control" v-model="shipping.state" required>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Address</label>
            <input type="text" class="form-control" v-model="shipping.address" required>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Zip Code</label>
            <input type="text" class="form-control" v-model="shipping.zipCode" required>
        </div>


    </div>



</template>
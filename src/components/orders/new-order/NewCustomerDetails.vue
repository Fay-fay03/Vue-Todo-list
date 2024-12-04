<script>

import Toastify from 'toastify-js'

export default {
    components: {

    },
    props: ["stage", "order"],
    data() {
        return {
            customer: {
                name: '',
                email: '',
                zip: '',
                phone: '',
                address: '',
                city: '',
                state: ''
            }

        }
    },
    mounted() {

        if (this.order != null)
            this.customer = this.order.customer
    },
    methods: {
        next() {
            //validate and then emit

            if (this.customer.name == '') {
                this.showToast("Customer name is required", true)
                return
            }
            if (this.customer.email == '') {
                this.showToast("Customer email is required", true)
                return
            }
            if (this.customer.address == '') {
                this.showToast("Customer address is required", true)
                return
            }


            this.$emit('updateStage', 4, this.customer)
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
            <button class="btn btn-primary" :disabled="customer.name == ''" @click="next()">
                Next
            </button>
        </div>
    </div>

    <div class="row">

        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Name</label>
            <input type="text" class="form-control" v-model="customer.name" required>
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 required">Email</label>
            <input type="text" class="form-control" v-model="customer.email" required>
        </div>


        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 ">Phone</label>
            <input type="text" class="form-control" v-model="customer.phone">
        </div>


        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 ">Address</label>
            <input type="text" class="form-control" v-model="customer.address">
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 ">City</label>
            <input type="text" class="form-control" v-model="customer.city">
        </div>


        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 ">State</label>
            <input type="text" class="form-control" v-model="customer.state">
        </div>
        <div class="col-md-4 mb-3">
            <label class="form-label text-weight-700 ">Zip</label>
            <input type="text" class="form-control" v-model="customer.zip">
        </div>

    </div>



</template>
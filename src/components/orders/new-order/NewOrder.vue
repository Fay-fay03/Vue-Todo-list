<script>
import ConfirmOrder from './ConfirmOrder.vue';
import NewCustomerDetails from './NewCustomerDetails.vue';
import NewOrderDetails from './NewOrderDetails.vue';
import Products from './Products.vue';
import ShippingDetails from './ShippingDetails.vue';


// import axios from 'axios'
export default {
    components: {
        Products,
        NewOrderDetails,
        NewCustomerDetails,
        ShippingDetails,
        ConfirmOrder
    },
    data() {
        return {
            stage: 1,
            order: {
                orderDetails: {},
                items: [],
                customer: {},
                shipping: {}
            }

        }
    },
    methods: {
        updateStage(stage, value) {

            this.stage = stage
            if (value == null)
                return
            if (stage == 2) {
                this.order.items = value.items
                this.order.tax = value.tax
                this.order.orderAmount = value.saleTotal

            }
            if (stage == 3)
                this.order.orderDetails = value
            if (stage == 4)
                this.order.customer = value
            if (stage == 5)
                this.order.shipping = value

            // console.log(this.order)
        }
    },
    mounted() {


    }
}

</script>
<template>
    <div class="page-header d-print-none p-0 m-1">
        <div class="container-xxl p-0">
            <div class="row g-2 align-items-center m-0 p-0">
                <div class="col m-0">
                    <h2 class="page-title">
                        New Purchase Order
                    </h2>
                </div>
                <div class="col-auto ms-auto d-print-none">

                </div>
            </div>
        </div>
    </div>

    <div class="page-body mt-1">
        <div class="container-xxl">
            <div class="card card-lg">
                <div class="card-body p-2 pb-5">
                    <ul class="steps steps-green steps-counter my-4">
                        <li :class="stage == 1 ? 'step-item active' : 'step-item'"><a @click="updateStage(1)">Order
                                Items</a></li>
                        <li :class="stage == 2 ? 'step-item active' : 'step-item'"><a @click="updateStage(2)">Order
                                Details</a></li>
                        <li :class="stage == 3 ? 'step-item active' : 'step-item'"><a @click="updateStage(3)">Customer
                                Details</a></li>
                        <li :class="stage == 4 ? 'step-item active' : 'step-item'"><a @click="updateStage(4)">Shipping
                                Details</a></li>
                        <li :class="stage == 5 ? 'step-item active' : 'step-item'"><a
                                @click="updateStage(5)">Confirmation
                            </a></li>
                        <!-- <li class="step-item">Confirmation</li> -->
                    </ul>

                    <!-- Step 1 -->
                    <Products @updateStage="updateStage" v-if="stage == 1" :stage="stage" :order="order"></Products>
                    <NewOrderDetails @updateStage="updateStage" v-if="stage == 2" :stage="stage" :order="order">
                    </NewOrderDetails>
                    <NewCustomerDetails @updateStage="updateStage" v-if="stage == 3" :stage="stage" :order="order">
                    </NewCustomerDetails>
                    <ShippingDetails @updateStage="updateStage" v-if="stage == 4" :stage="stage" :order="order">
                    </ShippingDetails>
                    <ConfirmOrder v-if="stage == 5" :order="order"></ConfirmOrder>
                    <!-- <Shimmer v-if="loading"></Shimmer> -->

                </div>
            </div>
        </div>
    </div>

</template>

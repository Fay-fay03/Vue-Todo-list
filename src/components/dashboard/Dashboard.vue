<script>

import DataTable from 'datatables.net-vue3'
import { Const } from '../../utils/constants'
// import DataTablesCore from 'datatables.net'
import DataTableBs5 from 'datatables.net-bs5'
DataTable.use(DataTableBs5)
import moment from 'moment'
import axios from 'axios'
import Toastify from 'toastify-js'
import { ref } from 'vue'
import _ from 'lodash'
import { formatPhoneNumber } from '@/utils/helpers'

export default {
    components: {

    },
    data() {
        return {

        }
    },
    mounted() {
    },
    beforeUnmount() {
    },
    onMounted() {

    },
    created() {

    },
    methods: {

    },
    props: []
}
</script>

<template>

    <div class="page-header d-print-none p-0 m-1">
        <div class="container-xxl p-0">
            <div class="row g-2 align-items-center m-0 p-0">
                <div class="col m-0">
                    <h2 class="page-title">
                        Dashboard
                    </h2>
                </div>
                <!-- Page title actions -->
                <!-- <div class="col-auto ms-auto d-print-none">
          <router-link to="/saleslink/order/create" class="btn btn-primary">Create Order</router-link>
        </div> -->
            </div>
        </div>
    </div>

    <div class="page-body mt-1">
        <div class="container-xxl">
            <div class="row row-cards m-0">
                <div class="col-12">
                    <div class="card p-1">
                        <div class="card-body">
                            Dashboard summaries goes here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

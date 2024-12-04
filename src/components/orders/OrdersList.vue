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
import Litepicker from 'litepicker';
import { formatPhoneNumber } from '@/utils/helpers'

export default {
  components: {
    DataTable,
  },
  data() {
    return {
      dt: null,
      isCustomer: false,
      table: ref(),
      picker: null,
      endDate: '',
      startDate: '',
      serverSide: true,
      processing: true,
      updatingOrder: false,
      formatter: new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }),
      // Formats as USD currency: "$4,999.99"
      isLoading: false,
      tableOptions: {
        responsive: true,
        serverSide: true,
        select: true,
        bLengthChange: false,
        bInfo: false,
        destroy: true,
        paging: true,
        searching: false,
        ordering: true,
        pageLength: 20,
        columnDefs: [{ orderable: false, targets: [0, 1, 3, 4, 5, 7, 8, 9] }],
        // order: [[6, 'asc'], [2, 'asc']],
        "ajax": {
          url: `${Const.BASE_URL}order/list`,
          type: "get",
          headers: {
            'access-token': localStorage.getItem('accessToken')
          },
          data: (d) => {
            delete d.columns;


            if (this.selectedMarketplace && this.selectedMarketplace != "")
              d.marketplace = this.selectedMarketplace;

            if (this.customer && this.customer != "")
              d.customer = this.customer;
            if (this.invoice && this.invoice != "")
              d.invoice = this.invoice;

            // if (this.pendingPayment && this.pendingPayment != "")
            //   d.pendingPayment = this.pendingPayment;

            if (this.startDate && this.startDate != "") {
              d.startDate = this.startDate;
              d.endDate = this.endDate;
            }


            return d;
          },
          error: function () {
            console.log("Error loading data")
          },


          // dataFilter: function (response) {
          //   console.log("Server data ", response)
          //   return response;
          // },
        },

      },
      columns: [
        {
          title: 'Date',
          data: null,
          className: 'p-1',
          // orderable: false,
          render: (data, type, row) => {
            return `${moment(row.orderDate).format('MM/DD/YYYY')}`
          }
        },
        {
          title: 'Market Place',
          data: null,
          className: 'p-1',
          // orderable: true,
          render: (data, type, row) => {
            return `${row.marketPlace}`
          }
        },
        {
          title: 'Status',
          data: null,
          orderable: true,
          name: 'orderStatus',
          className: 'text-center p-1',
          render: (data, type, row) => {
            return `${row.status.code} - ${row.status.description}`
          }
        },
        {
          data: null,
          // orderable: false,
          render: '#orderNumber',
          title: 'Order Number',
          className: 'text-end p-1'
        },
        // {
        //   title: 'Order Number',
        //   data: null,
        //   className: 'p-1',
        //   // orderable: false,
        //   render: (data, type, row) => {
        //     return `${row.marketPlaceOrderID ? row.marketPlaceOrderID : ''}`
        //   }
        // },
        {
          data: null,
          // orderable: false,
          render: '#invoice',
          title: 'QBO Invoice',
          className: 'text-end p-1'
        },

        {
          data: null,
          render: '#customer',
          className: 'p-1',
          title: 'Customer',
          orderable: true,
          name: 'customer.name'
        },
        {
          title: 'Amount',
          data: null,
          // orderable: false,
          className: 'text-end p-1',
          render: (data, type, row) => {
            return ` ${this.formatter.format(row.orderAmount)} `
          }
        },
        {
          title: 'Sales Tax',
          data: null,
          // orderable: false,
          className: 'text-end p-1',
          render: (data, type, row) => {
            return `${this.formatter.format(row.taxAmount)}`
          }
        },
        {
          title: 'Action',
          data: null,
          // orderable: false,
          className: 'text-end p-1',
          render: "#action"
        },
      ],
    }
  },
  mounted() {
    this.dt = this.$refs.table.dt;
    // Initialize Litepicker in the mounted hook
    this.picker = new Litepicker({
      element: this.$refs.dateRange,
      format: "YYYY-MM-DD",
      singleMode: false,
      setup: (picker) => {
        picker.on('selected', (date1, date2) => {
          this.startDate = date1.format('YYYY-MM-DD');
          this.endDate = date2.format('YYYY-MM-DD');
          this.getSalesOrders()
        });
      },

    });

  },
  beforeUnmount() {
    this.picker.destroy();
  },
  onMounted() {

  },

  created() {

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

    formatDateTime(dateTime) {
      return moment(dateTime).format('YYYY-MM-DD')
    },


    async getSalesOrders() {
      this.dt = this.$refs.table.dt;
      this.dt.draw()
    },

    //end of filter functions

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
            Sales Orders
          </h2>
        </div>
        <!-- Page title actions -->
        <div class="col-auto ms-auto d-print-none">
          <router-link to="/saleslink/order/create" class="btn btn-primary">Create Order</router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body mt-1">
    <div class="container-xxl">
      <div class="row row-cards m-0">
        <div class="col-12">
          <div class="card p-1">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label class=" form-label text-weight-700 text-weight-700">Date</label>
                  <input type="text" readOnly ref="dateRange" id="dateRange" name="dateRange"
                    class="form-control mb-2" />

                </div>
              </div>

              <div class="table-responsive">
                <DataTable :options="tableOptions" :columns="columns" width="100%" ref="table"
                  class="table table-vcenter card-table table-striped datatable nowrap">


                  <template #action="props">
                    <div class="dropdown">
                      <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                        <li>
                          <a class="dropdown-item" :href="'/saleslink/order/' + props.rowData.orderID">View

                          </a>
                        </li>
                        <!--Add customer to QBO-->
                        <li v-if="!props.rowData.customer.quickbooksCustomerId">
                          <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#viewCustomerDetails"
                            title="View customer details" data-bs-placement="top"
                            @click="setOrder(props.rowData, false)">Add
                            Customer To Quickbooks</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="" data-bs-toggle="modal"
                            data-bs-target="#addPurchaseOrderModal" @click="setOrder(props.rowData, false)">Add Purchase
                            Order</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="" data-bs-toggle="modal"
                            data-bs-target="#addVendorOrderNumberModal" @click="setOrder(props.rowData, false)">Add
                            Vendor
                            Order Number</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#addCommentModal"
                            @click="setOrder(props.rowData, false)">Add Comment</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="" data-bs-toggle="modal"
                            data-bs-target="#addShippingDetailsModal" @click="setOrder(props.rowData, false)">Add
                            Shipping
                            Details</a>
                        </li>
                        <!-- Send email to vendor-->
                        <li>
                          <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#sendEmailToVendorModal"
                            title="Send Email to Vendor" data-bs-placement="top"
                            @click="setOrder(props.rowData, false)">Send
                            Email to Vendor</a>
                        </li>
                        <!--Send email to customer-->
                        <li>
                          <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#sendEmailToVendorModal"
                            title="Send Email to Customer" data-bs-placement="top"
                            @click="setOrder(props.rowData, true)">Send
                            Email to Customer</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <template #invoice="props">
                    <div>
                      <p v-if="props.rowData?.invoiceNumber">
                        <a href="" data-bs-toggle="modal" data-bs-target="#invoiceDetailsModal"
                          @click="selectedInvoiceNumber = props.rowData?.invoiceNumber">{{ props.rowData?.invoiceNumber
                          }}</a>
                      </p>
                    </div>
                  </template>
                  <template #orderNumber="props">
                    <div>
                      <p v-if="props.rowData?.marketPlaceOrderID">
                        <a :href="'/saleslink/order/' + props.rowData.orderID">{{ props.rowData?.marketPlaceOrderID
                          }}</a>
                      </p>
                    </div>
                  </template>



                  <template #customer="props">
                    <div v-if="props.rowData?.customer?.customerID" class="button-container">
                      <a href="" data-bs-toggle="modal" data-bs-target="#viewCustomerDetails"
                        title="View customer details" data-bs-placement="top" @click="setOrder(props.rowData)">{{
                          props.rowData?.customer?.name }}</a>
                    </div>
                  </template>




                  <!-- <template #statusAction="props">

                    <div v-if="props.rowData.customer.quickbooksCustomerId">


                      <div v-if="props.rowData.invoiceNumber != null && props.rowData.paymentAmount == null"
                        class="button-container">
                        <a href="" data-bs-toggle="modal" data-bs-target="#addPaymentToQuickbooksModal"
                          @click="setOrder(props.rowData)">Process Payment</a>

                      </div>
                      <div v-if="props.rowData.invoiceNumber == null" class="button-container">
                        <a href="" data-bs-toggle="modal" data-bs-target="#addInvoiceToQuickbooksModal"
                          @click="setOrder(props.rowData)">Create Invoice {{ props.rowData.invoiceNumber }}</a>

                      </div>
                      <p class="p-0 m-0" v-if="props.rowData.paymentAmount != null">Payment Processed</p>
                    </div>
                  </template> -->


                </DataTable>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>




</template>

<style>
/* @import 'bootstrap'; */
/* @import 'datatables.net-bs5'; */
.dt-ordering-asc .dt-column-order::after {
  content: "\25B2";
  /* Unicode for an upward-pointing triangle */
  display: inline-block;
  margin-left: 5px;
}

.dt-ordering-desc .dt-column-order::after {
  content: "\25BC";
  /* Unicode for a downward-pointing triangle */
  display: inline-block;
  margin-left: 5px;
}
</style>

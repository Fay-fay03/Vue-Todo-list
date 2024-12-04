<script>

import DataTable from 'datatables.net-vue3'
import { Const } from '../../../utils/constants'
import DataTableBs5 from 'datatables.net-bs5'
DataTable.use(DataTableBs5)
import moment from 'moment'
import axios from 'axios'
import Toastify from 'toastify-js'
import { ref } from 'vue'
import _ from 'lodash'
import Litepicker from 'litepicker';
import { formatPhoneNumber } from '@/utils/helpers'
import { filter } from 'lodash'

export default {
  components: {
    DataTable,
  },
  data() {
    return {
      dt: null,
      isCustomer: false,
      allOrders: [],
      salespersons: [],
       selectedsalesperson: '',
        orderStatus: [],
       selectedOrderStatus: '',
       filteredOrders: [], 
      selectedCustomer: '',
      selectedStatus: '',

      table: ref(),
      picker: null,
      endDate: '',
      startDate: '',
      serverSide: true,
      processing: true,
      updatingOrder: false,
      formatter: new Intl.NumberFormat(),
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

       // columnDefs: [{ orderable: false, targets: [0, 1, 3, 4, 5, 7] }],
        // order: [[6, 'asc'], [2, 'asc']],
        "ajax": {
          url: `${Const.BASE_URL}order/list`,
          type: "get",
          headers: {
            'access-token': localStorage.getItem('accessToken')
          },
          data: (d) => {
            delete d.columns;


            if (this.selectedOrderStatus && this.selectedOrderStatus != "")
              d.OrderStatus = this.selectedOrderStatus;

            if (this.selectedsalespersons && this.selectedsalespersons != "")
              d.salespersons = this.salespersons;
            // if (this.invoice && this.invoice != "")
            //   d.invoice = this.invoice;

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
          data: null,
          // orderable: false,
          render: '#orderNumber',
          title: 'Order Number',
          className: ' p-1',
          render: (data, type, row) => {
            return `<a href="/order/"class="text-primary">${(row.orderNumber)}`
          }
        },
        {

          data: null,
          className: 'p-1',
         title: 'Customer',
         render: (data, type, row) => {
         const customerNumber = row.customer ? row.customer.customerNumber : '';
         const customerName = row.customer ? row.customer.name : '';
          return `${customerNumber} - ${customerName}`
         }
       },
       {
          data: null,
          // orderable: false,
          render: '#orderNumber',
          title: 'SalesPersons',
          className: ' p-1',
          render: (data, type, row) => {
            return null
          }
        },
        {
          title: 'Order Date',
          data: null,
          className: 'text-end p-1',
          // orderable: false,
          render: (data, type, row) => {
            return `${moment(row.supplyDate).format('MM/DD/YYYY')}`
          }
        },
        {
          title: 'Amount',
          data: null,
          // orderable: false,
          className: 'text-end p-1',
          render: (data, type, row) => {
            return ` ${this.formatter.format(row.totalValue)} `
          }
        },
        {
          title: 'Sales Tax',
          data: null,
          // orderable: false,
          className: 'text-end p-1',
          render: (data, type, row) => {
            return `${this.formatter.format(row.totalTax)}`
          }
        },
        {
          title: 'Sales Total',
          data: null,
          // orderable: false,
          className: 'text-end p-1',
          render: (data, type, row) => {
        const salesTotal = row.totalValue + row.totalTax;
        return `${this.formatter.format(salesTotal)}`;
    }
        },
  
        {
          title: 'Status',
          data: null,
          orderable: true,
          name: 'orderStatus',
          className: 'text-center p-1',
          render: (data, type, row) => {
            return `${row.status ? row.status.name: ''}`
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
    this.getSalespersons();
    this.getOrderStatus();
    this.dt = this.$refs.table.dt;
    this.picker = new Litepicker({
   element: this.$refs.dateRange,
   format: "YYYY-MM-DD",
   singleMode: false,
   setup: (picker) => {
      picker.on('selected', (date1, date2) => {
         this.startDate = date1.format('YYYY-MM-DD');
         this.endDate = date2.format('YYYY-MM-DD');
         console.log(`Start Date: ${this.startDate}, End Date: ${this.endDate}`); 
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
    
    async getOrderStatus() {
  try {
    const response = await fetch(`${Const.BASE_URL}order/status/list`, {
      headers: {
        'access-token': localStorage.getItem('accessToken'),
      },
    });
    const result = await response.json();
    if (result.status === 10001) {
      this.orderStatus = result.data;
      this.tableOptions.orderStatus = result.data;
      localStorage.setItem('orderStatus', JSON.stringify(result.data));
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
  }
},
async getSalespersons() {
  console.log("get salespersns")
  try{
    const response = await fetch(`${Const.BASE_URL}customers/list`, {
      headers: {
        'access-token': localStorage.getItem('accessToken'),
      },
    });
    const result = await response.json();
    console.log(result)
    if (result.status === 10001) {
      this.salespersons = result.data;
      localStorage.setItem('salespersons', JSON.stringify(result.data));
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
  }
},
filterOrders() {
      this.filteredOrders = this.allOrders;
      this.filterOrdersByCustomer();
      this.filterOrdersByStatus();
      this.filterOrdersByDate();
      this.updateDataTable();
    },
    filterOrdersByCustomer() {
      if (this.selectedCustomer) {
        this.filteredOrders = this.filteredOrders.filter(order =>
          order.customer && order.customer.name === this.selectedCustomer
        );
      }
    },
    filterOrdersByStatus() {
      if (this.selectedOrderStatus) {
        this.filteredOrders = this.filteredOrders.filter(order =>
          order.status && order.status.name === this.selectedOrderStatus
        );
      }
    },
    filterOrdersByDate() {
  if (this.startDate && this.endDate) {
    const start = moment(this.startDate, 'YYYY-MM-DD');
    const end = moment(this.endDate, 'YYYY-MM-DD');
    this.filteredOrders = this.filteredOrders.filter(order => {
      const orderDate = moment(order.supplyDate, 'YYYY-MM-DD');
      return orderDate.isBetween(start, end, 'day', '[]');
    });
  }
},

    async getSalesOrders() {
      this.dt = this.$refs.table.dt;
      this.dt.draw();
      this.allOrders = await this.fetchOrders();
  },
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
            CashSales Orders
          </h2>
        </div>
        <div class="col-auto ms-auto d-print-none">

            <button class="btn btn-outline-dark w-100"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-text"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 9l1 0" /><path d="M9 13l6 0" /><path d="M9 17l6 0" /></svg>
            Export to Pdf</button>
        </div>
        <div class="col-auto ms-auto d-print-none">
            <button class="btn btn-outline-dark w-100"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-excel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" /><path d="M10 12l4 5" /><path d="M10 17l4 -5" /></svg>Export to Excell
                </button> 
       
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
              <div class="row align-items-end">
                <div class="col-md-3">
                  <label class="form-label text-weight-700">Order Date</label>
                  <input type="text" readOnly ref="dateRange" id="dateRange" name="dateRange" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label text-weight-700">SalesPersons</label>
                  <select v-model="selectedCustomer" class="form-control" @change="filterOrdersByCustomer">
                    <option value="">All Customer</option>
                    <option v-for="customer in salespersons" :key="customer.name" :value="customer.name">
                      {{ customer.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
      <label class="form-label text-weight-700">Order Status</label>
     <select v-model="selectedOrderStatus" class="form-control" @change="filterOrdersByStatus">
    <option value="">All Statuses</option>
    <option v-for="status in orderStatus" :key="status.name" :value="status.name">
      {{ status.name }}
    </option>
   </select>
  </div>
                <div class="col-md-3">
                  <button class="btn btn-outline-dark" @click="filterOrders">Filter</button>
                </div>
              </div>
              
                   <div class="table-responsive">
                   <DataTable
                v-if="selectedCustomer && filteredOrders.length" :data="filteredOrders" :options="tableOptions" :columns="columns"  width="100%"
                ref="table" class="table table-vcenter card-table table-striped datatable nowrap"/>
                <p v-else-if="selectedCustomer && filteredOrders.length === 0">
                   No orders found.</p>
                    <DataTable
                     v-else-if="!selectedCustomer" :data="allOrders" :options="tableOptions" :columns="columns"  width="100%"
                      ref="table" class="table table-vcenter card-table table-striped datatable nowrap" >
             <template #action="props">
                    <div class="dropdown">
                      <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                      </button>
                      <ul class="dropdown-menu custom-dropdown" aria-labelledby="dropdownMenuButton1">
                        <li>
                          <a class="dropdown-item" :href="'/saleslink/order/' + props.rowData.orderID">View
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#ErpModal"
                            title="Push to Erp" data-bs-placement="top"
                            @click="setOrder(props.rowData, true)">Push to Erp</a>
                        </li>
                        
                      </ul>
                    </div>
                  </template>

                  <template #orderNumber="props">
                    <div>
                      <p v-if="props.rowData?.orderNumber">
                        <a :href="'/saleslink/order/orderdetails' + props.rowData.orderNumber">{{ props.rowData?.orderNumber
                          }}</a>
                      </p>
                    </div>
                  </template>
            




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
  display: inline-block;
  margin-left: 5px;
}

.dt-ordering-desc .dt-column-order::after {
  content: "\25BC";
  display: inline-block;
  margin-left: 5px;
}
.table thead th {
  background-color: #f2f5f7; 
  color: black; 
  font-weight: bold; 
  text-align: center;
  padding: 100px; 
}

.table tbody td {
  vertical-align: middle;
  padding: 10px; 
}



</style>

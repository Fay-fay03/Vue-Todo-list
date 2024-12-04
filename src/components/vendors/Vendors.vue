<script>
import DataTable from 'datatables.net-vue3'
import { Const } from '../../utils/constants'
import DataTableBs5 from 'datatables.net-bs5'
import axios from 'axios'
import Toastify from 'toastify-js'
DataTable.use(DataTableBs5)
export default {
    components: {
        DataTable
    },
    data() {
        return {
            isView: false,
            isChecked: false,
            isLoading: false,
            vendor: null,
            formData: {
                "abbreviation": " ",
                "name": "",
                "website": "",
                "stockAccuracy": "",
                "packagingStatus": "",
                "phone": "",
                "email": "",
                "address": "",
                "city": "",
                "state": "",
                "zipCode": "",
                "doTheyShip": "",
                "representative": "",
                "dockHours": "",
                "comments": "",
                "details": ""
            },
            options: {
                responsive: true,
                serverSide: true,
                select: true,
                bLengthChange: false,
                bInfo: false,
                destroy: true,
                paging: true,
                searching: false,
                ordering: true,
                pageLength: 10,
                "ajax": {

                    url: `${Const.BASE_URL}vendors/list`,
                    type: "get",
                    headers: {
                        'access-token': localStorage.getItem('accessToken')
                    },
                    error: function () {
                        console.log("Error loading data")
                    },

                }
            },
            columns: [
                { title: 'Name', data: null, render: (data, type, row) => { return `${row.name}` } },
                { title: 'Phone', data: null, render: (data, type, row) => { return `${row.phone}` } },
                { title: 'Email', data: null, render: (data, type, row) => { return `${row.email}` } },
                { title: 'Address', data: null, render: (data, type, row) => { return `${row.address}` } },
                { title: 'City', data: null, render: (data, type, row) => { return `${row.city}` } },
                { title: 'ZipCode', data: null, render: (data, type, row) => { return `${row.zipCode}` } },
                {
                    data: null,
                    render: '#action',
                    title: 'Action'

                }
            ]

        }
    },
    methods: {
        showToast(message, isDanger) {
            Toastify({
                text: message,
                // className: className,
                style: {
                    background: isDanger ? "#d63939" : "#2fb344",
                }
            }).showToast();
        },
        clearForm() {
            this.formData = {
                "abbreviation": " ",
                "name": "",
                "website": "",
                "stockAccuracy": "",
                "packagingStatus": "",
                "phone": "",
                "email": "",
                "address": "",
                "city": "",
                "state": "",
                "zipCode": "",
                "doTheyShip": "",
                "representative": "",
                "dockHours": "",
                "comments": "",
                "details": ""
            }
        },
        addVendor() {
            let config = {
                method: 'post',
                url: `${Const.BASE_URL}vendors/create`,
                data: this.formData,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                },
            }

            this.isLoading = true
            axios
                .request(config)
                .then((response) => {
                    console.log(response.data)
                    this.isLoading = false
                    if (response.data.status == 200) {
                        this.showToast(response.data.message, false);
                        this.$refs.closeModal.click();

                        this.clearForm()
                        setTimeout(() => {
                            window.location.reload()
                        }, 500)
                        return
                    }
                    this.showToast(`${response.data.message}: ${response.data.error}`, true);

                })
                .catch((error) => {
                    this.isLoading = false
                    this.showToast(error.message, true);
                    console.log(error)
                })


        },

        editVendor() {
            let config = {
                method: 'post',
                url: `${Const.BASE_URL}vendors/update`,
                data: this.formData,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                },
            }
            this.formData['vendorID'] = this.vendor.vendorID
            this.isLoading = true
            axios
                .request(config)
                .then((response) => {
                    console.log(response.data)
                    this.isLoading = false
                    if (response.data.status == 200) {
                        this.showToast(response.data.message, false);
                        this.$refs.closeModal.click();

                        this.clearForm()
                        setTimeout(() => {
                            window.location.reload()
                        }, 500)
                        return
                    }
                    this.showToast(`${response.data.message}: ${response.data.error}`, true);

                })
                .catch((error) => {
                    this.isLoading = false
                    this.showToast(error.message, true);
                    console.log(error)
                })


        },
        suspendVendor() {
            let config = {
                method: 'post',
                url: `${Const.BASE_URL}vendors/status/update`,
                data: {
                    vendorID: this.vendor.vendorID,
                    status: 'suspended'
                },
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                },
            }

            this.isLoading = true
            axios
                .request(config)
                .then((response) => {
                    console.log(response.data)
                    this.isLoading = false
                    if (response.data.status == 200) {
                        this.showToast(response.data.message, false);
                        this.$refs.closeModal.click();

                        this.clearForm()
                        setTimeout(() => {
                            window.location.reload()
                        }, 500)
                        return
                    }
                    this.showToast(`${response.data.message}: ${response.data.error}`, true);

                })
                .catch((error) => {
                    this.isLoading = false
                    this.showToast(error.message, true);
                    console.log(error)
                })


        },


        setVendor(vendor, isView) {
            if (!isView) {
                this.clearForm()
            }
            this.isView = !isView
            this.vendor = vendor
            this.formData.abbreviation = vendor.abbreviation
            this.formData.name = vendor.name
            this.formData.website = vendor.website
            this.formData.stockAccuracy = vendor.stockAccuracy
            this.formData.packagingStatus = vendor.packagingStatus
            this.formData.phone = vendor.phone
            this.formData.email = vendor.email
            this.formData.address = vendor.address
            this.formData.city = vendor.city
            this.formData.state = vendor.state
            this.formData.zipCode = vendor.zipCode
            this.formData.doTheyShip = vendor.doTheyShip
            this.formData.representative = vendor.representative
            this.formData.dockHours = vendor.dockHours
            this.formData.comments = vendor.comments
            this.formData.details = vendor.details

            console.log(this.formData)
        }


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
                        Vendors
                    </h2>
                </div>
                <!-- Page title actions -->
                <div class="col-auto ms-auto d-print-none">
                    <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal"
                        @click="setVendor(null, false)" data-bs-target="#addVendorModal">
                        Add Vendor
                    </button>
                </div>
                <div class="col-auto ms-auto d-print-none">
                    <button type="button" class="btn btn-outline-dark" onclick="javascript:window.print();">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
                            stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                            <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                        </svg>
                        Print
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="page-body mt-1">
        <div class="container-xxl">
            <div class="row row-cards">
                <div class="col-12">
                    <div class="card p-1">
                        <div class="card-body">


                            <div class="table-responsive">
                                <DataTable :columns="columns" :options="options" width="100%"
                                    class="table card-table table-vcenter text-nowrap datatable">
                                    <template #action="props">
                                        <div class="button-container">
                                            <a href="" data-bs-toggle="modal" data-bs-target="#vendorDetailsModal"
                                                @click="setVendor(props.rowData, true)">View</a>


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

    <!-- add vendor modal -->
    <div class="modal fade" id="addVendorModal" tabindex="-1" aria-labelledby="addVendorModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-full-width">
            <form @submit.prevent="addVendor">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add new Vendor</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Name</label>
                                <input type="text" class="form-control" id="name" v-model="formData.name" required />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Abbreviation</label>
                                <input type="text" class="form-control" id="abbreviation"
                                    v-model="formData.abbreviation" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Website</label>
                                <input type="text" class="form-control" id="website" v-model="formData.website" />
                            </div>

                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Phone</label>
                                <input type="text" class="form-control" id="phone" v-model="formData.phone" required />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Email</label>
                                <input type="text" class="form-control" id="email" v-model="formData.email" required />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Address</label>
                                <textarea type="text" rows="2" class="form-control" id="address"
                                    v-model="formData.address" required></textarea>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">State</label>
                                <input type="text" class="form-control" id="state" v-model="formData.state" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">City</label>
                                <input type="text" class="form-control" id="city" v-model="formData.city" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Zip code</label>
                                <input type="text" class="form-control" id="zipCode" v-model="formData.zipCode" />
                            </div>

                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Do They Ship?</label>
                                <input type="text" class="form-control" id="doTheyShip" v-model="formData.doTheyShip" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Representative</label>
                                <input type="text" class="form-control" id="representative"
                                    v-model="formData.representative" />
                            </div>

                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Dock Hours</label>
                                <input type="text" class="form-control" id="dockHours" v-model="formData.dockHours" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Stock Accuracy</label>
                                <input type="text" class="form-control" id="stockAccuracy"
                                    v-model="formData.stockAccuracy" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> How Good is Their
                                    Packaging?</label>
                                <input type="text" class="form-control" id="packagingStatus"
                                    v-model="formData.packagingStatus" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700 "> Any
                                    other comments</label>
                                <textarea rows="4" type="text" class="form-control" id="comments"
                                    v-model="formData.comments"></textarea>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Details</label>
                                <textarea rows="4" type="text" class="form-control" id="details"
                                    v-model="formData.details"></textarea>
                            </div>
                        </div>




                    </div>
                    <div class="modal-footer">
                        <button ref="closeModal" type="button" class="btn me-auto"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            <span v-if="isLoading">Adding vendor...</span>
                            <span v-if="!isLoading">Save Vendor</span>
                        </button>
                    </div>

                </div>
            </form>
        </div>

    </div>
    <!-- add vendor modal -->


    <!-- view vendor Details -->
    <div class="modal modal-blur fade" id="vendorDetailsModal" tabindex="-1" aria-labelledby="vendorDetailsModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-full-width">
            <form @submit.prevent="editVendor">
                <div v-if="vendor != null" class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Vendor</h5>

                        <div class="row text-center align-items-center flex-row-reverse ">
                            <div class="col-4 col-lg-auto ms-lg-auto ">
                                <div class=" btn btn-outline-secondary">
                                    <label class="form-check form-switch m-0">
                                        <input class="form-check-input" v-model="isChecked" type="checkbox">
                                        <span class="form-check-label">Edit Vendor</span>
                                    </label>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <button class="btn btn-outline-danger " :disabled="isLoading"
                                    @click="suspendVendor(template)">
                                    <span v-if="isLoading">Suspending vendor...</span>
                                    <span v-if="!isLoading">Suspend Vendor</span>
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>

                            </div>
                        </div>



                    </div>
                    <div class="modal-body">


                        <div class="row">
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Name</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="name"
                                    v-model="formData.name" required />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Abbreviation</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="abbreviation"
                                    v-model="formData.abbreviation" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Website</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="website"
                                    v-model="formData.website" />
                            </div>

                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Phone</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="phone"
                                    v-model="formData.phone" required />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Email</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="email"
                                    v-model="formData.email" required />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Address</label>
                                <textarea type="text" rows="2" :disabled="!isChecked" class="form-control" id="address"
                                    v-model="formData.address" required></textarea>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">State</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="state"
                                    v-model="formData.state" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">City</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="city"
                                    v-model="formData.city" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Zip code</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="zipCode"
                                    v-model="formData.zipCode" />
                            </div>

                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700">Do They Ship?</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="doTheyShip"
                                    v-model="formData.doTheyShip" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Representative</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="representative"
                                    v-model="formData.representative" />
                            </div>

                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Dock Hours</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="dockHours"
                                    v-model="formData.dockHours" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Stock Accuracy</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="stockAccuracy"
                                    v-model="formData.stockAccuracy" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> How Good is Their
                                    Packaging?</label>
                                <input type="text" class="form-control" :disabled="!isChecked" id="packagingStatus"
                                    v-model="formData.packagingStatus" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700 "> Any
                                    other comments</label>
                                <textarea rows="4" type="text" class="form-control" :disabled="!isChecked" id="comments"
                                    v-model="formData.comments"></textarea>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="phone" class="form-label text-weight-700"> Details</label>
                                <textarea rows="4" type="text" class="form-control" :disabled="!isChecked" id="details"
                                    v-model="formData.details"></textarea>
                            </div>
                        </div>




                    </div>
                    <div v-if="isChecked" class="modal-footer">
                        <button ref="closeModal" type="button" class="btn me-auto"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            <span v-if="isLoading">updating vendor...</span>
                            <span v-if="!isLoading">Update Vendor</span>
                        </button>
                    </div>
                </div>
            </form>

        </div>
    </div>


</template>

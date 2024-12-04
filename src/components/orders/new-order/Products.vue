<script>

import axios from 'axios'
import { Const } from '@/utils/constants';
import Toastify from 'toastify-js'
export default {
    components: {

    },
    props: ["stage", "order"],
    data() {
        return {
            product: '',
            products: [],
            filteredProducts: [],
            cartItems: [],
            saleTotal: 0,
            tax: 0,
            formatter: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }),

        }
    },
    mounted() {

        if (this.order != null)
            this.cartItems = this.order.items
        this.getProducts()
    },
    methods: {
        next() {
            //validate and then emit
            if (this.cartItems.length == 0) {
                this.showToast("Please add some products", true)
                return
            }
            var order = {
                saleTotal: this.saleTotal,
                tax: this.tax,
                items: this.cartItems
            }
            this.$emit('updateStage', 2, order)
        },
        showToast(message, isDanger) {
            Toastify({
                text: message,
                style: {
                    background: isDanger ? "#d63939" : "#2fb344",
                }
            }).showToast();
        },
        getProducts() {
            let config = {
                method: 'get',
                url: `${Const.BASE_URL}products/list`,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                }
            }
            axios.request(config).then((data) => {
                if (data.data.status == 200)
                    this.products = data.data.data

                // console.log(this.products)

            }).catch((err) => {
                console.log(err)
            })



        },
        async fetchItems() {
            // console.log('search')
            if (this.product.length < 1) {
                this.filteredProducts = [];
                return;
            }
            // {
            //     "Name": "AS-461",
            //     "Sku": "AS-461",
            //     "Description": "Cachepot Vase Planter SCAVO COLORE Small Heavily Distressed White Fully Glazed",
            //     "Active": "true",
            //     "SubItem": "true",
            //     "ParentRef": "4057",
            //     "Level": "2",
            //     "FullyQualifiedName": "Drop-Ship:Artistica:AS-461",
            //     "Taxable": "true",
            //     "UnitPrice": "34.25",
            //     "Type": "Inventory",
            //     "IncomeAccountRef": "112",
            //     "PurchaseDesc": "7821/16/GW-GIL Cachepot Vase Planter SCAVO COLORE Small Heavily Distressed White Fully Glazed",
            //     "PurchaseCost": "34.25",
            //     "ExpenseAccountRef": "120",
            //     "AssetAccountRef": "87",
            //     "PrefVendorRef": "3157",
            //     "TrackQtyOnHand": "true",
            //     "QtyOnHand": "-1",
            //     "InvStartDate": "2024-08-07",
            //     "Id": "5953",
            //     "SyncToken": "1"
            // },
            console.log('search product')
            const queryLower = this.product.toLowerCase();
            this.filteredProducts = this.products.filter((item) => {
                // console.log(item.Description)

                return (
                    item.Description.toLowerCase().includes(queryLower) ||
                    item.Sku.toLowerCase().includes(queryLower)
                );
            });
        },
        async fetchItem(item) {
            // console.log(item.Sku)
            let config = {
                method: 'get',
                url: `https://api.euroluxantiques.com/product.php?item=${item.Sku}`,
            }
            axios.request(config).then((data) => {

                if (data.data.status == 'Success') {
                    item.imageUrl = data.data.data.ImageURL
                    item.vendorItemNumber = data.data.data.VendorItem
                }


                // console.log(data.data.data.ImageURL)
            }).catch((err) => {
                console.log(err)
            })
        },
        async addItemToCart() {
            console.log("using form")
            //TODO when the user click enter, add the item

        },

        getSaleTotal() {
            this.saleTotal = 0;
            this.tax = 0;
            this.cartItems.forEach((item) => {
                this.saleTotal = this.saleTotal + item.quantity * parseFloat(item.UnitPrice);
                if (item.Taxable == "true")
                    this.tax = this.tax + parseFloat(item.UnitPrice) * 0.16;
            });
        },
        //update quantity from input and recompute total
        updateQuantity(item, value) {
            item.quantity = value;
            item.totalPrice = parseFloat(item.UnitPrice) * value;
            if (item.Taxable == "true")
                item.tax = parseFloat(item.UnitPrice) * 0.16;
            this.getSaleTotal();
        },


        async selectedItem(item) {
            this.product = item.productName;
            this.itemObj = item;
            this.filteredProducts = [];

            this.fetchItem(item)

            item.quantity = 1;
            item.totalPrice = parseFloat(item.UnitPrice) * 1
            if (item.Taxable == "true")
                item.tax = parseFloat(item.UnitPrice) * 0.16;
            this.cartItems.push(item);
            this.product = "";
            this.getSaleTotal();

        },
        async removeItem(stock) {
            this.cartItems = this.cartItems.filter(
                (item) => item.sku != stock.sku
            );

            this.getSaleTotal();
        },

    },

}

</script>
<template>
    <div class="row">
        <!-- <form @submit.prevent="addItemToCart"> -->
        <div class="col-md-8 mb-3">
            <label class="form-label text-weight-700">Search Product</label>
            <input type="text" v-model="product" @input="fetchItems" placeholder="Search product by name or sku .."
                class="form-control" autofocus />
            <ul v-if="filteredProducts.length" class="list-group">
                <li v-for="item in filteredProducts" :key="item.Sku" class="list-group-item"
                    @click="selectedItem(item)">
                    {{ item.Description }}
                </li>
            </ul>
        </div>
        <!-- </form> -->
        <!-- <div class="col-md-4 mb-3"> -->
        <div class="col-auto ms-auto d-print-none">
            <button class="btn btn-primary" :disabled="cartItems.length == 0" @click="next()">
                Next
            </button>
        </div>
        <!-- </div> -->
    </div>

    <div class="table-responsive">
        <table class="table table-vcenter card-table table-striped">
            <thead>
                <tr>
                    <th class="p-1">#</th>
                    <th class="p-1">SKU</th>
                    <th class="p-1">MfgPartNo</th>
                    <th class="p-1">Product</th>
                    <th class="p-1" style="text-align: center">Qty</th>
                    <th class="p-1" style="text-align: center">Price</th>
                    <th class="p-1" style="text-align: right">Total</th>
                    <th class="p-1" style="text-align: right">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in cartItems" :key="item.Sku">
                    <td class="p-1">{{ index + 1 }}</td>
                    <td class="p-1">{{ item.Sku ? item.Sku : "" }}</td>
                    <td class="p-1">{{ item.vendorItemNumber }}</td>
                    <td class="p-1">{{ item.Description ? item.Description : "" }}</td>

                    <td class="p-1" style="text-align: right">
                        <input class="form-control" style="width: 90px; height: 30px"
                            :value="item.quantity ? item.quantity : 0" type="number" min="0"
                            @input="updateQuantity(item, $event.target.value)" />
                    </td>
                    <td style="text-align: right" class="p-1">{{ item.UnitPrice ? item.UnitPrice : ""
                        }}</td>

                    <td style="text-align: right" class="p-1">{{ item.totalPrice ? item.totalPrice :
                        "" }}</td>

                    <td class="p-1" style="text-align: right">
                        <button class="btn btn-danger btn-sm" @click="removeItem(item)">
                            Remove
                        </button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th class="p-1"></th>
                    <th class="p-1"></th>
                    <th class="p-1"></th>
                    <th class="p-1"></th>
                    <th class="p-1"></th>
                    <th class="p-1" style="text-align: right">
                        {{ formatter.format(saleTotal) }}
                    </th>
                    <th class="p-1"></th>
                </tr>
            </tfoot>
        </table>
    </div>

</template>

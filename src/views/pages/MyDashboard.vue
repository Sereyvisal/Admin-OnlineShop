<template>
  <div>
    <v-row>
      <v-col v-for="data in statisticsData" :key="data.title" cols="6" md="3" class="d-flex align-center">
        <v-card style="width: 100%">
          <v-card-text class="d-flex align-center">
            <v-avatar
              size="58"
              :color="resolveStatisticsIconVariation(data.title).color"
              rounded
              class="elevation-1"
              :style="resolveStatisticsIconVariation(data.title).bgImg"
            >
              <v-icon dark color="white" size="44">
                {{ resolveStatisticsIconVariation(data.title).icon }}
              </v-icon>
            </v-avatar>

            <div class="ms-3">
              <p class="text-lg font-weight-bold mb-0">
                {{ data.title }}
              </p>

              <h3 class="text-xl font-weight-semibold">
                {{ data.total }}
              </h3>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 pt-2">
              <v-row align="center" class="pt-6 pb-12">
                <v-divider></v-divider> <span class="px-4 text-lg font-weight-bold black--text">Pending Orders</span>
                <v-divider></v-divider>
              </v-row>
              <v-data-table :headers="orderHeaders" :items="orderDatas" :items-per-page="2" class="elevation-0">
                <template v-slot:[`item.customer`]="{ item }">
                  Name: {{ item.customer.firstname }} {{ item.customer.lastname }}
                  <br />
                  Phone: {{ item.customer.phone_number }}
                </template>

                <template v-slot:[`item.products`]="{ item }">
                  <!-- <div @click="jumpGoodsPage(p, scope.row.type)" class="goods-item" v-for="(p,k) in scope.row.sku_infos" :key="k"> -->
                  <div class="goods-item" v-for="(p, index) in item.products" :key="index">
                    <!-- <v-img 
                      class="image imagecss"
                      style="width: 100px; height: 100px; object-fit: cover"
                      :src="checkAvatar(p.product_info.product_id.image[0])"
                    /> -->

                    <v-avatar rounded size="110" class="me-4">
                      <v-img :src="checkAvatar(p.product_info.image[0])"></v-img>
                    </v-avatar>

                    <div class="g-info">
                      <!-- @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)" -->
                      <p style="display: flex; align-items: center; line-height: 15px">
                        <span style="word-break: normal; margin-left: 0" class="bold-text">
                          Name: {{ p.product_info.product_id.name }}
                        </span>
                      </p>

                      <p>Product No：{{ p.product_info.product_id.product_no }}</p>

                      <!-- @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)" -->
                      <p>{{ getProductAttribute(p.product_info.attr) }}</p>

                      <p>
                        Unit Price: {{ p.product_info.selling_price | price }}, Quantity: {{ p.order_qty }}, Total:
                        {{ getTotal(p.order_qty, p.product_info.selling_price) | price }}
                      </p>
                    </div>
                  </div>
                </template>

                <template v-slot:[`item.detail`]="{ item }">
                  <p class="mb-2 mt-4">Delivery Address: {{ item.delivery_address }}</p>
                  <!-- <p class="mb-2">Payment Method: {{ item.payment_method }}</p> -->
                  <p class="mb-2">Delivery Fee: {{ item.delivery_fee | price }}</p>
                  <p class="mb-2">Tax ({{ item.tax }}%): {{ item.tax_amount | price }}</p>
                  <p class="mb-4">Order Total Price: {{ item.order_total_price | price }}</p>
                </template>

                <template v-slot:[`item.status`]="{ item }">
                  <v-chip :color="getStatusColor(item.status[0].type)">
                    {{ Object.keys(statusList).find(key => statusList[key] == item.status[0].type) }}
                  </v-chip>
                </template>

                <template v-slot:[`item.remark`]="{ item }">
                  {{ showMore(item.remark) }}
                </template>

                <!-- <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip
                  top
                  v-if="item.status[0].type == statusList.Pending && item.status[0].type != statusList.Cancel"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="mr-2" @click="handleEditDialog(item)" v-bind="attrs" v-on="on"> mdi-pencil </v-icon>
                  </template>
                  <span>Edit</span>
                </v-tooltip>

                <v-tooltip
                  top
                  v-if="item.status[0].type == statusList.Pending && item.status[0].type != statusList.Cancel"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="mr-2"
                      @click="UpdateStatus(item, statusList.Cancel)"
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-progress-close
                    </v-icon>
                  </template>
                  <span>Cancel</span>
                </v-tooltip>

                <v-tooltip
                  top
                  v-if="item.status[0].type == statusList.Pending && item.status[0].type != statusList.Cancel"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="mr-2"
                      @click="UpdateStatus(item, statusList.Deliver)"
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-truck-fast
                    </v-icon>
                  </template>
                  <span>Deliver</span>
                </v-tooltip>

                <v-tooltip
                  top
                  v-if="item.status[0].type == statusList.Deliver && item.status[0].type != statusList.Cancel"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="mr-2"
                      @click="UpdateStatus(item, statusList.Complete)"
                      color="success"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-swap-horizontal-bold
                    </v-icon>
                  </template>
                  <span>Confirm Transaction</span>
                </v-tooltip>
              </template> -->
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 pt-2">
          <v-row align="center" class="pt-6 pb-12">
            <v-divider></v-divider> <span class="px-4 text-lg font-weight-bold black--text">Customers</span>
            <v-divider></v-divider>
          </v-row>

          <v-data-table :headers="customerHeaders" :items="customerList" :items-per-page="5" class="elevation-0">
            <template v-slot:[`item.avatar`]="{ item }">
              <v-img
                :lazy-src="blankProfileImg"
                :src="item.avatar == '' || item.avatar == undefined ? blankProfileImg : imgUrl + item.avatar"
                width="70px"
                height="70px"
                style="margin: 10px; border-radius: 50px"
              ></v-img>
            </template>

            <template v-slot:[`item.phone_number`]="{ item }">
              {{ formatPhoneNumber(item.phone_number) }}
            </template>

            <template v-slot:[`item.address`]="{ item }">
              {{ getAddressString(item.address) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
// eslint-disable-next-line object-curly-newline
import { mdiAccountOutline, mdiCurrencyUsd, mdiTrendingUp, mdiDotsVertical, mdiLabelOutline } from '@mdi/js'
import { listCustomer } from '@/api/generalAPI'
import { listStockOut } from '@/api/stockout'
import { listProduct } from '@/api/product'
import { listOrder } from '@/api/order'
import serverConfig from '@/utils/serverConfig'
import { getProductAttribute } from '@/utils/generalFunc'
import { meta, status_type } from '@/utils/enum'

export default {
  setup() {
    const resolveStatisticsIconVariation = data => {
      if (data === 'Sales')
        return {
          icon: mdiTrendingUp,
          color: 'primary',
          bgImg: 'backgroundImage: linear-gradient(45deg, rgb(213, 0, 249), rgb(101, 31, 255))',
        }
      if (data === 'Customers')
        return {
          icon: mdiAccountOutline,
          color: 'success',
          bgImg: 'backgroundImage: linear-gradient(45deg, rgb(255, 23, 68), rgb(187, 0, 47))',
        }
      if (data === 'Product')
        return {
          icon: mdiLabelOutline,
          color: 'warning',
          bgImg: 'backgroundImage: linear-gradient(45deg, rgb(0, 175, 255), rgb(0, 145, 234))',
        }
      if (data === 'Revenue')
        return {
          icon: mdiCurrencyUsd,
          color: 'info',
          bgImg: 'backgroundImage: linear-gradient(45deg, rgb(0, 178, 72), rgb(0, 230, 178))',
        }

      return { icon: mdiAccountOutline, color: 'success' }
    }

    return {
      resolveStatisticsIconVariation,

      // icons
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiAccountOutline,
        mdiLabelOutline,
        mdiCurrencyUsd,
      },
    }
  },
  data() {
    return {
      blankProductImg: serverConfig.blank_product_img,
      blankProfileImg: serverConfig.blank_profile_img,
      imgUrl: serverConfig.file_url,
      statusList: status_type,
      customerList: [],
      statisticsData: [
        {
          title: 'Sales',
          total: 0,
        },
        {
          title: 'Customers',
          total: 0,
        },
        {
          title: 'Products',
          total: 0,
        },
        {
          title: 'Revenue',
          total: 0,
        },
      ],
      stockOutDatas: [],
      productDatas: [],
      orderDatas: [],
      orderHeaders: [
        {
          text: 'Order Number',
          value: 'order_no',
          sortable: false,
          width: '120',
        },
        {
          text: 'Order Date',
          value: 'order_date',
          width: '190',
          sortable: false,
        },
        {
          text: 'Customer',
          value: 'customer',
          sortable: false,
          width: '190',
        },
        {
          text: 'Products',
          value: 'products',
          sortable: false,
          width: '500',
        },
        {
          text: 'Information Detail',
          value: 'detail',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'status',
          sortable: false,
          width: '100',
          align: 'center',
        },
        // {
        //   text: "Action",
        //   value: "actions",
        //   sortable: false,
        //   align: "center",
        //   width: "130px"
        // },
      ],
      customerHeaders: [
        {
          text: 'Avatar',
          value: 'avatar',
          sortable: false,
          width: '20',
          align: 'center',
        },
        {
          text: 'Email',
          value: 'email',
          sortable: false,
          width: '140',
        },
        {
          text: 'Fullname',
          value: 'fullname',
          sortable: false,
        },
        {
          text: 'Gender',
          value: 'gender',
          align: 'center',
          sortable: false,
          width: '100',
        },
        {
          text: 'Birthday',
          value: 'birthday',
          sortable: false,
          width: '190',
        },
        {
          text: 'Phone Number',
          value: 'phone_number',
          sortable: false,
        },
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          width: '400',
        },
      ],
    }
  },
  methods: {
    getProductAttribute,
    getTotal(qty, price) {
      return qty * price
    },
    getAddressString(address) {
      if (address.length) {
        var default_addr = address.find(e => e.default)
        return (
          default_addr.address +
          ', ' +
          default_addr.city +
          ', ' +
          (default_addr.state ? default_addr.state + ', ' : '') +
          default_addr.zidefault_addr +
          ', ' +
          default_addr.country
        )
      }

      return ''
    },
    getCustomerData() {
      listCustomer()
        .then(res => {
          if (res.meta == 2001) {
            // this.tableLoading = false
            this.statisticsData[1].total = res.datas.length

            if (res.datas.length == 0) {
              // this.$toast('No Data')
              this.customerList = []
              return true
            }

            this.customerList = res.datas

            this.customerList.forEach((d, i) => {
              d.birthday != null ? (d.birthday = this.moment(d.birthday).format('YYYY-MM-DD')) : ''
              d.fullname = d.firstname + ' ' + d.lastname
            })
          } else {
            console.log(res)
            this.$toast.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast.error(`Error - ${err.meta}`)
        })
    },
    getStockOutData() {
      listStockOut()
        .then(res => {
          if (res.meta == 2001) {
            this.tableLoading = false

            if (res.datas.length == 0) {
              // this.$toast("No Data");
              this.stockOutDatas = []
              return true
            }

            this.stockOutDatas = res.datas

            this.stockOutDatas.forEach((d, i) => {
              d.stock_out_date != null
                ? (d.stock_out_date = this.moment(d.stock_out_date).format('YYYY-MM-DD, hh:mm A'))
                : ''

              for (var p of d.products) {
                this.statisticsData[0].total += p.stock_out_qty
              }
            })

            // this.filterDatas = this.datas;
          } else {
            console.log(res)
            this.$toast.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast.error(`Error - ${err.meta}`)
        })
    },
    getProductData() {
      listProduct()
        .then(res => {
          if (res.meta == 2001) {
            this.tableLoading = false
            this.statisticsData[2].total = res.datas.length

            if (res.datas.length == 0) {
              // this.$toast("No data found");
              return true
            }

            this.productDatas = res.datas
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast.error(`Error - ${err.meta}`)
        })
    },
    getOrderData() {
      listOrder(this.search)
        .then(res => {
          if (res.meta == 2001) {
            this.tableLoading = false

            if (res.datas.length == 0) {
              // this.$toast("No Data");
              this.orderDatas = []
              return true
            }

            this.orderDatas = res.datas

            this.orderDatas.forEach((d, i) => {
              d.order_date != null ? (d.order_date = this.moment(d.order_date).format('YYYY-MM-DD, hh:mm A')) : ''
              d.customer.fullname = d.customer.firstname + ' ' + d.customer.lastname
              d.order_total_price = 0

              d.products.forEach(p => {
                p.total_price = p.order_qty * p.product_info.selling_price
                d.order_total_price += p.total_price
              })

              d.tax_amount = (d.order_total_price * d.tax) / 100

              d.order_total_price += d.delivery_fee + d.tax_amount

              this.statisticsData[3].total += d.order_total_price
            })

            this.statisticsData[3].total = '$' + this.statisticsData[3].total.toFixed(2)

            this.orderDatas = this.orderDatas.filter(e => e.status[0].type == this.statusList.Pending)

            // this.filterDatas = this.orderDatas;
            // console.log("datas: ", this.orderDatas)
          } else {
            console.log(res)
            this.$toast.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast.error(`Error - ${err.meta}`)
        })
    },
    checkAvatar(item) {
      return item == '' || item == undefined ? this.blankProductImg : this.imgUrl + item
    },
  },
  mounted() {
    this.getCustomerData()
    this.getStockOutData()
    this.getProductData()
    this.getOrderData()
  },
}
</script>

<style lang="scss">
  .goods-item {
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 0px;
    padding: 10px 0px;
    cursor: pointer;
    clear: both;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
    .image {
      float: left !important;
      margin-right: 5px !important;
    }
    .g-info {
      text-align: left;
      padding-left: 10px!important;
      p {
        margin: 0px !important;
        padding: 3px 0px;
        line-height: 20px;
        span {
          margin: 0px !important;
        }
      }
    }
  }
  .imagecss {
    width: 100px !important;
    object-fit: cover;
  }
</style>
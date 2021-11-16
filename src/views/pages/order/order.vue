<template>
  <v-container fluid class="sys-page">
    <PageNavigation />

    <v-row class="pt-16">
      <v-col cols="12">
        <base-material-card title="Order" icon="mdi-shopping-outline">
          <v-row class="mt-2">
            <v-col cols="12" lg="3" md="3" sm="5">
              <v-text-field
                v-model="search.keyword"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                hint="Empty input will clear filter"
                persistent-hint
                clearable
              />
            </v-col>

            <v-col cols="12" lg="3" md="3" sm="5">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeText"
                    label="Search between date"
                    prepend-inner-icon="mdi-calendar"
                    hint="Empty input will clear filter"
                    persistent-hint
                    prepend-icon=""
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>

                <v-date-picker
                  v-model="dates"
                  range
                  @input="dates.length == 2 ? (menu2 = false) : true"
                />
              </v-menu>
            </v-col>

            <v-col
              cols="12"
              lg="1"
              md="1"
              sm="1"
              align-self="center"
              :class="
                $vuetify.breakpoint.mdAndDown ? 'd-flex justify-end pr-0' : ''
              "
            >
              <v-btn fab small color="primary" @click="handleSearch">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>

            <v-spacer :hidden="$vuetify.breakpoint.xsAndDown" />
            
            <v-col
              cols="12"
              lg="2"
              md="2"
              sm="4"
              class="d-flex justify-end"
              align-self="center"
            >
              <v-btn
                color="primary"
                @click="$router.push('/order/0')"
              >
                <v-icon left>mdi-plus</v-icon>
                add
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <!-- sort-by="order_date"
              :sort-desc="true" -->
              <v-data-table
                :headers="headers"
                :items="filterDatas"
                :items-per-page="10"
                :loading="tableLoading"
                class="elevation-0"
              >
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

                    <v-avatar
                      rounded
                      size="110"
                      class="me-4"
                    >
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
                          Unit Price: {{ p.product_info.selling_price | price }}, Quantity: {{ p.order_qty }}, 
                          Total: {{ getTotal(p.order_qty, p.product_info.selling_price) | price }}
                        </p>
                    </div>
                  </div>
                </template>

                <template v-slot:[`item.detail`]="{ item }">
                  <p class="mb-2 mt-4">Delivery Address: {{ item.delivery_address }}</p>
                  <!-- <p class="mb-2">Payment Method: {{ item.payment_method }}</p> -->
                  <p class="mb-2">Delivery Fee: {{ item.delivery_fee | price }}</p>
                  <p class="mb-2">Tax ({{item.tax}}%): {{ item.tax_amount | price }}</p>
                  <p class="mb-4">Order Total Price: {{ item.order_total_price | price }}</p>
                </template>

                <template v-slot:[`item.status`]="{ item }">
                  <v-chip :color="getStatusColor(item.status[0].type)" >
                    {{ Object.keys(statusList).find(key => statusList[key] == item.status[0].type) }}
                  </v-chip>
                </template>

                <template v-slot:[`item.remark`]="{ item }">
                  {{ showMore(item.remark) }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <!-- <div class="d-flex ml-2">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-2"
                          @click="handleEditDialog(item)"
                          color="info"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-truck-fast
                        </v-icon>
                      </template>
                      <span>Deliver</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-2"
                          @click="handleEditDialog(item)"
                          color="success"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-swap-horizontal-bold
                        </v-icon>
                      </template>
                      <span>Confirm Transaction</span>
                    </v-tooltip>
                  </div>

                  <br/>

                  <div class="d-flex ml-2">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-2"
                          @click="handleEditDialog(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-pencil
                        </v-icon>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon 
                          @click="handleDeleteDialog(item)" 
                          color="error" 
                          v-bind="attrs" 
                          v-on="on"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </div> -->

                  <v-tooltip top v-if="item.status[0].type == statusList.Pending && item.status[0].type != statusList.Cancel">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="mr-2"
                        @click="handleEditDialog(item)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>

                  <v-tooltip top v-if="item.status[0].type == statusList.Pending && item.status[0].type != statusList.Cancel">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="mr-2"
                        @click="UpdateStatus(item, statusList.Cancel)"
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-progress-close
                        <!-- mdi-cancel -->
                      </v-icon>
                    </template>
                    <span>Cancel</span>
                  </v-tooltip>

                  <v-tooltip top v-if="item.status[0].type == statusList.Pending && item.status[0].type != statusList.Cancel">
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

                  <v-tooltip top v-if="item.status[0].type == statusList.Deliver && item.status[0].type != statusList.Cancel">
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

                  <!-- <v-tooltip top v-if="item.status[0].type != statusList.Cancel">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="mr-2"
                        @click="handleEditDialog(item)"
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-map-marker-radius
                      </v-icon>
                    </template>
                    <span>Modify Delivery Address</span>
                  </v-tooltip> -->

                </template>
              </v-data-table>
            </v-col>
          </v-row>

        </base-material-card>
      </v-col>
    </v-row>

    <DialogDelete
      :dialogDelete.sync="dialogDelete"
      :deleteObj="deleteObj"
      @handleDelete="handleDeleteConfirm"
    />

  </v-container>
</template>

<script>
import { upsertInventory } from "@/api/inventory";
import { listOrder, deleteOrder, updateStatus } from "@/api/order";
import serverConfig from "@/utils/serverConfig";
import { getProductAttribute } from "@/utils/generalFunc"
import { meta, status_type } from "@/utils/enum";

const newObj = () => {
  return {
    order_no: "",
    order_date: "",
    customer: "",
    products: [],
    payment_method: "",
    delivery_method: "",
    delivery_fee: "",
    status: "",
    remark: "",
    attachments: []
  }
};

const newSearch = () => {
  return {
    keyword: "",
    bt: "",
    et: "",
  };
};

export default {
  components: {
    DialogDelete: () => import("@/components/deleteDialog"),
    PageNavigation: () => import("@/components/pageNavigation"),
  },
  data() {
    return {
      statusList: status_type,
      dialogProduct: false,
      blankImg: serverConfig.blank_product_img,
      imgUrl: serverConfig.file_url,
      tableLoading: true,
      datas: [],
      filterDatas: [],
      dates: [],
      menu2: false,
      categoryItems: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Order Number",
          value: "order_no",
          sortable: false,
          width: "120"
        },
        {
          text: "Order Date",
          value: "order_date",
          width: "190",
          sortable: false,
        },
        {
          text: "Customer",
          value: "customer",
          sortable: false,
          width: "190"
        },
        {
          text: "Products",
          value: "products",
          sortable: false,
          width: "500"
        },
        {
          text: "Information Detail",
          value: "detail",
          sortable: false
        },
        {
          text: "Status",
          value: "status",
          sortable: false,
          width: "100",
          align: "center"
        },
        {
          text: "Action",
          value: "actions",
          sortable: false,
          align: "center",
          width: "130px"
        },
      ],
      search: newSearch(),
      obj: newObj(),
      deleteObj: newObj(),
    };
  },
  methods: {
    getProductAttribute,
    getOrderData() {
      listOrder(this.search)
        .then((res) => {
          if(res.meta == meta.OK) {
            this.tableLoading = false;

            if(res.datas.length == 0){
              this.$toast("No Data");
              this.datas = [];
              return true;
            }

            this.datas = res.datas;
            console.log("customer: ", this.datas);

            this.datas.forEach((d, i) => {
              (d.order_date != null) ? (d.order_date = this.moment(d.order_date).format("YYYY-MM-DD, hh:mm A")) : "";
              d.customer.fullname = d.customer.firstname + " " + d.customer.lastname;
              d.order_total_price = 0;

              d.products.forEach(p => {
                p.total_price = p.order_qty * p.product_info.selling_price;
                d.order_total_price += p.total_price;
              })

              d.tax_amount = (d.order_total_price * d.tax) / 100;

              d.order_total_price += d.delivery_fee + d.tax_amount;
            })

            this.filterDatas = this.datas;
            console.log("datas: ", this.datas)
          }
          else {
            console.log(res);
            this.$toast.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(`Error - ${err.meta}`);
        });
    },
    handleEditDialog(obj) {
      this.$router.push("/order/" + obj._id);
    },
    handleDeleteDialog(obj) {
      this.dialogDelete = true;
      this.deleteObj = obj;
    },
    async handleDeleteConfirm(obj) {
      this.dialogDelete = false

      var tempInventory = {
        _id: obj.inventory._id,
        product_info_id: obj.inventory.product_info._id,
        qty: obj.inventory.qty - obj.qty
      }

      await upsertInventory(tempInventory)
        .catch((err) => {
          console.log(err);
        });

      await deleteOrder(obj._id)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.$toast(res.message);
            this.getOrderData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSearch() {
      this.search.bt = Array.isArray(this.dates) ? this.dates[0] || "" : "";
      this.search.et = Array.isArray(this.dates) ? this.dates[1] || "" : "";

      if (this.search.keyword == '' && this.search.bt == '' && this.search.et == '') {
        this.filterDatas = this.datas
        return
      }

      if (this.search.keyword != '' && this.search.bt == '' && this.search.et == '') {
        var reg = new RegExp(this.search.keyword, 'i')
        this.filterDatas = this.datas.filter(
          e =>  e.order_no.match(reg) ||
                e.customer.fullname.match(reg) ||
                e.customer.phone_number.match(reg) ||
                // e.payment_method.match(reg) ||
                e.delivery_address.match(reg) ||
                e.products.find(p => p.product_info.product_id.product_no.match(reg)) ||
                e.products.find(p => p.product_info.product_id.name.match(reg))
        )
      } 
      else if (this.search.keyword == '' && this.search.bt != '' && this.search.et != '') {
        this.filterDatas = 
          this.datas.filter(
            e => this.moment(e.order_date).format("YYYY-MM-DD") >= this.search.bt 
              && this.moment(e.order_date).format("YYYY-MM-DD") <= this.search.et
          )
      } 
      else if (this.search.keyword != '' && this.search.bt != '' && this.search.et != '') {
        var reg = new RegExp(this.search.keyword, 'i')
        this.filterDatas = this.datas.filter(
          e => (
              e.order_no.match(reg) ||
              e.customer.fullname.match(reg) ||
              e.customer.phone_number.match(reg) ||
              // e.payment_method.match(reg) ||
              e.delivery_address.match(reg) ||
              e.products.find(p => p.product_info.product_id.product_no.match(reg)) ||
              e.products.find(p => p.product_info.product_id.name.match(reg))
            ) 
            && (
              this.moment(e.order_date).format("YYYY-MM-DD") >= this.search.bt 
              && this.moment(e.order_date).format("YYYY-MM-DD") <= this.search.et
            )
        )
      }

      setTimeout(() => {
        this.search = newSearch();
        this.dates = [];
      }, 500);
    },
    checkAvatar(item) {
      return item == "" || item == undefined
          ? this.blankImg
          : this.imgUrl + item
    },
    getTotal(qty, price) {
      return qty * price;
    },
    UpdateStatus(obj, status_type) {
      var temp = {
        name: Object.keys(this.statusList).find(key => this.statusList[key] == status_type),
        date: this.moment().format("YYYY-MM-DD hh:mm A"),
        type: status_type
      }

      obj.status.unshift(temp);

      updateStatus(obj).then(res => {
        if (res.meta == meta.OK) {
          this.$toast.success(res.message);
          this.getOrderData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
  },
  mounted() {
    this.getOrderData();
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    }
  },
};
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
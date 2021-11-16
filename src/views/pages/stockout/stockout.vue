<template>
  <v-container fluid class="sys-page">
    <PageNavigation />

    <v-row class="pt-16">
      <v-col cols="12">
        <base-material-card title="Stock Out" icon="mdi-home-export-outline">
          <v-row class="mt-2">
            <v-col cols="12" lg="3" md="3" sm="5">
              <v-text-field
                v-model="search.keyword"
                prepend-inner-icon="mdi-magnify"
                label="Search product number"
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
                @click="$router.push('/stockout/0')"
              >
                <v-icon left>mdi-plus</v-icon>
                add
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="filterDatas"
                :items-per-page="10"
                :loading ="tableLoading"
                class="elevation-0"
              >
                <template v-slot:[`item.products`]="{ item }">
                  <!-- <div @click="jumpGoodsPage(p, scope.row.type)" class="goods-item" v-for="(p,k) in scope.row.sku_infos" :key="k"> -->
                  <div class="goods-item" v-for="(p, index) in item.products" :key="index"> 
                    <!-- <v-img 
                      class="image imagecss"
                      style="width: 100px; height: 100px; object-fit: cover"
                      :src="checkAvatar(p.product_info.image[0])"
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
                          Unit Price: {{ p.product_info.selling_price | price }}, Quantity: {{ p.stock_out_qty }}, 
                          Total: {{ getTotal(p.stock_out_qty, p.product_info.selling_price) | price }}
                        </p>
                    </div>
                  </div>
                </template>

                <template v-slot:[`item.image`]="{ item }">
                  <v-img
                    :lazy-src="blankImg"
                    :src="checkAvatar(item.image)"
                    width="70px"
                    height="70px"
                    style="margin: 10px; border-radius: 4px"
                  ></v-img>
                </template>

                <template v-slot:[`item.remark`]="{ item }">
                  {{ showMore(item.remark) }}
                </template>

                <template v-slot:[`item.type`]="{ item }">
                  <v-chip color="primary" v-if="item.type == stock_out_type.ManualStockOut" class="ma-0">
                    Manual Stock Out
                  </v-chip>

                  <v-chip color="info" v-else-if="item.type == stock_out_type.OrderStockOut">
                    Order Stock Out
                  </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top v-if="item.type == stock_out_type.ManualStockOut">
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

                  <v-tooltip top v-if="item.type == stock_out_type.ManualStockOut">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon @click="handleDeleteDialog(item)" color="error" v-bind="attrs" v-on="on">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
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
import { getInventory, upsertInventory } from "@/api/inventory";
import { listStockOut, deleteStockOut } from "@/api/stockout";
import serverConfig from "@/utils/serverConfig";
import { getProductAttribute } from "@/utils/generalFunc";
import { stock_out_type } from "@/utils/enum";

const newObj = () => {
  return {
    stock_out_date: "",
    products: [],
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
      stock_out_type: stock_out_type,
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
          text: "Stock Out Date",
          value: "stock_out_date",
          sortable: false,
          width: "190"
        },
        {
          text: "Products",
          value: "products",
          sortable: false,
        },
        {
          text: "Stock Out Type",
          value: "type",
          sortable: false,
          width: "170"
        },
        {
          text: "Remark",
          value: "remark",
          sortable: false,
          width: "400"
        },
        {
          text: "Action",
          value: "actions",
          sortable: false,
          align: "center",
          width: "100px"
        },
      ],
      search: newSearch(),
      obj: newObj(),
      deleteObj: newObj(),
    };
  },
  methods: {
    getProductAttribute,
    getStockOutData() {
      listStockOut(this.search)
        .then((res) => {
          if(res.meta == 2001) {
            this.tableLoading = false;

            if(res.datas.length == 0){
              this.$toast("No Data");
              this.datas = [];
              return true;
            }

            this.datas = res.datas;

            this.datas.forEach((d, i) => {
              (d.stock_out_date != null) ? (d.stock_out_date = this.moment(d.stock_out_date).format("YYYY-MM-DD, hh:mm A")) : "";
              // d.image = d.inventory.product_info.image[0];

              // d.attr = getProductAttribute(d.inventory.product_info.attr);
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
      this.$router.push("/stockout/" + obj._id);
    },
    handleDeleteDialog(obj) {
      this.dialogDelete = true;
      this.deleteObj = obj;
    },
    async handleDeleteConfirm(obj) {
      this.dialogDelete = false

      for (var p of obj.products) {
        var tempInventory = {
          _id: p._id,
          product_info_id: p.product_info._id,
          qty: p.qty + p.stock_out_qty
        }

        await upsertInventory(tempInventory)
          .catch((err) => {
            console.log(err);
          });
      }

      await deleteStockOut(obj._id)
        .then((res) => {
          if (res.meta == 2001) {
            this.$toast(res.message);
            this.getStockOutData();
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
        this.filterDatas = this.datas.filter(e => e.inventory.product_info.product_id.product_no.match(reg))
      } 
      else if (this.search.keyword == '' && this.search.bt != '' && this.search.et != '') {
        this.filterDatas = 
          this.datas.filter(
            e => this.moment(e.stock_out_date).format("YYYY-MM-DD") >= this.search.bt 
              && this.moment(e.stock_out_date).format("YYYY-MM-DD") <= this.search.et
          )
      } 
      else if (this.search.keyword != '' && this.search.bt != '' && this.search.et != '') {
        var reg = new RegExp(this.search.keyword, 'i')
        this.filterDatas = this.datas.filter(
          e => e.inventory.product_info.product_id.product_no.match(reg) 
            && (
              this.moment(e.stock_out_date).format("YYYY-MM-DD") >= this.search.bt 
              && this.moment(e.stock_out_date).format("YYYY-MM-DD") <= this.search.et
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
  },
  mounted() {
    this.getStockOutData();
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
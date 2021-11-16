<template>
  <v-container fluid class="sys-page">
    <PageNavigation />

    <v-row class="pt-16">
      <v-col cols="12">
        <base-material-card title="Stock In" icon="mdi-home-import-outline">
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
                @click="$router.push('/stockin/0')"
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

                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top v-if="!item.is_receive">
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

                  <v-tooltip top v-if="!item.is_receive">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon @click="handleDeleteDialog(item)" color="error" v-bind="attrs" v-on="on">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>

                  <v-chip 
                    v-if="item.is_receive" 
                    color="green" 
                    class="white--text"
                    @click="handleReceivedDialog(item)"
                  >
                    received
                  </v-chip>
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
import { listStockIn, deleteStockIn } from "@/api/stockin";
import serverConfig from "@/utils/serverConfig";
import { getProductAttribute } from "@/utils/generalFunc"

const newObj = () => {
  return {
    stock_in_date: "",
    inventory: "",
    qty: "",
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
          text: "Product Image",
          value: "image",
          sortable: false,
          width: '20',
        },
        {
          text: "Product No",
          value: "inventory.product_info.product_id.product_no",
          sortable: false,
          width: "140"
        },
        {
          text: "Product Name",
          value: "inventory.product_info.product_id.name",
          sortable: false,
        },
        {
          text: "Attributes",
          value: "attr",
          sortable: false,
        },
        {
          text: "Quantity",
          value: "qty",
          align: "center",
          sortable: false,
          width: "100"
        },
        {
          text: "Stock In Date",
          value: "stock_in_date",
          sortable: false,
          width: "190"
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
    getStockInData() {
      listStockIn(this.search)
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
              (d.stock_in_date != null) ? (d.stock_in_date = this.moment(d.stock_in_date).format("YYYY-MM-DD, hh:mm A")) : "";
              d.image = d.inventory.product_info.image[0];

              d.attr = getProductAttribute(d.inventory.product_info.attr);
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
      this.$router.push("/stockin/" + obj._id);
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

      await deleteStockIn(obj._id)
        .then((res) => {
          if (res.meta == 2001) {
            this.$toast(res.message);
            this.getStockInData();
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
            e => this.moment(e.stock_in_date).format("YYYY-MM-DD") >= this.search.bt 
              && this.moment(e.stock_in_date).format("YYYY-MM-DD") <= this.search.et
          )
      } 
      else if (this.search.keyword != '' && this.search.bt != '' && this.search.et != '') {
        var reg = new RegExp(this.search.keyword, 'i')
        this.filterDatas = this.datas.filter(
          e => e.inventory.product_info.product_id.product_no.match(reg) 
            && (
              this.moment(e.stock_in_date).format("YYYY-MM-DD") >= this.search.bt 
              && this.moment(e.stock_in_date).format("YYYY-MM-DD") <= this.search.et
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
    }
  },
  mounted() {
    this.getStockInData();
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    }
  },
};
</script>
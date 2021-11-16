<template>
  <v-container fluid>
    <PageNavigation />

    <v-row class="pt-16">
      <v-col cols="12">
        <base-material-card title="Inventory" icon="mdi-post">
          <v-row class="mt-3">
            <v-col cols="12" lg="3" md="3" sm="5">
              <v-text-field
                label="Search product number"
                prepend-inner-icon="mdi-magnify"
                persistent-hint
                hint="Empty input will clear filter"
                v-model="search.keyword"
                clearable
              />
            </v-col>

            <v-col cols="12" lg="3" md="3" sm="5">
              <v-autocomplete
                :items="categoryList"
                :item-text="item => item.text"
                :item-value="item => item.value"
                prepend-inner-icon="mdi-shape"
                hint="Empty input will clear filter"
                persistent-hint
                label="Search category"
                clearable
                v-model="search.category"
              />
            </v-col>

            <v-col
              cols="12"
              lg="1"
              md="1"
              sm="2"
              align-self="center"
              :class="$vuetify.breakpoint.mdAndDown ? 'd-flex justify-end pr-0' : ''"
            >
              <v-btn fab small color="primary" @click="handleSearch">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="filterDatas"
                :items-per-page="10"
                :loading="tableLoading"
                class="elevation-0"
              >
                <template v-slot:[`item.image`]="{ item }">
                  <v-img
                    lazy-src="https://sportingwineclub.com/wp-content/themes/claue/assets/images/placeholder.png"
                    :src="checkAvatar(item)"
                    width="70px"
                    height="70px"
                    style="margin: 10px; border-radius: 4px"
                  />
                </template>

                <!-- <template v-slot:[`item.name`]="{ item }">
                  <p>{{ item.name }}</p>
                  <span style="color: gray">Product No: {{ item.product_info.product_id.product_no }}</span>
                </template> -->
              </v-data-table>
            </v-col>
          </v-row>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { listInventory } from '@/api/inventory'
import { listCategory } from '@/api/category'
import serverConfig from '@/utils/serverConfig'
import { FilterChild, getProductAttribute } from '@/utils/generalFunc'
import { meta } from '@/utils/enum'

const newObj = () => {
  return {
    product_info_id: '',
    qty: 0,
  }
}

const newSearch = () => {
  return {
    limit: 0,
    skip: 0,
    keyword: '',
    category: '',
  }
}

export default {
  components: {
    PageNavigation: () => import("@/components/pageNavigation"),
    DialogDelete: () => import('@/components/deleteDialog'),
  },
  data() {
    return {
      // tab: 0,
      // warehouseItems: [],
      addAction: false,
      dialogProduct: false,
      imgUrl: serverConfig.file_url,
      tableLoading: true,
      dates: [],
      categoryList: [],
      dialog: false,
      dialogDelete: false,
      datas: [],
      filterDatas: [],
      product_detail: {
        color: '',
        size: '',
        valid_period: '',
      },
      headers: [
        // {
        //   text: this.$t('itemNo'),
        //   value: "itemNo",
        //   width: "100"
        // },
        {
          text: 'Product Image',
          value: 'image',
          sortable: false,
          align: 'center',
          width: '120',
        },
        {
          text: 'Product No',
          value: 'product_no',
          width: '150',
        },
        {
          text: 'Product Name',
          value: 'name',
          width: '600',
        },
        {
          text: 'Category',
          value: 'product_info.product_id.category.name',
        },
        {
          text: 'Attributes',
          value: 'attr',
        },
        {
          text: 'Stock Quantity',
          value: 'qty',
          align: 'center',
        },
      ],
      search: newSearch(),
      obj: newObj(),
      deleteObj: newObj(),
    }
  },
  methods: {
    getInventoryData() {
      listInventory()
        .then(res => {
          if (res.meta == 2001) {
            console.log("res: ", res);
            this.tableLoading = false

            if (res.datas.length == 0) {
              this.$toast('No Data')
              return true
            }

            this.datas = res.datas
            
            this.datas.forEach((d, i) => {
              d.name = d.product_info.product_id.name
              d.product_no = d.product_info.product_id.product_no
              d.attr = getProductAttribute(d.product_info.attr);
            })

            this.filterDatas = this.datas
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
    getCategory() {
      this.categoryList = []

      listCategory()
        .then(res => {
          if (res.meta == meta.OK) {
            this.categoryList = FilterChild('', res.datas, [])
          } 
          else {
            console.log(res)
            this.$toast.error('Error - ' + res.meta)
          }
        })
        .catch(err => {
          console.log('Category', err)
          this.$toast.error('Error')
        })
    },
    handleSelect() {
      this.dialogProduct = true
    },
    checkAvatar(item) {
      return typeof item.product_info.image[0] === 'string' || item.product_info.image[0] == undefined
        ? item.product_info.image[0] == '' || item.product_info.image[0] == undefined
          ? serverConfig.blank_product_img
          : this.imgUrl + item.product_info.image[0]
        : item.product_info.image.length != 0
        ? this.imgUrl + item.product_info.image[0]
        : serverConfig.blank_product_img
    },
    handleSearch() {
      if (this.search.keyword == '' && this.search.category == '') {
        this.filterDatas = this.datas
        return
      }

      if (this.search.keyword != '' && this.search.category == '') {
        var reg = new RegExp(this.search.keyword, 'i')
        this.filterDatas = this.datas.filter(e => e.product_no.match(reg))
      } 
      else if (this.search.keyword == '' && this.search.category != '') {
        this.filterDatas = this.datas.filter(e => e.product_info.product_id.category._id == this.search.category)
      } 
      else if (this.search.keyword != '' && this.search.category != '') {
        var reg = new RegExp(this.search.keyword, 'i')
        this.filterDatas = this.datas.filter(
          e => e.product_no.match(reg) && e.product_info.product_id.category._id == this.search.category
        )
      }

      setTimeout(() => {
        this.search = newSearch()
      }, 500)

      // console.log(this.search);
    },
  },
  mounted() {
    // this.getWarehouseData();
    this.getInventoryData()
    this.getCategory()
  },
  watch: {
    // tab() {
    //   if (this.tab == "0") {
    //     this.filterData = this.datas;
    //   }
    //   else {
    //     this.filterData = this.datas.filter(e => e.warehouse._id == this.tab);
    //   }
    // }
  },
}
</script>
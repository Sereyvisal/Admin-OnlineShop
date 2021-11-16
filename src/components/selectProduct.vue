<template>
  <v-dialog v-model="dialogSelectProduct" persistent max-width="1400px">
    <v-card>
      <v-card-title class="title font-weight-bold pt-8 pl-8">
        <v-icon class="pr-3">mdi-format-list-checks</v-icon>
        Choose Product
      </v-card-title>
      <v-card-text class="pb-2">
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="datas"
                  item-key="_id"
                  :items-per-page="10"
                  mobile-breakpoint="960"
                  class="elevation-2"
                  show-select
                  :single-select="true"
                  :search="search.keyword"
                >

                  <template v-slot:top>
                    <v-text-field
                      prepend-inner-icon="mdi-magnify"
                      v-model="search.keyword"
                      label="Search"
                      outlined
                      dense
                      class="px-6 pt-6 pb-0"
                    >
                    </v-text-field>
                  </template>

                  <template v-slot:[`item.image`]="{ item }">
                    <v-img
                      :lazy-src="blankImg"
                      :src="checkAvatar(item)"
                      width="70px"
                      height="70px"
                      style="margin: 10px; border-radius: 4px"
                    ></v-img>
                  </template>

                  <template v-slot:[`item.description`]="{ item }">
                    {{ showMore(item.description) }}
                  </template>

                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-8 pt-4 mr-5">
        <v-spacer />

        <v-btn color="success" @click="handleSelectProduct">
          confirm
        </v-btn>

        <v-btn color="error" outlined @click="handleCancel">
          cancel
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { listProductItem } from "@/api/product";
import serverConfig from "@/utils/serverConfig";
import { getProductAttribute } from "@/utils/generalFunc";

const newSearch = () => {
  return {
    limit: 0,
    skip: 0,
    keyword: "",
    category: ""
  };
};

export default {
  props: { dialogSelectProduct: Boolean, selectedProduct: Array },
  data() {
    return {
      search: {
        keyword: "",
        skip: 0,
        limit: 0
      },
      pSearch: newSearch(),
      selected: [],
      valid: false,
      datas: [],
      tableLoading: true,
      imgUrl: serverConfig.file_url,
      blankImg: serverConfig.blank_product_img,
      headers: [
        {
          text: "Product Image",
          value: "image",
          width: "140px",
          sortable: false,
          align: "center"
        },
        {
          text: "Product No",
          value: "product_no",
          sortable: false,
          width: "120px"
        },
        {
          text: "Product Name",
          value: "name",
          sortable: false
        },
        {
          text: "Attribute",
          value: "attr",
          align: "start",
          sortable: false
        },
        {
          text: "Category",
          value: "category",
          sortable: false,
          align: "start",
          width: "210"
        },
        // {
        //   text: "Description",
        //   value: "description",
        //   sortable: false,
        //   align: "start"
        // }
      ]
    };
  },
  methods: {
    getData() {
      this.tableLoading = true;
      listProductItem(this.search)
        .then(res => {
          this.tableLoading = false;
          
          console.log("inv: ", res.datas);

          for (var p of res.datas) {
            var temp = {};
            temp._id = p._id;
            temp.main_product_id = p.product_id._id;
            temp.image = p.image;
            temp.description = p.product_id.description;
            temp.selling_price = p.selling_price;
            temp.category = p.product_id.category.name;
            temp.name = p.product_id.name;
            temp.product_no = p.product_id.product_no;
            temp.attr = getProductAttribute(p.attr);
            temp.qty = 0;

            this.datas.push(temp);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectProduct() {
      if (this.selected.length) {
        // console.log("this.selected", this.selected);
        this.$emit("getSelectProduct", this.selected);
        this.$emit("update:dialogSelectProduct", false);
      } else {
        this.$toast.info("Please Select Product");
      }
    },
    handleCancel() {
      this.$emit("update:dialogSelectProduct", false);
    },
    checkAvatar(item) {
      return typeof item.image[0] === "string" || item.image[0] == undefined
        ? item.image[0] == "" || item.image[0] == undefined
          ? this.blankImg
          : this.imgUrl + item.image[0]
        : item.image.length != 0
        ? this.imgUrl + item.image[0]
        : this.blankImg;
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    dialogSelectProduct() {
      if (this.dialogSelectProduct) {
        this.selected = this.selectedProduct;
      }
    }
  }
};
</script>

<style></style>

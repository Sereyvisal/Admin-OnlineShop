<template>
  <v-container fluid>
    <PageNavigation />

    <v-row class="pt-16">
      <v-col cols="12">
        <base-material-card title="Product" icon="mdi-tshirt-crew">
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
                :item-text="(item) => item.text"
                :item-value="(item) => item.value"
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
                @click="$router.push('/product/0')"
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
                :items="items"
                loading="tableLoading"
              >
                <template v-slot:[`item.description`]="{ item }">
                  {{ showMore(item.description) }}
                </template>
                <template v-slot:[`item.is_active`]="{ item }">
                  <v-chip :color="item.is_active ? 'success' : 'error'" dark>
                    {{ item.is_active ? "Active" : "Inactive" }}
                  </v-chip>
                </template>

                <template v-slot:[`item.image`]="{ item }">
                  <v-img
                    :src="checkAvatar(item)"
                    width="70px"
                    height="70px"
                    style="margin: 10px; border-radius: 4px"
                  />
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top v-if="item.is_active">
                    <template v-slot:activator="{ on, attrs }">
                        <!-- :disabled="!item.is_active" -->
                      <v-icon
                        class="mr-2"
                        color="green"
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
                        v-if="item.is_in_use"
                        @click="handleDeactivateDialog(item)"
                        :color="item.is_active ? 'error' : 'success'"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.is_active ? "mdi-sync-off" : "mdi-sync" }}
                      </v-icon>
                    </template>

                    <span>
                      {{ item.is_active ? "Disactivate" : "Reactivate" }}
                    </span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="ml-1"
                        v-if="!item.is_in_use"
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
                </template>

              </v-data-table>
            </v-col>
          </v-row>
        </base-material-card>
      </v-col>
    </v-row>

    <DeleteDialog
      :dialogDelete.sync="deleteDialog"
      :deleteObj="deleteObj"
      :message="deleteMsg"
      @handleDelete="handleDeleteConfirm"
    />
  </v-container>
</template>

<script>
import { listProduct, deleteProduct } from "@/api/product";
import { listCategory } from "@/api/category";
import { meta } from "@/utils/enum";
import serverConfig from "@/utils/serverConfig";
import { FilterChild } from "@/utils/generalFunc";
import { mapGetters } from "vuex";

const newSearch = () => {
  return {
    limit: 0,
    skip: 0,
    keyword: "",
    category: "",
  };
};

export default {
  name: "Product",
  components: {
    DeleteDialog: () => import("@/components/deleteDialog"),
    PageNavigation: () => import("@/components/pageNavigation"),
  },
  data: () => ({
    blankImg: serverConfig.blank_product_img,
    imgUrl: serverConfig.file_url,
    deleteDialog: false,
    deleteMsg: "",
    dialog: false,
    deleteObj: {},
    tableLoading: true,
    items: [],
    categoryList: [],
    search: newSearch(),
    headers: [
      {
        text: "Image",
        value: "image",
        sortable: false,
        width: "20",
        align: "center",
      },
      {
        text: "Product No",
        value: "product_no",
        sortable: false,
        width: "140"
      },
      {
        text: "Product Name",
        value: "name",
        sortable: false,
      },
      {
        text: "Category",
        value: "category.name",
        sortable: false,
      },
      // {
      //   text: "Description",
      //   value: "description",
      //   sortable: false,
      //   width: "400"
      // },
      {
        text: "Status",
        value: "is_active",
        sortable: false,
        align: "center",
        width: "100"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "120px",
      },
    ],
  }),
  methods: {
    getData() {
      this.items = [];
      this.tableLoading = true;

      listProduct(this.search)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.tableLoading = false;

            if (res.datas.length == 0) {
              this.$toast("No data found");
              return true;
            }

            this.items = res.datas;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(`Error - ${err.meta}`);
        });
    },
    getCategory() {
      this.categoryList = [];

      listCategory()
        .then((res) => {
          if (res.meta == meta.OK) {
            this.categoryList = FilterChild("", res.datas, []);
          } else {
            console.log(res);
            this.$toast.error("Error - " + res.meta);
          }
        })
        .catch((err) => {
          console.log("Type", err);
          this.$toast.error("Error");
        });
    },
    checkAvatar(item) {
      return typeof item.image === "string" || item.image == undefined
        ? item.image == "" || item.image == undefined
          ? this.blankImg
          : this.imgUrl + item.image
        : item.image.length > 0
        ? this.imgUrl + item.image[0]
        : this.blankImg;
    },

    handleEditDialog(item) {
      item.category = item.category._id;
      this.$router.push("/product/" + item._id);
    },

    handleDeactivateDialog(item) {
      this.deleteDialog = true;
      item.is_active ? this.deleteMsg = "Are you sure you want to disactivate this product?" : this.deleteMsg = "Are you sure you want to reactivate this product?"
      this.deleteObj = item;
    },
    handleDeleteDialog(item) {
      this.deleteDialog = true;
      this.deleteMsg = "Are you sure you want to delete this product?";
      this.deleteObj = item;
    },
    handleDeleteConfirm(item) {
      this.deleteDialog = false;

      deleteProduct(item._id)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.$toast.success(res.message);
            this.getData();
          } else {
            console.log("Error", res);
            this.$toast.error("Error - " + res.message);
          }
        })
        .catch((err) => {
          this.$toast.error("Error");
          console.log(err);
        });
    },
    handleSearch() {
      this.getData();

      setTimeout(() => {
        this.search = newSearch();
      }, 500);
    },
  },
  mounted() {
    this.getData();
    this.getCategory();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
};
</script>
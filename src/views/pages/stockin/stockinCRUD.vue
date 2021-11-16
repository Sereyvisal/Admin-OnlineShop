<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          elevation="2"
          @click="$router.push({ name: 'stockin' })"
          class="mb-8"
        >
          <v-icon left>mdi-keyboard-return</v-icon>
          Stock In
        </v-btn>
      </v-col>
    </v-row>

    <PageNavigation />

    <base-material-card
      title="Stock In Detail"
      icon="mdi-home-import-outline"
      class="elevation-4 px-8 py-4 mt-14"
    >
      <v-form class="pt-8" v-model="valid" ref="form" lazy-validation>
        <v-row>
          <v-col cols="12" class="pa-0 mb-4">
            <span class="headline">
              <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
              Stock In Information
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
            <v-menu
              v-model="date1"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
              class="ma-0 pa-0"
            >
              <template v-slot:activator="{ on, attrs }" class="ma-0 pa-0">
                <v-text-field
                  append-icon="mdi-calendar"
                  v-model="myObj.stock_in_date"
                  label="Date"
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rule.required]"
                  outlined
                  readonly
                />
              </template>

              <v-date-picker
                v-model="myObj.stock_in_date"
                @input="date1 = false"
                class="ma-0 pa-0"
              />
            </v-menu>
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
            <!-- <v-textarea outlined label="Remark" v-model="myObj.remark" /> -->

            <v-text-field
              v-model="myObj.remark"
              label="Remark"
              outlined
            />
          </v-col>
        </v-row>

        <!-- Attachments -->
        <v-row>
          <v-col cols="12" class="pa-0">
            <span class="headline">
              <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
              Attachments
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="py-0" cols="12">
            <v-btn color="primary" class="mt-4" @click="handleUploadClick">
              Upload Files
            </v-btn>

            <!-- <span class="mt-2 d-flex align-end red--text font-weight-bold">
              File Info
            </span> -->

            <v-file-input
              ref="uploader"
              class="d-none"
              type="file"
              multiple
              accept="image/jpeg, image/png, application/pdf"
              @change="(item) => handleFileChange(item)"
            />
          </v-col>

          <v-col v-if="file.length > 0">
            <v-row>
              <v-col cols="12" class="pt-6">
                <span class="title">
                  List Files
                </span>
                <v-sheet
                  color="white"
                  class="pa-4"
                  elevation="4"
                  width="100%"
                  style="overflow: auto"
                >
                  <span
                    class="d-flex align-center justify-center"
                    v-for="(item, key) in file"
                    :key="key"
                  >
                    <v-list-item
                      v-if="urlImg(item)"
                      link
                      :href="imgUrl + item"
                      target="_blank"
                      class="mylist"
                    >
                      {{ item }}
                    </v-list-item>

                    <v-list-item 
                      v-else 
                      :href="previewFile(item)"
                      target="_blank"
                      class="mylist"
                    > 
                      {{ item.name }} 
                    </v-list-item>

                    <v-icon
                      color="error"
                      class="mx-4"
                      @click="handleFileRemove(item)"
                    >
                      mdi-trash-can
                    </v-icon>
                  </span>
                </v-sheet>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="pa-0 my-4 pt-4">
            <span class="headline">
              <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
              Product
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="py-0 d-flex">
            <v-btn color="primary" @click="dialogSelectProduct = true">
              Choose Product
            </v-btn>
            <!-- <div
              v-if="!selectedProducts.length"
              class="pb-4 red--text d-flex align-end"
            >
              Please select a product
            </div> -->
          </v-col>
        </v-row>

        <v-row>
          <v-col class="py-0" cols="12">
            <v-data-table
              class="elevation-3 my-4"
              :headers="headers"
              item-key="_id"
              :items="selectedProducts"
            >
              <!-- <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="red"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="handleDeleteProduct(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </template> -->

              <template v-slot:[`item.image`]="{ item }">
                <v-img
                  :lazy-src="blankImg"
                  :src="checkAvatar(item)"
                  width="70px"
                  height="70px"
                  style="margin: 10px; border-radius: 4px"
                />
              </template>

              <template v-slot:[`item.qty`]="{ item }">
                <v-text-field
                  style="color: black"
                  class="mt-6 mb-0"
                  outlined
                  dense
                  type="number"
                  v-model.number="item.qty"
                  :rules="[
                    () => !!item.qty || 'this field is required',
                    () => (!!item.qty && item.qty >= 1) || 'quantity cannot less than 1',
                  ]"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions class="py-4 pr-0">
        <v-spacer />

        <v-btn color="success" @click="validate">
          save
        </v-btn>

        <v-btn
          color="error"
          outlined
          @click="$router.push('/stockin')"
        >
          cancel
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
      </v-card-actions>

    </base-material-card>

    <SelectProduct
      :dialogSelectProduct.sync="dialogSelectProduct"
      @getSelectProduct="handleSelectProduct"
      :selectedProduct="selectedProducts"
    />

  </v-container>
</template>

<script>
import serverConfig from "@/utils/serverConfig";
import { removeFile, urlImg, getProductAttribute } from "@/utils/generalFunc";
import { listInventory, upsertInventory, getInventory } from "@/api/inventory";
import { listStockIn, upsertStockIn, getStockIn, deleteStockIn, deleteStockInItem } from "@/api/stockin";
import { uploadFiles, deleteFile } from "@/api/generalAPI";
import { meta, status_type } from "@/utils/enum";

const newObj = () => {
  return {
    stock_in_date: "",
    inventory: "",
    qty: "",
    remark: "",
    attachments: [],
  };
};

export default {
  name: "StockInCRUD",
  components: {
    PageNavigation: () => import("@/components/pageNavigation"),
    DialogDelete: () => import("@/components/deleteDialog"),
    SelectProduct: () => import("@/components/selectProduct"),
  },
  data() {
    return {
      old_po: "",
      myObj: newObj(),
      selectedProducts: [],
      file: [],
      removefiles: [],
      imgUrl: serverConfig.file_url,
      blankImg: serverConfig.blank_product_img,
      dialogDelete: false,
      dialogSelectProduct: false,
      deleteProductObj: {},
      deleteProductItem: [],
      deleteIndex: -1,
      date1: false,
      valid: false,
      rule: {
        required: (v) => !!v || "this field is required",
        numberRule: (v) => v >= 0 || "this field cannot less than 0",
      },
      headers: [
        {
          text: "Product Image",
          value: "image",
          sortable: false,
          width: '140',
        },
        {
          text: "Product No",
          value: "product_no",
          sortable: false,
          width: "150"
        },
        {
          text: "Product Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Attributes",
          value: "attr",
          sortable: false,
          width: "250"
        },
        {
          text: "Quantity",
          value: "qty",
          sortable: false,
          width: "300px"
        }
      ],
    };
  },
  methods: {
    urlImg,
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click();
    },
    handleFileChange(item) {
      if (this.checkFileSize(item).length > 0) {
        this.$toast.error("Cannot upload file bigger than 5MB");
        return true;
      }

      if (this.checkFileType(item)) {
        this.$toast.error("Wrong file format");
        return true;
      }

      if (item.length > 0) {
        item.forEach((p) => this.file.push(p));
      } else {
        this.file.push(item[0]);
      }
    },
    handleFileRemove(item) {
      console.log("remove: ", item);
      if (typeof item == typeof "") {
        // removeFile(item)
        //   .then((res) => {
        //     if (res.meta == 2001) {
        //       this.myObj.attachments.splice(
        //         this.myObj.attachments.indexOf(item[0]),
        //         1
        //       );
        //       this.file.splice(this.file.indexOf(item), 1);
        //     } else {
        //       this.file.splice(this.file.indexOf(item), 1);
        //     }
        //   })
        //   .catch((err) => console.log(err));

        this.removefiles.push(item);
        this.file.splice(this.file.indexOf(item), 1);
      } 
      else {
        this.file.splice(this.file.indexOf(item), 1);
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (this.selectedProducts.length > 0) {
          this.myObj.product_item = this.selectedProducts[0];
        }
        console.log("myObj: ", this.myObj);
        this.handleSave(this.myObj, this.file, this.deleteProductItem);
        this.file = [];
        this.deleteProductItem = [];
      } else {
        this.$toast.info("Please fill all the require field");
      }
    },
    async handleSave(obj, file, delete_items) {
      //Delete File
      if (this.removefiles.length > 0) {
        for (var p of this.removefiles) {
          await deleteFile(p).then(res => {
              if (res.meta == 2001) {
                obj.attachments.splice(obj.attachments.indexOf(p), 1);
              }
            })
            .catch(err => {
              console.log("Remove File Error", err);
            });
        }
      }

      //Upload File
      if (file.length > 0) {
        const files = file.filter((p) => typeof p == typeof {});
        obj.attachments = file.filter((p) => typeof p == typeof "");
        const fileForm = new FormData();

        if (files.length > 1) {
          files.forEach((p) => fileForm.append("file", p));
        } else {
          fileForm.append("file", files[0]);
        }

        await uploadFiles(fileForm)
          .then((res) => {
            res.files.forEach((p) => obj.attachments.push(p.md5));
          })
          .catch(console.log);
      }

      console.log("upsertData: ", obj)
      await upsertStockIn(obj)
        .then((res) => {
          if (res.meta == 2001) {
            this.$toast.success(res.message);
            this.$router.push("/stockin");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    checkAvatar(item) {
      return typeof item.image[0] === "string" || item.image[0] == undefined
        ? item.image[0] == "" || item.image[0] == undefined
          ? this.blankImg
          : this.imgUrl + item.image[0]
        : item.image.length != 0
        ? this.imgUrl + item.image[0]
        : this.blankImg;
    },
    previewFile(item) {
      console.log("item: ", item)
      return URL.createObjectURL(item)
    },
    handleSelectProduct(obj) {
      console.log("handleSelectProduct: ", obj)
      this.selectedProducts = obj;
    },
  },
  mounted() {
    this.deleteProductItem = [];
    this.file = [];

    if (this.$route.params.id == 0) {
      this.myObj = newObj();
      this.myObj.stock_in_date = this.moment().format("YYYY-MM-DD, hh:mm A");
    } 
    else {
      getStockIn(this.$route.params.id)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.myObj = res.data;

            this.myObj.stock_in_date != null
              ? (this.myObj.stock_in_date = this.moment(this.myObj.stock_in_date).format("YYYY-MM-DD, hh:mm A"))
              : "";

            this.myObj.attachments.length > 0
              ? this.myObj.attachments.forEach((p) => this.file.push(p))
              : this.file;

            this.myObj.attr = getProductAttribute(this.myObj.inventory.product_info.attr);

            this.selectedProducts = [
              {
                _id: this.myObj.inventory.product_info._id,
                image: this.myObj.inventory.product_info.image,
                name: this.myObj.inventory.product_info.product_id.name,
                product_no: this.myObj.inventory.product_info.product_id.product_no,
                description: this.myObj.inventory.product_info.product_id.description,
                attr: this.myObj.attr,
                qty: this.myObj.qty,
              }
            ]

            console.log("data: ", this.myObj);
          } 
          else {
            this.$toast.error(res.message);
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style lang="scss">
  .mdi-trash-can::before {
    color: red !important;
  }

  .v-list-item {
    border-radius: 4px;
  }
  .mylist:hover {
    background-color: #f5f5f5;
  }
</style>
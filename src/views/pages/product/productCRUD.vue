<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          elevation="2"
          @click="$router.push({ name: 'product' })"
          class="mb-8"
        >
          <v-icon left>mdi-keyboard-return</v-icon>
          Product
        </v-btn>
      </v-col>
    </v-row>

    <PageNavigation />

    <base-material-card
      title="Product Detail"
      icon="mdi-tshirt-crew"
      class="elevation-4 px-8 py-4 mt-14"
    >
      <v-form class="pt-8" v-model="valid" ref="form" lazy-validation>
        <v-container fluid>
          <v-row>
            <v-col cols="12" class="pa-0 pb-6">
              <span class="headline">
                <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
                Product Information
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="2" md="3" sm="5" class="d-flex justify-start pt-0">
              <v-subheader class="body-1">Product Name</v-subheader>
            </v-col>
            <v-col cols="12" lg="10" md="9" sm="7" class="pt-0">
              <v-text-field
                style="color: black"
                :rules="[rule.required]"
                v-model="productObj.name"
                outlined
                dense
              />
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" lg="2" md="3" sm="5" class="d-flex justify-start pt-0">
              <v-subheader class="body-1">Product No</v-subheader>
            </v-col>
            <v-col cols="12" lg="4" md="6" sm="7" class="pt-0">
              <v-text-field
                style="color: black"
                :rules="[rule.required]"
                v-model="productObj.product_no"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="2" md="3" sm="5" class="d-flex justify-start pt-0">
              <v-subheader class="body-1">Caregory</v-subheader>
            </v-col>
            <v-col cols="12" lg="4" md="6" sm="7" class="pt-0">
              <v-autocomplete
                :items="categoryList"
                clearable
                :rules="[rule.required]"
                v-model="productObj.category"
                item-text="text"
                item-value="value"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <!-- <v-row>
            <v-col cols="12" lg="2" md="3" sm="5" class="d-flex justify-start pt-0">
              <v-subheader class="body-1">Description</v-subheader>
            </v-col>
            <v-col cols="12" lg="10" md="9" sm="7" class="pt-0">
              <v-textarea
                style="color: black"
                outlined
                v-model="productObj.description"
              />
            </v-col>
          </v-row> -->

          <!-- Description Editor -->
          <v-row>
            <v-col cols="12" class="pa-0">
              <span class="headline">
                <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
                Product Description
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="py-8">
              <vue-editor 
                id="editor"
                v-model="productObj.description"
                useCustomImageHandler
                @image-added="handleImageAdded"
              >
              </vue-editor>
            </v-col>
          </v-row>
          <!-- //////////// -->

          <!-- <v-row>
            <v-col cols="12" lg="3" md="3" sm="6">
              <v-autocomplete
                :items="categoryList"
                label="Category"
                clearable
                :rules="[rule.required]"
                v-model="productObj.category"
              />
            </v-col>
            <v-col cols="12" lg="3" md="3" sm="6">
              <v-text-field
                style="color: black"
                label="Product No"
                :rules="[rule.required]"
                v-model="productObj.product_no"
              />
            </v-col>

            <v-col cols="12" lg="6" md="6" sm="6">
              <v-text-field
                style="color: black"
                label="Product Name"
                :rules="[rule.required]"
                v-model="productObj.name"
              />
            </v-col>
          </v-row> -->

          <!-- <v-row>
            <v-col cols="12" lg="6" md="6" sm="6">
              <v-text-field
                style="color: black"
                label="Long Name"
                :rules="[rule.required]"
                v-model="productObj.long_name"
              />
            </v-col>
            <v-col cols="12" lg="3" md="3" sm="6">
              <v-text-field
                style="color: black"
                label="Short Name"
                :rules="[rule.required]"
                v-model="productObj.short_name"
              />
            </v-col>
            <v-col cols="12" lg="3" md="3" sm="6">
              <v-text-field
                style="color: black"
                label="Unit"
                :rules="[rule.required]"
                v-model="productObj.unit"
              />
            </v-col>

            <v-col cols="12" class="pt-4">
              <v-textarea
                style="color: black"
                label="Description"
                :rules="[rule.required]"
                outlined
                v-model="productObj.description"
              />
            </v-col>

            <v-col class="pt-4" cols="12">
              <v-text-field
                label="Remark"
                style="color: black"
                v-model="productObj.remark"
              />
            </v-col>
          </v-row> -->

          <v-row>
            <v-col cols="12" class="pa-0">
              <span class="headline">
                <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
                Product Main Image
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0" cols="12">
              <v-btn color="primary" class="mt-4" @click="handleUploadClick">
                Upload Images
              </v-btn>

              <span class="mt-2 d-flex align-end error--text font-weight-bold body-2">
                only JPG or PNG format and must be less than 2MB
              </span>

              <v-file-input
                ref="uploader"
                class="d-none"
                type="file"
                multiple
                accept="image/jpeg, image/png, application/pdf"
                @change="item => handleFileChange(item)"
              />
            </v-col>

            <v-col v-if="product_images.length > 0">
              <v-row>
                <v-col cols="12" class="pt-6">
                  <!-- <span class="display-1 font-weight-bold">
                    List of Images
                  </span>

                  <v-sheet
                    color="white"
                    class="pa-4"
                    elevation="4"
                    height="200"
                    width="50%"
                    style="overflow-y: scroll"
                  >
                    <span
                      class="d-flex align-center justify-center"
                      v-for="(item, key) in product_images"
                      :key="key"
                    > -->
                      <!-- <v-list-item
                          v-if="urlImg(item)"
                          link
                          :href="imgUrl + item"
                          target="_blank"
                        >
                          {{ item }}
                        </v-list-item> -->
                      <!-- <v-list-item class="ml-3" v-if="!urlImg(item)">
                        {{ item.name }}
                      </v-list-item>
                      <v-list-item>
                        <v-btn
                          v-if="urlImg(item)"
                          link
                          :href="imgUrl + item"
                          target="_blank"
                          class="mx-2 my-1"
                          fab
                          color="transparent"
                        >
                          <v-img
                            v-if="urlImg(item)"
                            :src="checkAvatarProduct(item)"
                            width="60px"
                            height="60px"
                            style="margin: 10px; border-radius: 50px"
                          />
                        </v-btn>
                      </v-list-item>

                      <v-btn
                        color="error"
                        class="ml-4"
                        outlined
                        @click="handleFileRemove(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </span>
                  </v-sheet> -->

                  <viewer :images="product_images" class="prop-image__preview">
                    <template slot-scope="scope">
                      <div class="pitem" v-for="(img, index) in scope.images" :key="index">
                        <img 
                          :src="checkAvatar(img)"
                          draggable
                          style="height: 120px; width: 120px; border-radius: 6px; margin-right: 10px; object-fit: cover"
                        />
                        
                        <v-icon class="delbtn" @click="handleFileRemove(img)">mdi-close</v-icon>
                      </div>
                    </template>
                  </viewer>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="py-4">
            <v-col
              cols="12"
              lg="4"
              md="4"
              sm="4"
              class="headline pl-0 pr-2 pt-2 pb-2"
              align-self="center"
            >
              <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
              Product Details
            </v-col>

            <v-spacer />

            <span v-if="!productObj.is_in_use" class="d-flex align-center">
              <v-btn
                color="success"
                fab
                small
                dark
                elevation="0"
                @click="addAttr"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </span>
          </v-row>

          <v-row v-for="(item, key) in attr_key" :key="key">
            <v-col cols="12" lg="2" md="2" sm="5" align-self="center" class="pt-0 pl-0">
              <v-autocomplete
                :items="listAttr"
                label="Attribute Type"
                :clearable="!productObj.is_in_use"
                :readonly="productObj.is_in_use"
                :rules="[rule.required]"
                v-model="attr_key[key].key"
                outlined
              />
            </v-col>

            <v-col
              cols="12"
              lg="10"
              md="10"
              sm="7"
              align-self="center"
              class="d-flex pr-0 pt-0"
            >
              <v-combobox
                append-icon=""
                :disabled="!attr_key[key].key"
                multiple
                :deletable-chips="!productObj.is_in_use"
                :readonly="productObj.is_in_use"
                chips
                small-chips
                label="Attribute Value"
                :rules="[rule.required, rule.ruleCombo]"
                v-model="attr_key[key].value"
                @change="handleComboBox(item)"
                outlined
              >
              </v-combobox>
              <span
                v-if="!productObj.is_in_use"
                class="d-flex pt-2 pl-4 mr-0"
              >
                <v-btn
                  color="error"
                  fab
                  x-small
                  dark
                  elevation="0"
                  @click="deleteAttr(item)"
                  v-if="attr_key.length > 1"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </span>
            </v-col>
          </v-row>
        </v-container>

        <v-row no-gutters>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="attr_items"
              :hide-default-footer="true"
              class="pt-0 pb-0"
              style="border-bottom: 1px solid rgba(0, 0, 0, 0.14)"
            >
              <template v-slot:[`item.attr`]="{ item }">
                <span>{{ showAttr(item.attr) }}</span>
              </template>

              <template v-slot:[`item.cost_price`]="{ item }">
                <v-text-field
                  label="Cost Price"
                  prepend-inner-icon="mdi-currency-usd"
                  :rules="[rule.largerOrEqualZero]"
                  type="number"
                  v-model.number="item.cost_price"
                  single-line
                  outlined
                  dense
                  class="mt-7"
                />
              </template>

              <template v-slot:[`item.selling_price`]="{ item }">
                <v-text-field
                  label="Selling Price"
                  prepend-inner-icon="mdi-currency-usd"
                  :rules="[rule.largerOrEqualZero]"
                  type="number"
                  v-model.number="item.selling_price"
                  single-line
                  outlined
                  dense
                  class="mt-7"
                />
              </template>

              <template v-slot:[`item.image`]="{ item }">
                <v-img
                  class="ml-8"
                  :src="checkAvatar(item.image)"
                  @click="handleImg(item)"
                  width="70px"
                  height="70px"
                  style="margin: 10px; border-radius: 4px; cursor: pointer"
                />
              </template>

              <template v-slot:[`item.is_active`]="{ item }">
                <v-chip :color="item.is_active ? 'success' : 'error'" dark>
                  {{ item.is_active ? "Active" : "Inactive" }}
                </v-chip>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="handleDeactivateDialog(item)"
                      :color="item.is_active ? 'error' : 'success'"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{
                        productObj.is_in_use
                          ? item.is_active
                            ? "mdi-sync-off"
                            : "mdi-sync"
                          : "mdi-trash-can"
                      }}
                    </v-icon>
                  </template>
                  <span>{{
                    productObj.is_in_use
                      ? item.is_active
                        ? "Disactivate"
                        : "Reactivate"
                      : "Delete"
                  }}</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions class="py-4 pt-8 pr-0">
        <v-spacer />

        <v-btn color="success" @click="handleSave">
          save
        </v-btn>

        <v-btn
          color="error"
          outlined
          @click="$router.push('/product')"
        >
          cancel
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
      </v-card-actions>

      <ImageCRUD
        :dialog.sync="imgDialog"
        @handleImageData="handleImage"
        :productItem="itemObj"
      />

      <DeleteDialog
        :dialogDelete.sync="deleteDialog"
        :deleteObj="itemObj"
        :message="deleteMsg"
        @handleDelete="handleDeactivateConfirm"
      />
    </base-material-card>
  </v-container>
</template>

<script>
//FIXME::edit function of product item attr
//BUG deactive attr type bug
//TODO fix attr overwrite
import {
  upsertProduct,
  listProductAttr,
  getProduct,
  getProductItemsByProduct,
  upsertProductItem,
  deleteProductItem,
  deleteProductItems,
  deactivateProductItem
} from "@/api/product";
import { listCategory } from "@/api/category";
import { meta } from "@/utils/enum";
import { FilterChild, removeFile, urlImg, getTreePath } from "@/utils/generalFunc";
import { uploadFiles, deleteFile, lazyFileUpload } from "@/api/generalAPI";
import serverConfig from "@/utils/serverConfig";
import { VueEditor } from "vue2-editor";

// import 'viewerjs/dist/viewer.css'
// import VueViewer from 'v-viewer'
// import Vue from 'vue'
// Vue.use(VueViewer)
// VueViewer.setDefaults({
//   movable: false
// })

const newObj = () => {
  return {
    attr_type: [],
    attr_value: [],
    product_no: "",
    name: "",
    description: "",
    category: "",
    // unit: "",
    image: [],
    remark: "",
    is_active: true,
    is_in_use: false
    // product_items: []
  };
};
const productItemObj = () => {
  return {
    product_id: "",
    selling_price: 0,
    cost_price: 0,
    attr: {},
    // attr_type: [],
    // attr_value: [],
    image: [],
    is_active: true
  };
};


export default {
  name: "productCRUD",
  components: {
    PageNavigation: () => import("@/components/pageNavigation"),
    DeleteDialog: () => import("@/components/deleteDialog"),
    ImageCRUD: () => import("@/components/imageCRUD"),
    VueEditor
  },
  data() {
    return {
      deleteMsg: "",
      imgUrl: serverConfig.file_url,
      blankImg: serverConfig.blank_product_img,
      valid: false,
      productObj: {},
      file: [],
      newEditAttr: false,
      is_change: false,
      imgDialog: false,
      deleteDialog: false,
      itemObj: productItemObj(),
      rule: {
        required: v => !!v || "This field is required.",
        ruleCombo: v => !!v.length != 0 || "This field is required.",
        largerOrEqualZero: v =>
          (!isNaN(parseFloat(v)) && v >= 0) ||
          "Price must be greater or equal 0."
      },
      attr_items: [],
      attr_key: [],
      listAttr: [],
      categoryList: [],
      temp_image_remove: [],
      product_images: [],
      user_remove_images: [],
      headers: [
        {
          text: "Attributes",
          value: "attr",
          sortable: false,
          align: "start"
        },
        {
          text: "Cost Price",
          value: "cost_price",
          sortable: false,
          align: "start"
        },
        {
          text: "Selling Price",
          value: "selling_price",
          sortable: false,
          align: "start"
        },
        {
          text: "Image",
          value: "image",
          sortable: false,
          width: "150",
          align: "center"
        },
        {
          text: "Status",
          value: "is_active",
          width: "120",
          sortable: false,
          align: "center"
        },
        {
          text: "Actions",
          value: "actions",
          width: "120",
          sortable: false,
          align: "center"
        }
      ]
    };
  },
  methods: {
    addAttr() {
      this.attr_key.push({});
      //this.attr_items.attr =  this.productObj.attr_type
      // console.log("attr key: ", this.attr_key);
      // console.log("attr fr product: ", this.productObj.attr_type);
      //   if(this.attr_key > this.productObj.attr_type){

      //  }
    },
    getDatas() {
      listProductAttr()
        .then(res => {
          if (res.meta == meta.OK) {
            this.listAttr = res.datas.map(p => p.name);
          } else {
            console.log("Err", res);
            this.$toast.error("Error - " + res.meta);
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast.error("Error");
        });

      listCategory()
        .then(res => {
          if (res.meta == meta.OK) {
            this.categoryList = FilterChild("", res.datas, []);
          } else {
            console.log("Err", res);
            this.$toast.error("Error - " + res.meta);
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast.error("Error");
        });
    },
    handleImg(obj) {
      this.imgDialog = true;
      this.itemObj = obj;
    },
    handleImage(file, tempFile) {
      this.imgDialog = false;
      this.temp_image_remove.push(...tempFile);
      this.itemObj.image = file;
    },
    checkAvatar(item) {
      // return typeof item === "string" || item == undefined
      //   ? item == "" || item == undefined
      //     ? this.blankImg
      //     : this.imgUrl + item
      //   : item.length > 0
      //     ? typeof item[0] === "string" 
      //       ? this.imgUrl + item[0]
      //       : typeof item[0] === "object" 
      //         ? URL.createObjectURL(item[0])
      //         : this.blankImg
      //     : this.blankImg

      var image_url = this.blankImg;
      
      if (Array.isArray(item)) {
        if (item[0] != "" && item[0] != undefined) {
          if (typeof item[0] === "string") {
            image_url = this.imgUrl + item[0];
          }
          else if (typeof item[0] === "object") {
            image_url = URL.createObjectURL(item[0]);
          }
        }
      }
      else if (typeof item === "string" || typeof item === "object" || item == undefined) {
        if (item != "" && item != undefined) {
          if (typeof item === "string") {
            image_url = this.imgUrl + item;
          }
          else if (typeof item === "object") {
            image_url = URL.createObjectURL(item);
          }
        }
      } 
      
      return image_url;
      

      // return typeof item === "string" || item == undefined
      //   ? item == "" || item == undefined
      //     ? this.blankImg
      //     : this.imgUrl + item
      //   : typeof item === "object" 
      //     ? URL.createObjectURL(item)
      //     : item.length > 0
      //     ? typeof item[0] === "string" 
      //       ? this.imgUrl + item[0]
      //       : typeof item[0] === "object" 
      //         ? URL.createObjectURL(item[0])
      //         : this.blankImg
      //     : this.blankImg

      

      // return typeof item === "string" || item == undefined
      //   ? item == "" || item == undefined
      //     ? console.log("null or undefined, blank")
      //     : console.log("string, not blank")
      //   : typeof item === "object" 
      //     ? console.log("object, not blank")
      //     : item.length > 0
      //       ? typeof item[0] === "string" 
      //         ? console.log("arr string")
      //         : typeof item[0] === "object" 
      //           ? console.log("arr object, not blank")
      //           : console.log("arr object, blank")
      //       : console.log("blank")
    },
    deleteAttr(item) {
      this.attr_key.splice(this.attr_key.indexOf(item), 1);
    },
    urlImg,
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click();
    },
    handleFileChange(item) {
      if (this.checkFileSize(item).length > 0) {
        this.$toast("Cannot Upload File that bigger than 5MB");
        return true;
      }

      if (this.checkFileType(item)) {
        this.$toast("Wrong File Type, Upload image JPG or PNG format only");
        return true;
      }

      if (item.length > 0) {
        item.forEach(p => this.product_images.push(p));
      }
    },
    handleFileRemove(item) {
      if (typeof item == typeof "") {
        // Add Remove Files to temporary arr, then remove when user click save
        this.user_remove_images.push(item);
      }

      this.product_images.splice(this.product_images.indexOf(item), 1);
    },
    async handleSave() {
      if (this.$refs.form.validate()) {
        this.productObj.attr_type = this.attr_key.map(p => p.key);
        this.productObj.attr_value = this.attr_key.map(p => p.value);
        this.productObj.image = this.product_images.filter(
          p => typeof p == typeof ""
        );

        //Remove product_item image from the templist
        if (this.temp_image_remove.length > 0) {
          await this.temp_image_remove.forEach(async p => {
            await deleteFile(p).catch(err => {
              console.log("Remove File Error", err);
            });
          });
        }

        // Remove user delete image list
        if (this.user_remove_images.length > 0) {
          await this.user_remove_images.forEach(async p => {
            await deleteFile(p).catch(err => {
              console.log("Remove File Error", err);
            });
          });
        }

        // Add new upload image
        if (this.product_images.length > 0) {
          const files = this.product_images.filter(p => p instanceof File);

          const fileForm = new FormData();

          files.forEach(p => {
            fileForm.append("file", p);
          });

          if (files.length > 0)
            await uploadFiles(fileForm)
              .then(res => {
                res.files.forEach(p => this.productObj.image.push(p.md5));
              })
              .catch(console.log);
        }

        for (let e of this.attr_items) {
          for (let i in e.image) {
            if (e.image[i] instanceof File) {
              await lazyFileUpload(e.image[i])
                .then(res => {
                  if (res.meta == meta.OK) {
                    e.image[i] = res.file.md5;
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        }

        // this.productObj.description = JSON.stringify(this.productObj.description);

        // console.log(this.is_change, this.productObj, this.attr_items);

        await upsertProduct({
          product: this.productObj,
          product_items: this.attr_items,
          is_change: this.is_change
        })
          .then(res => {
            if (res.meta == meta.OK) {
              this.$toast.success(res.message);
              //this.$emit("update:dialog", false);
              this.$router.push("/product");
            } else {
              console.log("Upsert Inside Err", res);
              this.$toast.error("Error - " + res.meta);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    refreshProductItems() {
      getProductItemsByProduct(this.$route.params.id)
        .then(res => {
          if (res.meta == meta.OK) {
            this.attr_items = res.data;
            // console.log(this.attr_items);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showAttr(value) {
      let str = "";
      Object.keys(value).forEach(p => (str += `${p}: ${value[p]} `));
      return str;
    },
    handleDeactivateDialog(item) {
      this.deleteDialog = true;
      this.deleteMsg = this.productObj.is_in_use
        ? "Are you sure you want to " +
          (item.is_active ? "de" : "re") +
          "activate this product?"
        : "Are you sure you want to delete this product?";
      this.itemObj = item;
    },
    handleDeactivateConfirm(item) {
      this.deleteDialog = false;
      if (this.productObj.is_in_use) {
        deactivateProductItem(item._id)
          .then(res => {
            if (res.meta == meta.OK) {
              this.refreshProductItems();
            } else {
              console.log(res);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        if (item._id) {
          deleteProductItem(item._id)
            .then(res => {
              if (res.meta == meta.OK) {
                this.refreshProductItems();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.attr_items.splice(this.attr_items.indexOf(item), 1);
          // this.deleteAttr(item)
        }
      }
    },
    // checkAvatarProduct(item) {
    //   return typeof item === "string" || item == undefined
    //     ? this.item == "" || item == undefined
    //       ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
    //       : this.imgUrl + item
    //     : // : item.length > 0
    //       // ? this.imgUrl + item[0]
    //       "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
    // },
    handleComboBox() {
      this.is_change = true;
      // console.log("key: ", this.attr_key);
      const t = getTreePath(0, this.attr_key);
      // console.log("handleComboBox: ", t);
      this.attr_items = t.map(p => {
        return {
          // _id: "",
          attr: p,
          cost_price: 0,
          selling_price: 0,
          image: [],
          is_active: true,
          product_id: this.productObj._id
        };
      });
    },
    getImgPreviewUrl(img) {
      return URL.createObjectURL(img)
    },
    // handle description editor image
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      if (file instanceof File) {
        await lazyFileUpload(file)
          .then(res => {
            if (res.meta == meta.OK) {
              Editor.insertEmbed(cursorLocation, "image", this.imgUrl + res.file.md5);
              resetUploader();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    this.is_change = false;
    this.getDatas();

    if (this.$route.params.id == 0) {
      this.attr_key.push({});
      this.productObj = newObj();
      this.resetForm();
    } else {
      getProduct(this.$route.params.id)
        .then(res => {
          if (res.meta == meta.OK) {
            // console.log(res.data);
            this.refreshProductItems();
            this.productObj = res.data;

            this.productObj.category = this.productObj.category._id;

            if (this.productObj.image.length) {
              this.productObj.image.forEach(p => this.product_images.push(p));
              // console.log("productImage: ", this.product_images)
            }
            const key = this.productObj.attr_type;
            const value = this.productObj.attr_value;
            if (key.length > 0) {
              this.attr_key = key.map((p, k) => ({ key: p, value: value[k] }));
            }

            // this.attr_items = this.productObj.product_items;

            console.log("productObj: ", this.productObj);
            //this.file = [...this.myObj.attach];
          } else if (res.meta == meta.NOTEXIST) {
            this.$router.push({ name: "NotFound" });
          } else {
            this.$toast.error(res.message);
            console.log(res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
  .prop-image__preview{
    .pitem{
      display: inline-block;
      position: relative;
      margin-right: 25px;
      .delbtn{
        cursor: pointer;
        position: absolute;
        top: -10px !important;
        right: 0px !important;
        font-size: 15px;
        font-weight: bold;
        background-color: red;
        color: white;
        padding: 5px;
        border-radius: 50%;
      }
    }
  }
</style>
<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          elevation="2"
          @click="$router.push({ name: 'order' })"
          class="mb-8"
        >
          <v-icon left>mdi-keyboard-return</v-icon>
          Order
        </v-btn>
      </v-col>
    </v-row>

    <PageNavigation />

    <base-material-card
      title="Order Detail"
      icon="mdi-shopping-outline"
      class="elevation-4 px-8 py-4 mt-14"
    >
      <v-form class="pt-8" v-model="valid" ref="form" lazy-validation>
        <v-row>
          <v-col cols="12" class="pa-0 mb-4">
            <span class="headline">
              <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
              Order Information
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
                  v-model="myObj.order_date"
                  label="Date"
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rule.required]"
                  outlined
                  dense
                  readonly
                />
              </template>

              <v-date-picker
                v-model="myObj.order_date"
                @input="date1 = false"
                class="ma-0 pa-0"
              />
            </v-menu>
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
            <v-autocomplete
              v-model="myObj.customer"
              label="Customer"
              :rules="[rule.required]"
              :items="customerList"
              :item-text="item => item.firstname + ' ' + item.lastname + ' (' + formatPhoneNumber(item.phone_number) + ')'"
              :item-value="item => item._id"
              outlined
              dense
            />
          </v-col>

          <!-- <v-col cols="12" lg="6" md="6" sm="6" class="py-0" v-if="addAction">
            <v-autocomplete
              v-model="myObj.payment_method"
              label="Payment Method"
              :rules="[rule.required]"
              :items="paymentMethodList"
              outlined
              dense
            />
          </v-col> -->

          <v-col cols="12" class="py-0"> <!--  v-else -->
            <v-text-field
              v-model="myObj.delivery_address"
              label="Delivery Address"
              :rules="[rule.required]"
              outlined
              dense
            />
          </v-col>

          <!-- <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
            <v-autocomplete
              v-model="myObj.payment_method"
              label="Payment Method"
              :rules="[rule.required]"
              :items="paymentMethodList"
              outlined
              dense
            />
          </v-col> -->

          <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
            <v-text-field
              v-model.number="myObj.delivery_fee"
              label="Delivery Fee"
              prepend-inner-icon="mdi-currency-usd"
              type="number"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
            <v-text-field
              v-model.number="myObj.tax"
              label="Tax"
              prepend-inner-icon="mdi-percent-outline"
              type="number"
              outlined
              dense
              @change="setTotal"
            />
          </v-col>


          <v-col cols="12" class="py-0">
            <v-text-field
              v-model="myObj.remark"
              label="Remark"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <!-- Attachments -->
        <!-- <v-row>
          <v-col cols="12" class="pa-0">
            <span class="headline">
              <v-icon left class="pb-1">mdi-chevron-right-box</v-icon>
              Attachments
            </span>
          </v-col>
        </v-row> -->

        <!-- <v-row>
          <v-col class="py-0" cols="12">
            <v-btn color="primary" class="mt-4" @click="handleUploadClick">
              Upload Files
            </v-btn>

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
        </v-row> -->

        <v-row>
          <v-col cols="12" class="pa-0 my-4">
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
              :headers="headers2"
              item-key="_id"
              :items="selectedProducts"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="handleDeleteProduct(item)"
                    >
                      mdi-trash-can
                    </v-icon>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.image`]="{ item }">
                <v-img
                  :lazy-src="blankImg"
                  :src="checkAvatar(item)"
                  width="70px"
                  height="70px"
                  style="margin: 10px; border-radius: 4px"
                />
              </template>

              <template v-slot:[`item.selling_price`]="{ item }">
                {{ item.selling_price | price }}
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
                  @change="setTotal"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-row>
          <v-spacer />

          <v-col cols="12" align-self="center">
            <v-row no-gutters class="font-weight-bold" style="font-size: 17px">
              <v-col cols="6" lg="11" md="11" sm="10" class="text-md-right">
                Total Quantity:
              </v-col>

              <v-col cols="6" lg="1" md="1" sm="2" class="text-right">
                {{ totalQty }}
              </v-col>

              <v-col cols="6" lg="11" md="11" sm="10" class="mt-2 text-md-right">
                Subtotal :
              </v-col>

              <v-col cols="6" lg="1" md="1" sm="2" class="mt-2 text-right">
                {{ subtotal | price }}
              </v-col>

              <v-col cols="6" lg="11" md="11" sm="10" class="mt-2 text-md-right">
                Tax:
              </v-col>

              <v-col cols="6" lg="1" md="1" sm="2" class="mt-2 text-right">
                {{ taxAmount | price }}
              </v-col>

              <v-col cols="6" lg="11" md="11" sm="10" class="mt-2 text-md-right" style="color: black; font-size: 20px">
                Total:
              </v-col>

              <v-col cols="6" lg="1" md="1" sm="2" class="mt-2 text-right" style="color: black; font-size: 20px">
                {{ totalAmount | price }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions class="py-4 pt-10 pr-0">
        <v-spacer />

        <v-btn color="success" @click="validate">
          save
        </v-btn>

        <v-btn
          color="error"
          outlined
          @click="$router.push('/order')"
        >
          cancel
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
      </v-card-actions>

    </base-material-card>

    <SelectProduct
      :dialogSelectProduct.sync="dialogSelectProduct"
      @getSelectProduct="handleSelectProduct"
      :selectedProducts="selectedProducts"
    />

    <DeleteDialog
      :dialogDelete.sync="dialogDelete"
      :deleteObj="deleteProductObj"
      @handleDelete="handleDeleteConfirm"
      objKey="product"
    />

  </v-container>
</template>

<script>
import serverConfig from "@/utils/serverConfig";
import { removeFile, urlImg, getProductAttribute } from "@/utils/generalFunc";
import { listInventory, upsertInventory, getInventory } from "@/api/inventory";
import { listOrder, upsertOrder, getOrder, deleteOrder, updateStatus } from "@/api/order"
import { listCustomer } from "@/api/generalAPI";
import { uploadFiles, deleteFile } from "@/api/generalAPI";
import { meta, status_type } from "@/utils/enum";

const newObj = () => {
  return {
    order_no: '',
    order_date: '',
    customer: '',
    products: [],
    payment_method: 'Cash On Delivery',
    delivery_address: '',
    delivery_fee: 0,
    tax: 0,
    status: '',
    // attachments: '',
    remark: ''
  };
};

export default {
  name: "OrderCRUD",
  components: {
    PageNavigation: () => import("@/components/pageNavigation"),
    DeleteDialog: () => import("@/components/deleteDialog"),
    SelectProduct: () => import("@/components/selectMultiProducts"),
  },
  data() {
    return {
      addAction: false,
      myObj: newObj(),
      customerList: [],
      paymentMethodList: [
        {
          text: 'Cash On Delivery',
          value: 'Cash On Delivery'
        },
        {
          text: 'Online Payment',
          value: 'Online Payment'
        }
      ],
      totalQty: 0,
      subtotal: 0,
      totalAmount: 0,
      taxAmount: 0,
      selectedProducts: [],
      file: [],
      removefiles: [],
      imgUrl: serverConfig.file_url,
      blankImg: serverConfig.blank_product_img,
      dialogDelete: false,
      dialogSelectProduct: false,
      deleteProductObj: {},
      deleteIndex: -1,
      date1: false,
      valid: false,
      rule: {
        required: (v) => !!v || "this field is required",
        numberRule: (v) => v >= 0 || "this field cannot less than 0",
      },
      headers1: [
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
          text: "Unit Price",
          value: "selling_price",
          sortable: false,
          width: "120"
        },
        {
          text: "Quantity",
          value: "qty",
          sortable: false,
          width: "300px"
        }
      ],
      headers2: [
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
          text: "Unit Price",
          value: "selling_price",
          sortable: false,
          width: "120"
        },
        {
          text: "Quantity",
          value: "qty",
          sortable: false,
          width: "300px"
        },
        {
          text: "Action",
          value: 'actions',
          sortable: false,
          width: "100",
          align: "center"
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
          this.myObj.products = [];

          for (var p of this.selectedProducts) {
            this.myObj.products.push({ _id: p._id, order_qty: p.qty });
          }
        
          this.handleSave(this.myObj, this.file);
          this.file = [];
        }
        else {
          this.$toast.info("Please Choose Product");
        }
      } 
      else {
        this.$toast.info("Please fill all the require field");
      }
    },
    async handleSave(obj, file) {
      // Delete File
      // if (this.removefiles.length > 0) {
      //   for (var p of this.removefiles) {
      //     await deleteFile(p).then(res => {
      //         if (res.meta == 2001) {
      //           obj.attachments.splice(obj.attachments.indexOf(p), 1);
      //         }
      //       })
      //       .catch(err => {
      //         console.log("Remove File Error", err);
      //       });
      //   }
      // }

      // Upload File
      // if (file.length > 0) {
      //   const files = file.filter((p) => typeof p == typeof {});
      //   obj.attachments = file.filter((p) => typeof p == typeof "");
      //   const fileForm = new FormData();

      //   if (files.length > 1) {
      //     files.forEach((p) => fileForm.append("file", p));
      //   } else {
      //     fileForm.append("file", files[0]);
      //   }

      //   await uploadFiles(fileForm)
      //     .then((res) => {
      //       res.files.forEach((p) => obj.attachments.push(p.md5));
      //     })
      //     .catch(console.log);
      // }

      console.log("upsertData: ", obj)
      await upsertOrder(obj)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.$toast.success(res.message);
            this.$router.push("/order");
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
    getUserData() {
      listCustomer().then(res => {
        if(res.meta == meta.OK) {
          this.customerList = res.datas;
        }
      })
      .catch((err) => {
        console.log(err);
        this.$toast.error(`Error - ${err.meta}`);
      });
    },
    setTotal() {
      this.totalQty = 0;
      this.totalAmount = 0;
      this.subtotal = 0;

      this.selectedProducts.forEach((p) => {
        // !p.qty ? 0 : p.qty;
        // !p.selling_price ? 0 : parseFloat(p.selling_price).toFixed(2);

        this.totalQty += p.qty;
        this.subtotal += p.selling_price * p.qty;
      });

      this.taxAmount = (this.subtotal * this.myObj.tax) / 100;

      this.totalAmount = this.subtotal + this.taxAmount;


      //Calculate total Amount with tax
      // let tax = this.myObj.tax / 100;
      // let total = this.totalAmount;
      // this.totalAmount_tax = parseFloat((total * tax) + total).toFixed(2);

      // this.subtotal = parseFloat(this.subtotal).toFixed(2);
      // this.totalDiscount = parseFloat(this.totalDiscount).toFixed(2);
      // this.totalAmount = parseFloat(this.totalAmount).toFixed(2);
      // this.taxAmount = parseFloat(this.taxAmount).toFixed(2);
    },
    handleDeleteProduct(obj) {
      this.deleteProductObj = obj;
      this.deleteIndex = this.selectedProducts.indexOf(obj);
      this.dialogDelete = true;
    },
    handleDeleteConfirm() {
      if (this.deleteIndex > -1) {
        this.selectedProducts.splice(this.deleteIndex, 1);
        this.deleteIndex = -1;
      }
      this.dialogDelete = false;
      this.setTotal();
    },
  },
  mounted() {
    this.getUserData();
    this.file = [];

    if (this.$route.params.id == 0) {
      this.addAction = true;
      this.myObj = newObj();
      this.myObj.order_date = this.moment().format("YYYY-MM-DD, hh:mm A");
    } 
    else {
      getOrder(this.$route.params.id)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.myObj = res.data;

            this.myObj.order_date != null
              ? (this.myObj.order_date = this.moment(this.myObj.order_date).format("YYYY-MM-DD, hh:mm A"))
              : "";

            // this.myObj.attachments.length > 0
            //   ? this.myObj.attachments.forEach((p) => this.file.push(p))
            //   : this.file;

            console.log("data: ", this.myObj);

            for (var p of this.myObj.products) {
              this.selectedProducts.push(
                {
                  _id: p._id,
                  image: p.product_info.image,
                  description: p.product_info.product_id.description,
                  selling_price: p.product_info.selling_price,
                  category: p.product_info.product_id.category.name,
                  name: p.product_info.product_id.name,
                  product_no: p.product_info.product_id.product_no,
                  attr: getProductAttribute(p.product_info.attr),
                  qty: p.order_qty,
                }
              )
            }

            this.setTotal();
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
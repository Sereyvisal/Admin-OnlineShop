<template>
  <v-container fluid>
    <PageNavigation />
    <v-row class="pt-10 my-0">
      <v-col cols="12" class="py-0 my-0">
        <v-card>
          <v-card-title
            class="white--text font-weight-bold py-4 pl-8"
            style="background: #4FC3F7"
          >
            <span style="color: white">Category</span>
            <v-spacer />
            <v-btn
              color="white"
              outlined
              @click="dialogCategory = true"
            >
              <!-- @click="addCategory(newObj(), $event)" -->
              <v-icon left> mdi-plus </v-icon>
              add
            </v-btn>
          </v-card-title>

          <v-row class="pa-4" justify="space-between">
            <v-col cols="12" lg="6" md="6" sm="6">
              <v-treeview
                :active.sync="active"
                :items="categorylist"
                :load-children="fetchCategory"
                item-key="_id"
                item-children="items"
                activatable
                hoverable
                color="primary"
                transition
                return-object
              >
                <template v-slot:append="{ item }">
                  <span>
                    <v-icon
                      @click="handleAddChild(item)"
                      color="success"
                      left
                    >
                      mdi-plus
                    </v-icon>
                  </span>
                  <span>
                    <v-icon @click="handleEditCategory(item)">mdi-pencil</v-icon>
                  </span>
                  <span>
                    <v-icon
                      @click="handleDeleteCategory(item, $event)"
                      color="error"
                      right
                      >mdi-trash-can-outline
                    </v-icon>
                  </span>
                </template>

                <!-- <template v-slot:prepend="{ item }">
                  <v-icon v-if="!item.children">
                    mdi-office-building-outline
                  </v-icon>
                </template> -->
              </v-treeview>
            </v-col>

            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="6"
              class="d-flex align-center justify-center text-center"
            >
              <v-card
                v-if="active[0]"
                :key="active[0]._id"
                flat
                :width="$vuetify.breakpoint.lgAndUp ? '350' : ''"
                elevation="2"
              >
                <v-card-text>
                  <v-avatar size="300" rounded>
                      <!-- :lazy-src="loading" -->
                    <v-img
                      :src="
                        active[0].avatar
                          ? imgUrl +
                            active[0].avatar
                          : blankImgUrl
                      "
                    />
                  </v-avatar>

                  <!-- <div class="mt-4 display-2 font-weight-bold">
                    {{
                      selected.category_head.personal_detail.lastname +
                      " " +
                      selected.category_head.personal_detail.firstname
                    }}
                  </div>
                  <div class="mt-2 grey--text">Category Head</div>
                  <v-divider
                    class="my-4"
                    style="border: 0.5px solid lightgrey"
                  />
                  <div class="mt-2 subtitle-2">
                    {{ selected.category_head.personal_detail.phonenumber }}
                  </div>
                  <div class="mt-2 subtitle-2">
                    {{ selected.category_head.personal_detail.email }}
                  </div> -->
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- <CategoryDialog
      :category="categoryObj"
      :employees="employees"
      :dialog.sync="dialog"
      @handleData="handleCategory"
    /> -->

    <CategoryCRUD :dialog.sync="dialogCategory" />

    <CategoryCRUD2 :dialog.sync="dialogCategory2" :obj="this.categoryObj" />

    <DeleteDialog
      :dialogDelete.sync="delDialog"
      :deleteObj="this.categoryObj"
      @handleDelete="delCategory"
    />
  </v-container>
</template>

<script>
import {
  listCategory,
  categoryUpsert,
  deleteCategory,
} from "@/api/category";
import serverConfig from "@/utils/serverConfig";
import { meta } from "@/utils/enum";
import { deleteFile } from '@/api/generalAPI'

export default {
  components: {
    PageNavigation: () => import("@/components/pageNavigation"),
    DeleteDialog: () => import("@/components/deleteDialog"),
    CategoryCRUD: () => import("@/components/category/categoryCRUD"),
    CategoryCRUD2: () => import("@/components/category/categoryCRUD2"),
  },
  data() {
    return {
      dialog: false,
      delDialog: false,
      dialogCategory: false,
      dialogCategory2: false,
      categorylist: [],
      categoryObj: this.newObj(),
      active: [],
      avatar: null,
      imgUrl: serverConfig.file_url,
      blankImgUrl: serverConfig.blank_profile_img,
      loading: serverConfig.loading_gif,
    };
  },

  methods: {
    newObj() {
      return {
        name: '',
        avatar: '',
        recommend: false,
        parent: '',
      }
    },
    addCategory(item, e) {
      e.stopPropagation();
      this.dialog = true;
      this.categoryObj = this.newObj();
      this.categoryObj.category_parent = item._id;
    },
    editCategory(item, e) {
      e.stopPropagation();
      this.categoryObj = item;
      this.dialog = true;
      if (this.categoryObj.category_head)
        this.categoryObj.category_head = this.categoryObj.category_head._id;
    },

    handleCategory(item) {
      if (item.category_parent == "") {
        item.category_parent = null;
      }
      if (item.category_head == "") {
        item.category_head = null;
      }
      categoryUpsert(item)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.getData();
            this.$toast.success(res.message);
          } else {
            this.$toast.error(`Error - ${res.meta}`);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error("Error");
        });
    },

    handleDeleteCategory(item, e) {
      e.stopPropagation();
      this.delDialog = true;
      this.categoryObj = item;
    },
    async deleteAllChildrenCategorys(delDept) {
      await deleteCategory(delDept._id)
        .then((res) => {
          if (res.meta == 2001) {
            this.$toast(res.message);
            this.getData();
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async delCategory(item) {
      this.delDialog = false;

      await deleteFile(item.avatar)
        .then(res => {
          console.log('deleted file')
        })
        .catch(console.log)

      await deleteCategory(item._id)
      .then((res) => {
        if (res.meta == 2001) {
          this.$toast(res.message);
          this.getData();
        } else {
          this.$toast(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });

      // await this.deleteAllChildrenCategorys(item);
      // this.getData();
    },
    getData() {
      listCategory()
        .then((data) => {
          this.categorylist = data.datas;
          this.active[0] = this.categorylist[0]
        })
        .catch((err) => console.log(err));
    },
    handleEditCategory(obj) {
      this.categoryObj = obj;
      this.dialogCategory2 = true;
    },
    handleAddChild(obj) {
      this.categoryObj = this.newObj();
      this.categoryObj.parent = obj._id;
      console.log("categoryObj", this.categoryObj)
      this.dialogCategory2 = true;
    }
  },
  computed: {
    // selected() {
    //   console.log("active: ", this.active)
    //   // if (!this.active.length) return false;
    //   return this.active[0];
    //   // return findSelected(this.categorylist, this.active[0]);
    // },
    fetchCategory() {
      return this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.getData();
      }
    },
    dialogCategory() {
      if (!this.dialogCategory) {
        this.getData();
      }
    },
    dialogCategory2() {
      if (!this.dialogCategory2) {
        this.getData();
      }
    }
  },
};
</script>

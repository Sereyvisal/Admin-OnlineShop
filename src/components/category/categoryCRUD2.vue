<template>
  <v-dialog v-model="dialog" persistent width="600" style="overflow-x: hidden">
    <v-card>
      <!-- <v-card-text class="pa-0 pt-4 pr-4 d-flex justify-end">
        <v-icon @click="$emit('update:dialog', false)" color="red" size="22px"> mdi-close-thick </v-icon>
      </v-card-text> -->
      <v-card-title class="font-weight-bold justify-center pt-6 pb-6" style="color: black; font-size: 18px">Category Detail</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" class="d-flex justify-center">
                <v-avatar rounded size="150">
                  <v-img :lazy-src="loading" :src="avatar"></v-img>
                </v-avatar>
              </v-col>

              <!-- upload photo -->
              <v-col cols="12" class="d-flex justify-center">
                <v-btn color="primary" @click="handleUploadClick"> Upload new photo </v-btn>

                <v-file-input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  @change="item => handleFileChange(item)"
                />
              </v-col>

              <v-col cols="12">
                <v-form v-model="valid" ref="form">
                  <v-text-field label="Name" v-model="categoryObj.name" :rules="rule" />

                  <v-autocomplete
                    label="Parent"
                    v-model="categoryObj.parent"
                    :items="categoryListClone"
                    :item-text="item => item.text"
                    :item-value="item => item.value"
                  />

                  <v-checkbox
                    v-model="categoryObj.recommend"
                    label="Recommend"
                    :disabled="!canRecommend && !categoryObj.recommend"
                    @change="handleChangeRecommend"
                  />

                  <span style="color: red" v-if="!canRecommend && !categoryObj.recommend">*Recommended category limit only 3</span>

                  <span class="d-flex justify-end pt-5">
                    <!-- <v-btn @click="handleClearForm" color="red" outlined>
                      CLEAR
                    </v-btn>
                    <v-btn color="green" class="ml-6" outlined @click="handleAdd">
                      SAVE
                    </v-btn> -->
                    <v-btn color="success" class="ml-6 mr-3" style="color: white" @click="handleAdd">save</v-btn>

                    <v-btn color="error" outlined @click="handleClearForm">cancel</v-btn>
                  </span>
                </v-form>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pb-6 pl-6">
        <!-- <v-btn color="green" @click="$emit('update:dialog', false)">
          SAVE
        </v-btn> -->
        <!-- <v-btn @click="$emit('update:dialog', false)" color="red" outlined>
          CLOSE
        </v-btn> -->
        <v-spacer />
      </v-card-actions>
    </v-card>

    <DeleteDialog :dialogDelete.sync="dialogDelete" :deleteObj="categoryObj" @handleDelete="handleDeleteConfirm" />
  </v-dialog>
</template>

<script>
import serverConfig from '@/utils/serverConfig'
import { meta } from '@/utils/enum'
import { uploadFile, deleteFile } from '@/api/generalAPI'
import { FilterChild, deleteNestedChild, urlImg } from '@/utils/generalFunc'
import { listCategory, deleteCategory, upsertCategory } from '@/api/category'

const newObj = () => {
  return {
    name: '',
    avatar: '',
    recommend: false,
    parent: '',
  }
}

export default {
  name: 'CategoryDialog',
  props: { dialog: Boolean, obj: Object },
  components: {
    DeleteDialog: () => import('@/components/deleteDialog'),
  },
  data() {
    return {
      dialogDelete: false,
      valid: false,
      rule: [v => !!v || 'This field is required.'],
      categoryObj: newObj(),
      categoryList: [],
      categoryListClone: [],
      active: [],
      imgUrl: serverConfig.file_url,
      blankImg: serverConfig.blank_product_img,
      file: '',
      avatar: serverConfig.blank_product_img,
      fileUrl: serverConfig.file_url,
      loading: serverConfig.loading_gif,
      canRecommend: true,
      count_recommend: 0,
    }
  },
  methods: {
    urlImg,
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click()
    },
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click()
    },
    handleFileChange(item) {
      if (this.checkFileSize(item).length > 0) {
        this.$toast.error('Cannot upload file bigger than 5MB')
        return true
      }

      if (this.checkFileType(item)) {
        this.$toast.error('Wrong File Type, Upload image JPG or PNG format only')
        return true
      }

      // if (item.length > 0) {
      //   item.forEach((p) => this.file.push(p));
      // } else {
      //   this.file = item[0];
      // }

      if (item) {
        this.file = item
        this.avatar = URL.createObjectURL(this.file)
      }
    },
    handleClearForm() {
      this.getData()
      this.resetForm()
      this.categoryObj = newObj()
      this.avatar = this.blankImg
      this.file = ''
      this.active = []
      this.$emit("update:dialog", false);
    },
    handleDeleteDialog(item) {
      this.dialogDelete = true
      this.categoryObj = item
    },

    async handleDeleteConfirm(item) {
      this.dialogDelete = false
      await deleteNestedChild(item, deleteCategory)
      this.resetForm()
      this.categoryObj = newObj()
      this.getData()
    },
    async handleAdd() {
      console.log('in', this.file, this.categoryObj)
      if (this.$refs.form.validate()) {
        this.categoryObj.parent == '' ? (this.categoryObj.parent = null) : this.categoryObj.parent

        // Upload image
        if (this.file != undefined && this.file != '') {
          const fileImageForm = new FormData()
          fileImageForm.append('file', this.file)

          await uploadFile(fileImageForm)
            .then(res => {
              var oldImage = this.categoryObj.avatar

              this.categoryObj.avatar = res.file.md5

              //delete old image
              console.log('oldImage: ', oldImage)
              if (oldImage != null && oldImage != '') {
                deleteFile(oldImage)
                  .then(res => {
                    console.log('deleted file')
                  })
                  .catch(console.log)
              }
            })
            .catch(console.log)
        }

        console.log('upsertData: ', this.categoryObj)

        await upsertCategory(this.categoryObj)
          .then(res => {
            if (res.meta == meta.OK) {
              this.$toast.success(res.message)
              this.handleClearForm()
            } else {
              this.$toast.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
            this.$toast.error('Error')
          })
      }
    },
    getData() {
      listCategory()
        .then(res => {
          if (res.meta == meta.OK) {
            this.categoryList = res.datas
            this.categoryListClone = FilterChild('', res.datas, [])
            this.count_recommend = res.count_recommend;

            if (this.count_recommend >= 3) {
              this.canRecommend = false
            }
          } else {
            console.log(res)
          }
        })
        .catch(err => {
          console.log('Err Category Type Dialog', err)
          this.$$toast.error('Error')
        })
    },
    handleChangeRecommend(value) {
      if (value) {
        this.count_recommend++;
        if (this.count_recommend >= 3) {
          this.canRecommend = false;
        }
      }
      else {
        this.count_recommend--;
        this.canRecommend = true;
      }
    }
  },

  watch: {
    dialog() {
      if (this.dialog) {
        this.getData()
        this.resetForm()
        // this.categoryObj = newObj()
        this.categoryObj = this.obj
        !this.categoryObj.avatar ? (this.avatar = this.blankImg) : (this.avatar = this.imgUrl + this.categoryObj.avatar)
      }
    },
    // active() {
    //   if (this.active.length) {
    //     this.categoryObj = this.active[0]

    //     !this.categoryObj.avatar ? (this.avatar = this.blankImg) : (this.avatar = this.imgUrl + this.categoryObj.avatar)
    //   } else {
    //     this.categoryObj = newObj()
    //     this.resetForm()
    //   }
    // },
  },
}
</script>

<style>
</style>
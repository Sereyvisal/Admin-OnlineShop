<template>
  <v-dialog v-model="dialog" persistent width="608" :retain-focus="false">
    <v-card class="py-6" elevation="2">
      <v-card-text class="pb-0">
        <v-container fluid>
          <!-- Product Image -->
          <v-row>
            <v-col cols="12" class="pa-0">
              <span class="headline">
                <v-icon left class="pb-1">mdi-file-image-outline</v-icon>
                Product Images
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0" cols="12">
              <v-btn color="primary" class="mt-4" @click="handleUploadClick">
                Upload Images
              </v-btn>

              <span class="mt-2 d-flex align-end font-weight-bold error--text">
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

            <v-col v-if="file.length != 0">
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
                    width="100%"
                    style="overflow-y: scroll"
                  >
                    <span
                      class="d-flex align-center justify-center"
                      v-for="(item, key) in file"
                      :key="key"
                    >
                      <v-list-item class="ml-3" v-if="!urlImg(item)">
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
                            :src="checkAvatar(item)"
                            width="60px"
                            height="60px"
                            style="margin: 10px; border-radius: 50px"
                        /></v-btn>
                      </v-list-item>
                      <v-btn
                        color="red"
                        class="ml-4"
                        outlined
                        @click="handleFileRemove(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </span>
                  </v-sheet> -->

                
                  <viewer :images="file" class="prop-image__preview" @close="$emit('update:dialog', true)" @>
                    <template slot-scope="scope">
                      <div class="pitem" v-for="(img, imgk) in scope.images" :key="imgk">
                        <img 
                          :src="checkAvatar(img)"
                          draggable
                          style="height: 120px; width: 120px; border-radius: 4px; margin-right: 10px; object-fit: cover"
                        />
                          <!-- @click="$emit('update:dialog', false)" -->
                        
                        <v-icon class="delbtn" @click="handleFileRemove(img)">mdi-close</v-icon>
                      </div>
                    </template>
                  </viewer>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="pt-6 pb-0 pr-6">
        <v-spacer />

        <v-btn color="success" class="ml-6" @click="handleAdd">
          save
        </v-btn>

        <v-btn @click="$emit('update:dialog', false)" color="error" outlined>
          cancel
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { uploadFiles } from "@/api/generalAPI";
import { urlImg, removeFile } from "@/utils/generalFunc";
import serverConfig from "@/utils/serverConfig";

export default {
  name: "ImageCRUD",
  props: { dialog: Boolean, productItem: Object },
  data() {
    return {
      // uploadedImg: false,
      imgUrl: serverConfig.file_url,
      file: [],
      tempFile: [],
      blankImg: serverConfig.blank_product_img
    };
  },
  methods: {
    handleAdd() {
      // console.log("file: ", this.file);
      // console.log("tempFile: ", this.tempFile);
      this.$emit("handleImageData", this.file, this.tempFile);
      // this.file = [];
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
        this.file.push(...item)
      }

    },
    handleFileRemove(item) {
      if (typeof item == typeof "") {
        this.tempFile.push(item);
      }
      this.file.splice(this.file.indexOf(item), 1);
    },
    getImgPreviewUrl(img) {
      return URL.createObjectURL(img)
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

      return typeof item === "string" || item == undefined
        ? item == "" || item == undefined
          ? this.blankImg
          : this.imgUrl + item
        : typeof item === "object" 
          ? URL.createObjectURL(item)
          : this.blankImg
    },
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.tempFile = [];
        this.file = [...this.productItem.image];
        // this.productItem.image.length > 0
        //   ? this.productItem.image.forEach((p) => this.file.push(p))
        //   : this.file;
        // this.uploadedImg = true;
      }
      else {
        this.tempFile = [];
        this.file = [];
      }
    }
  }
};
</script>

<style lang="scss">
  .prop-image__preview{
    .pitem{
      display: inline-block;
      position: relative;
      margin-right: 6px;
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
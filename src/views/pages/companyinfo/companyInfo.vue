<template>
  <v-container fluid>
    <PageNavigation />

    <base-material-card
      title="Company Information"
      icon="mdi-home-city-outline"
      class="elevation-4 px-8 py-4 mt-14"
    >
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-row no-gutters>
            <v-col cols="12">
              <v-switch v-model="isEdit" label="Edit?" />
            </v-col>

            <v-col cols="12" class="d-flex justify-center align-center" v-if="obj.logo || logo">
              <div class="elevation-4 pa-3" style="backgroundColor: #333333">
                <v-img
                  :lazy-src="blankImg"
                  :src="logo"
                />
                <!-- src="https://d-themes.com/react/molla/demo-12/images/logo.png" -->
                <!-- :src="
                    obj.logo != ''
                      ? imgUrl + obj.logo
                      : blankImg
                  " -->
              </div>
            </v-col>

            <v-col cols="12" class="d-flex justify-center mt-6 mb-2">
              <v-btn color="primary" @click="handleUploadClick" :disabled="!isEdit">Upload new Logo</v-btn>

              <v-file-input
                ref="uploader"
                class="d-none"
                type="file"
                accept="image/jpeg, image/png, application/pdf"
                @change="item => handleFileChange(item)"
              />
            </v-col>

            <v-col cols="12" class="mt-10">
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
                  <v-text-field
                    v-model="obj.name"
                    label="Name"
                    :readonly="!isEdit"
                    outlined
                    dense
                  />
                </v-col>
                
                <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
                  <v-text-field
                    v-model="obj.email"
                    label="Email"
                    :readonly="!isEdit"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
                  <v-text-field
                    v-model="obj.phone"
                    label="Phone Number"
                    :readonly="!isEdit"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="py-0">
                  <v-text-field
                    v-model="obj.open_hour"
                    label="Opening Hours"
                    :readonly="!isEdit"
                    outlined
                    dense
                  />
                </v-col>
                
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="obj.address"
                    label="Address"
                    :readonly="!isEdit"
                    outlined
                    dense
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="pt-0">
          <v-btn
            :disabled="!isEdit"
            class="mb-4"
            color="success"
            @click="hanldeSave"
          >
            save
          </v-btn>
        </v-col>
      </v-row>
    </base-material-card>
  </v-container>
</template>

<script>
import { getCompanyInfo, upsertCompanyInfo } from "@/api/companyInfo";
import { meta } from "@/utils/enum";
import serverConfig from "@/utils/serverConfig";
import { uploadFile } from "@/api/generalAPI";

const newObj = () => {
  return {
    _id: "",
    name: "",
    logo: "",
    address: "",
    email: "",
    phone: "",
    open_hour: ""
  };
};

export default {
  name: "CompanyInfo",
  components: {
    ImageUpload: () => import("@/components/imageCRUD"),
    PageNavigation: () => import("@/components/pageNavigation"),
  },
  data() {
    return {
      obj: newObj(),
      isEdit: false,
      menu: false,
      blankImg: serverConfig.blank_product_img,
      imgUrl: serverConfig.file_url,
      file: undefined,
      logo: '',
    };
  },
  methods: {
    getData() {
      getCompanyInfo()
        .then((res) => {
          if (res.meta == meta.OK) {
            this.obj = res.data;

            this.obj.logo ? (this.logo = this.imgUrl + this.obj.logo) : '';
            console.log('info: ', this.obj);
          } 
          else {
            this.$toast.error(`Error - ${res.meta}`);
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error("Error");
        });
    },
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click();
    },
    handleFileChange(item) {
      if (this.checkFileSize(item)) {
        this.$toast("Cannot Upload File that bigger than 5MB");
        return true;
      }

      if (this.checkFileType(item)) {
        this.$toast("Wrong File Type, Upload image JPG or PNG format only");
        return true;
      }

      if (item) {
        this.file = item;
        this.logo = URL.createObjectURL(this.file);
      }
    },
    async hanldeSave() {
      if (this.file != undefined) {
        const fileForm = new FormData();
        fileForm.append("file", this.file);

        await uploadFile(fileForm)
          .then((res) => {
            if (res.meta == meta.OK) {
              this.obj.logo = res.file.md5;
            } else {
              console.log(res);
              return false;
            }
          })
          .catch(console.log);
      }

      await upsertCompanyInfo(this.obj)
        .then((res) => {
          if (res.meta == meta.OK) {
            this.$toast.success(res.message);
            this.isEdit = false;
          } else {
            console.log(res);
            this.$toast.error(`Error - ${res.meta}`);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error("Error");
        });
    },
  },
  mounted() {
    console.log("aaaaa: ", this.$store.getters.companyInfo);
    this.getData();
  },
};
</script>

<style>
</style>
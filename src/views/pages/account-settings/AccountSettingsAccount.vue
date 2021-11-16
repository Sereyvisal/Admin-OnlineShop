<template>
  <v-card
    flat
    class="pa-3 mt-2"
  >
    <v-card-text class="d-flex">
      <v-avatar
        rounded
        size="120"
        class="me-6"
      >
        <v-img :src="avatar"></v-img>
      </v-avatar>

      <!-- upload photo -->
      <div>
        <!-- <v-btn
          color="primary"
          class="me-3 mt-5"
          @click="$refs.refInputEl.click()"
        >
          <v-icon class="d-sm-none">
            {{ icons.mdiCloudUploadOutline }}
          </v-icon>
          <span class="d-none d-sm-block">Upload new photo</span>
        </v-btn>

        <input
          ref="refInputEl"
          type="file"
          accept=".jpeg,.png,.jpg,GIF"
          :hidden="true"
        /> -->

        <v-btn color="primary" class="me-3 mt-5" @click="handleUploadClick">
          Upload new photo
        </v-btn>

        <!-- <span class="mt-2 d-flex align-end red--text font-weight-bold">
          File Info
        </span> -->

        <v-file-input
          ref="uploader"
          class="d-none"
          type="file"
          accept="image/jpeg, image/png, application/pdf"
          @change="(item) => handleFileChange(item)"
        />

        <v-btn
          color="error"
          outlined
          class="mt-5"
          @click="handleReset"
        >
          Reset
        </v-btn>
        <p class="text-sm mt-5">
          Allowed JPG or PNG. Max size of 1M
        </p>
      </div>
    </v-card-text>

    <v-card-text>
      <v-form class="multi-col-validation mt-6" v-model="valid" ref="form" lazy-validation>
        <v-row>
          <v-col
            md="6"
            cols="12"
          >
            <v-text-field
              v-model="obj.firstname"
              label="Firstname"
              dense
              outlined
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col
            md="6"
            cols="12"
          >
            <v-text-field
              v-model="obj.lastname"
              label="Lastname"
              dense
              outlined
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="obj.email"
              label="E-mail"
              dense
              outlined
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="obj.role.role_name"
              dense
              label="Role"
              outlined
              :rules="[rules.required]"
              readonly
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="obj.gender"
              dense
              outlined
              label="Gender"
              :items="genderlist"
              item-text="text"
              item-value="value"
              item-color="danger"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <!-- <v-text-field
              v-model="obj.birthday"
              dense
              outlined
              label="Birthday"
              :rules="[rules.required]"
            ></v-text-field> -->

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
                  v-model="obj.birthday"
                  label="Birthday"
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required]"
                  outlined
                  dense
                  readonly
                />
              </template>

              <v-date-picker
                v-model="obj.birthday"
                @input="date1 = false"
                class="ma-0 pa-0"
              />
            </v-menu>
          </v-col>

          <!-- alert -->
          <!-- <v-col cols="12">
            <v-alert
              color="warning"
              text
              class="mb-0"
            >
              <div class="d-flex align-start">
                <v-icon color="warning">
                  {{ icons.mdiAlertOutline }}
                </v-icon>

                <div class="ms-3">
                  <p class="text-base font-weight-medium mb-1">
                    Your email is not confirmed. Please check your inbox.
                  </p>
                  <a
                    href="javascript:void(0)"
                    class="text-decoration-none warning--text"
                  >
                    <span class="text-sm">Resend Confirmation</span>
                  </a>
                </div>
              </div>
            </v-alert>
          </v-col> -->

          <v-col cols="12">
            <v-btn
              color="success"
              class="me-3"
              @click="handleSave"
            >
              Save
            </v-btn>
            <!-- <v-btn
              color="secondary"
              outlined
              @click="handleCancel"
            >
              Cancel
            </v-btn> -->
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiAlertOutline, mdiCloudUploadOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'

import serverConfig from "@/utils/serverConfig";
import { updateUserInfo } from "@/api/generalAPI";
import _ from "lodash";
import { removeFile, urlImg } from "@/utils/generalFunc";
import { uploadFiles, uploadFile, deleteFile } from "@/api/generalAPI";
import { meta } from "@/utils/enum";

const newObj = () => {
  return {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    gender: '',
    birthday: '',
    role: {
      role_name: ''
    }
  }
}

export default {
  props: {
    accountData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      date1: false,
      valid: false,
      obj: newObj(),
      genderlist: [
        {
          text: 'Male',
          value: 'Male'
        },
        { 
          text: 'Female',
          value: 'Female'
        }
      ],
      imgUrl: serverConfig.file_url,
      blankImg: serverConfig.blank_profile_img,
      file: "",
      avatar: "",
      fileUrl: serverConfig.file_url,
      rules: {
        required: (v) => !!v || "this field is required",
      },
    }
  },
  setup(props) {

    // const accountDataLocale = ref(JSON.parse(JSON.stringify(props.accountData)))

    // const resetForm = () => {
    //   accountDataLocale.value = JSON.parse(JSON.stringify(props.accountData))
    // }

    return {
      // accountDataLocale,
      icons: {
        mdiAlertOutline,
        mdiCloudUploadOutline,
      },
    }
  },
  methods: {
    urlImg,
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click();
    },
    handleUploadClick() {
      this.$refs.uploader.$refs.input.click();
    },
    handleFileChange(item) {
      if (this.checkFileSize(item).length > 0) {
        this.$toast.error("Cannot upload file bigger than 5MB");
        return true;
      }

      if (this.checkFileType(item)) {
        this.$toast.error("Wrong File Type, Upload image JPG or PNG format only");
        return true;
      }

      // if (item.length > 0) {
      //   item.forEach((p) => this.file.push(p));
      // } else {
      //   this.file = item[0];
      // }

      if (item) {
        this.file = item;
        console.log("changefile: ", this.file)
        this.avatar =  URL.createObjectURL(this.file);
        console.log("changeavatar: ", this.avatar)
      }
    },
    async handleSave() {
      if (this.$refs.form.validate()) {
        console.log("Save: ", this.obj)

        //Upload image
        if (this.file != undefined && this.file != "") {
          const fileImageForm = new FormData();
          fileImageForm.append("file", this.file);

          await uploadFile(fileImageForm)
            .then((res) => {
              var oldImage = this.obj.avatar;

              this.obj.avatar = res.file.md5;

              //delete old image
              if (oldImage != null && oldImage != '') {
              deleteFile(oldImage)
                .then((res) => {
                  console.log("deleted file");
                })
                .catch(console.log);
              }

            })
            .catch(console.log);
        }

        await updateUserInfo(this.obj)
          .then((res) => {
            if (res.meta == 2001) {
              this.$toast.success(res.message);
              this.$store.dispatch("UpdateUserInfo", res.data)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleReset() {
      this.obj = newObj();
      this.obj.role = this.accountData.role;
      this.obj.avatar = this.accountData.avatar;
    },
    handleCancel() {
      this.obj = this.accountData;
    }
  },
  watch: {
    accountData() {
      !this.accountData.avatar
        ? this.avatar = this.blankImg
        : this.avatar = this.imgUrl + this.accountData.avatar;

      this.obj = this.accountData;
    }
  },
}
</script>

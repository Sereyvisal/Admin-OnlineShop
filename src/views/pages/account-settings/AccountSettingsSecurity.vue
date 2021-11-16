<template>
  <v-card
    flat
    class="mt-5"
  >
    <v-form v-model="valid" ref="form" lazy-validation>
      <div class="px-3">
        <v-card-text class="pt-5">
          <v-row>
            <v-col
              cols="12"
              md="6"
              offset-md="3"
            >
              <!-- current password -->
              <v-text-field
                v-model="currentPassword"
                :type="isCurrentPasswordVisible ? 'text' : 'password'"
                :append-icon="isCurrentPasswordVisible ? icons.mdiEyeOffOutline:icons.mdiEyeOutline"
                label="Current Password"
                outlined
                dense
                @click:append="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                :rules="[v => !!v || 'Current password is required']"
              ></v-text-field>

              <!-- new password -->
              <v-text-field
                v-model="newPassword"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                :append-icon="isNewPasswordVisible ? icons.mdiEyeOffOutline:icons.mdiEyeOutline"
                label="New Password"
                outlined
                dense
                @click:append="isNewPasswordVisible = !isNewPasswordVisible"
                :rules="[v => !!v || 'New password is required', v => v.length >= 8 || 'Password must at least 8 characters']"
              ></v-text-field>

              <!-- confirm password -->
              <v-text-field
                v-model="cPassword"
                :type="isCPasswordVisible ? 'text' : 'password'"
                :append-icon="isCPasswordVisible ? icons.mdiEyeOffOutline:icons.mdiEyeOutline"
                label="Confirm New Password"
                outlined
                dense
                @click:append="isCPasswordVisible = !isCPasswordVisible"
                :rules="[v => !!v || 'Confirm password is required', (newPassword === cPassword) || 'Password must match']"
              ></v-text-field>
            </v-col>

            <!-- <v-col
              cols="12"
              sm="4"
              md="6"
              class="d-none d-sm-flex justify-center position-relative"
            >
              <v-img
                contain
                max-width="170"
                src="@/assets/images/3d-characters/pose-m-1.png"
                class="security-character"
              ></v-img>
            </v-col> -->

            <v-col cols="12" class="two-factor-auth text-center mx-auto pt-0 mb-3">
              <v-btn
                color="success"
                class="me-3"
                @click="handlePwdReset"
              >
                Save
              </v-btn>
              
              <!-- <v-btn
                color="secondary"
                outlined
                @click="resetForm"
              >
                Cancel
              </v-btn> -->
            </v-col>
          </v-row>
        </v-card-text>
      </div>

      <!-- divider -->
      <!-- <v-divider></v-divider>

      <div class="pa-3">
        <v-card-title class="flex-nowrap">
          <v-icon class="text--primary me-3">
            {{ icons.mdiKeyOutline }}
          </v-icon>
          <span class="text-break">Two-factor authentication</span>
        </v-card-title>

        <v-card-text class="two-factor-auth text-center mx-auto">
          <v-avatar
            color="primary"
            class="primary mb-4"
            rounded
          >
            <v-icon
              size="25"
              color="white"
            >
              {{ icons.mdiLockOpenOutline }}
            </v-icon>
          </v-avatar>
          <p class="text-base text--primary font-weight-semibold">
            Two factor authentication is not enabled yet.
          </p>
          <p class="text-sm text--primary">
            Two-factor authentication adds an additional layer of
            security to your account by requiring more than just a
            password to log in. Learn more.
          </p>
        </v-card-text> -->

        <!-- action buttons -->
        <!-- <v-card-text>
          <v-btn
            color="primary"
            class="me-3 mt-3"
          >
            Save changes
          </v-btn>
          <v-btn
            color="secondary"
            outlined
            class="mt-3"
          >
            Cancel
          </v-btn>
        </v-card-text>
      </div> -->
    </v-form>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiKeyOutline, mdiLockOpenOutline, mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'

import { resetPwd } from "@/api/generalAPI";
import { meta } from "@/utils/enum";
import serverConfig from "@/utils/serverConfig";
import { hashPwd, validatePwd } from "@/utils/generalFunc";
import { getUserInfo } from "@/api/generalAPI";

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
  setup() {
    const isCurrentPasswordVisible = ref(false)
    const isNewPasswordVisible = ref(false)
    const isCPasswordVisible = ref(false)

    return {
      isCurrentPasswordVisible,
      isNewPasswordVisible,
      isCPasswordVisible,
      icons: {
        mdiKeyOutline,
        mdiLockOpenOutline,
        mdiEyeOffOutline,
        mdiEyeOutline,
      },
    }
  },
  data() {
    return {
      valid: false,
      obj: newObj(),
      currentPassword: '',
      newPassword: '',
      cPassword: ''
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetValidation();
      this.currentPassword = '';
      this.newPassword = '';
      this.cPassword = '';
    },
    async handlePwdReset() {
      if (this.$refs.form.validate()) {
        if (!await validatePwd(this.currentPassword, this.obj.password)) {
          this.$toast.error("Invalid current password");
          return;
        }

        var updateData = {
          _id: this.obj._id,
          password: hashPwd(this.newPassword)
        }

        await resetPwd(updateData)
          .then((res) => {
            if (res.meta == meta.OK) {
              this.$toast.success("Password Reset Succesfully");
              this.resetForm();
            } 
            else {
              console.log(res);
              this.$toast.error(`Error - ${res.meta}`);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$toast.error("Error");
          });
      }
    },
  },
  mounted() {
    getUserInfo(this.$store.getters.userInfo._id)
      .then((res) => {
        this.obj = res.data;
        this.obj.birthday = this.moment(this.obj.birthday).format("YYYY-MM-DD");
        // console.log(this.obj);
      })
      .catch((err) => console.log(err));
  }
}
</script>

<style lang="scss">
// .two-factor-auth {
//   max-width: 25rem;
// }
// .security-character {
//   position: absolute;
//   bottom: -0.5rem;
// }

.v-messages__message {
  padding-bottom: 10px !important
}
</style>

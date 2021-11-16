<template>
  <v-app>
    <div class="wrapper login-v1">
      <div class="login-inner">
        <v-card class="login-card">
          <!-- <h1 class="d-flex justify-center text-3xl font-weight-semibold my-7">
            <span style="color: #4FC3F7">Administrator</span>
          </h1> -->
          <v-card-title class="d-flex align-center justify-center py-7">
            <router-link
              to="/"
              class="d-flex align-center"
            >
              <!-- <v-img
                :src="imgUrl + $store.getters.companyInfo.logo"
                max-height="30px"
                max-width="30px"
                alt="logo"
                contain
                class="me-3 "
              ></v-img> -->
              <!-- <v-icon style="font-size: 40px">mdi-login</v-icon> -->

              <h2 class="d-flex justify-center text-2xl font-weight-semibold">
                Welcome to {{$store.getters.companyInfo.name}}
              </h2>
            </router-link>
          </v-card-title>

          <!-- title -->
          <v-card-text>
            
            <!-- <p class="text-2xl font-weight-semibold text--primary mb-2">
              Welcome to Materio! 👋🏻
            </p> -->
            <p class="mb-2 d-flex justify-center">
              Please sign-in to your account
            </p>
          </v-card-text>

          <!-- login form -->
          <v-card-text>
            <v-form v-model="valid" ref="form" autoComplete="on">
              <v-text-field
                v-model="form.email"
                outlined
                label="Email"
                placeholder="john@example.com"
                :rules="[rules.required, rules.email]"
                @keypress.enter="handleLogin"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                outlined
                :type="isPasswordVisible ? 'text' : 'password'"
                label="Password"
                placeholder="············"
                :append-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append="isPasswordVisible = !isPasswordVisible"
                :rules="[rules.required]"
                @keypress.enter="handleLogin"
              ></v-text-field>

              <div class="d-flex align-center justify-space-between flex-wrap">
                <v-checkbox
                  label="Remember Me"
                  hide-details
                  class="me-3 mt-1"
                >
                </v-checkbox>

                <!-- forgot link -->
                <!-- <a
                  href="javascript:void(0)"
                  class="mt-1"
                >
                  Forgot Password?
                </a> -->
              </div>

              <v-btn
                block
                color="primary"
                class="mt-6 mb-2"
                @click="handleLogin"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- create new account  -->
          <!-- <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
            <span class="me-2">
              New on our platform?
            </span>
            <router-link :to="{name:'pages-register'}">
              Create an account
            </router-link>
          </v-card-text> -->

          <!-- divider -->
          <!-- <v-card-text class="d-flex align-center mt-2">
            <v-divider></v-divider>
            <span class="mx-5">or</span>
            <v-divider></v-divider>
          </v-card-text> -->

          <!-- social links -->
          <!-- <v-card-actions class="d-flex justify-center">
            <v-btn
              v-for="link in socialLink"
              :key="link.icon"
              icon
              class="ms-1"
            >
              <v-icon :color="$vuetify.theme.dark ? link.colorInDark : link.color">
                {{ link.icon }}
              </v-icon>
            </v-btn>
          </v-card-actions> -->
        </v-card>
      </div>

      <!-- background triangle shape  -->
      <!-- <img
        class="login-mask-bg"
        height="173"
        :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
      > -->

      <!-- tree -->
      <!-- <v-img
        class="login-tree"
        width="320"
        height="300"
        src="@/assets/images/misc/bglogin1.png"
      ></v-img> -->

      <!-- tree  -->
      <!-- <v-img
        class="login-tree-3"
        width="320"
        height="300"
        src="@/assets/images/misc/bglogin1.png"
      ></v-img> -->
    </div>
  </v-app>
</template>

<script>
// import { mdiFacebook, mdiTwitter, mdiGithub, mdiGoogle, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import { meta } from "@/utils/enum";
import { isAdmin } from "@/api/generalAPI"
import serverConfig from "@/utils/serverConfig"

const newForm = () => {
  return {
    email: "",
    password: "",
  };
};

export default {
  setup() {
    const isPasswordVisible = ref(false)
    const email = ref('')
    const password = ref('')
    // const socialLink = [
    //   {
    //     icon: mdiFacebook,
    //     color: '#4267b2',
    //     colorInDark: '#4267b2',
    //   },
    //   {
    //     icon: mdiTwitter,
    //     color: '#1da1f2',
    //     colorInDark: '#1da1f2',
    //   },
    //   {
    //     icon: mdiGithub,
    //     color: '#272727',
    //     colorInDark: '#fff',
    //   },
    //   {
    //     icon: mdiGoogle,
    //     color: '#db4437',
    //     colorInDark: '#db4437',
    //   },
    // ]

    return {
      imgUrl: serverConfig.file_url,
      isPasswordVisible,
      email,
      password,
      // socialLink,

      // icons: {
      //   mdiEyeOutline,
      //   mdiEyeOffOutline,
      // },

      valid: false,
      form: newForm(),
      rules: {
        required: (value) => !!value || "This field is required.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid email.'
        },
      },
    }
  },
  methods: {
    async handleLogin() {
      if (this.$refs.form.validate()) {
        await isAdmin(this.form).then(res => {
          if (res.meta == meta.OK) {
            console.log("res: ", res.data)
            if (!res.data.isAdmin) {
              this.IncorrectReset();
            }
            else {
              this.$store.dispatch("Login", this.form)
                .then((res) => {
                  if (res.meta == meta.OK) {
                    this.$router.push({ path: '/' }).catch(() => {});
                  } 
                  else {
                    this.IncorrectReset();
                  }
                })
                .catch((err) => console.log(err));
            }
          }
          else if (res.meta == meta.NOTEXIST) {
            this.IncorrectReset();
          }
        })
        .catch((err) => console.log(err));
      }
    },
    IncorrectReset() {
      this.form = newForm();
      this.resetForm();
      this.$toast.error("Incorrect username or password");
    }
  },
}
</script>

<style lang="scss" scope>
.wrapper {
  background: url('../../assets/images/misc/bglogin4.png') no-repeat center center fixed;
  background-size: cover;
  background-color: skyblue;
  display: flex;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  flex-basis: 100%;
  align-items: center;

  // common style for both v1 and v2
  a {
    text-decoration: unset;
  }

  // auth v1
  &.login-v1 {
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 1.5rem;

    .login-mask-bg {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .login-tree,
    .login-tree-3 {
      position: absolute;
    }
    .login-tree {
      bottom: 60px;
      left: 150px;
    }
    .login-tree-3 {
      bottom: 100px;
      right: 20px;
      // object-fit: fill;
    }

    // auth card
    .login-inner {
      width: 28rem;
      z-index: 1;
      .login-card {
        padding: 0.9375rem 0.875rem;
      }
    }
  }
}

@media (max-width: 600px) {
  // auth bg and tree hide in sm screen
  .login-v1 {
    .login-tree,
    .login-tree-3,
    .login-mask-bg {
      display: none;
    }
  }
}

</style>

// <style lang="scss">
// @import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
// </style>

<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
    style="backgroundColor: #212121;"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link
        to="/"
        class="d-flex align-center text-decoration-none"
      >
        <v-img
          :src="imgUrl + $store.getters.companyInfo.logo"
          max-height="80px"
          max-width="80px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
        <!-- <v-slide-x-transition>
          <h2 class="app-title" style="color: #F1F1F1">
            Online Shop
          </h2>
        </v-slide-x-transition> -->
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list
      expand
      shaped
      class="vertical-nav-menu-items pr-5"
      nav
    >

      <template v-for="(item, i) in computedItems">
        <nav-menu-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        />

        <nav-menu-link v-else :key="`item-${i}`" :item="item" />
      </template>

      <!-- <nav-menu-link
        title="Dashboard"
        :to="{ name: 'dashboard' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Account Settings"
        :to="{ name: 'pages-account-settings'}"
        :icon="icons.mdiAccountCogOutline"
      ></nav-menu-link>
      <nav-menu-group
        title="Pages"
        :icon="icons.mdiFileOutline"
      >
        <nav-menu-link
          title="Login"
          :to="{ name: 'pages-login' }"
          target="_blank"
        ></nav-menu-link>
        <nav-menu-link
          title="Register"
          :to="{ name: 'pages-register' }"
          target="_blank"
        ></nav-menu-link>
        <nav-menu-link
          title="Error"
          :to="{ name: 'error-404' }"
          target="_blank"
        ></nav-menu-link>
      </nav-menu-group>
      <nav-menu-section-title title="USER INTERFACE"></nav-menu-section-title>
      <nav-menu-link
        title="Typography"
        :to="{ name: 'typography' }"
        :icon="icons.mdiAlphaTBoxOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Icons"
        :to="{ name: 'icons' }"
        :icon="icons.mdiEyeOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Cards"
        :to="{ name: 'cards' }"
        :icon="icons.mdiCreditCardOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Tables"
        :to="{ name: 'simple-table' }"
        :icon="icons.mdiTable"
      ></nav-menu-link>
      <nav-menu-link
        title="Form Layouts"
        :to="{ name: 'form-layouts' }"
        :icon="icons.mdiFormSelect"
      ></nav-menu-link> -->
    </v-list>
    <!-- <a
      href="https://themeselection.com/products/materio-vuetify-vuejs-admin-template"
      target="_blank"
      rel="nofollow"
    >
      <v-img
        :src="require(`@/assets/images/pro/upgrade-banner-${$vuetify.theme.dark ? 'dark' : 'light'}.png`)"
        alt="upgrade-banner"
        transition="scale-transition"
        class="upgrade-banner mx-auto"
        max-width="230"
      ></v-img>
    </a> -->
  </v-navigation-drawer>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
} from '@mdi/js'
import NavMenuSectionTitle from './components/NavMenuSectionTitle.vue'
import NavMenuGroup from './components/NavMenuGroup.vue'
import NavMenuLink from './components/NavMenuLink.vue'

import { mapGetters } from "vuex";
import { generalRoutes } from "@/router";
import serverConfig from "@/utils/serverConfig"

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuGroup,
    NavMenuLink,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
  },
  setup() {
    return {
      icons: {
        mdiHomeOutline,
        mdiAlphaTBoxOutline,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiTable,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline,
      },
      imgUrl: serverConfig.file_url,
    }
  },
  methods: {
    mapRoute(item) {
      const temp = {
        ...item,
        children: item.children ? item.children.map(this.mapRoute) : undefined,
        title: item.meta.title,
        icon: item.meta.icon,
        group: "",
        to: item.path
      };

      return temp;
    }
  },
  computed: {
    ...mapGetters(["routers"]),
    // drawer: {
    //   get() {
    //     return this.$store.state.drawer;
    //   },
    //   set(val) {
    //     this.$store.commit("SET_DRAWER", val);
    //   }
    // },
    computedItems() {
      const arr = this.routers.filter(c => c.hidden === undefined).map(this.mapRoute);
      // const arr = generalRoutes.children.map(this.mapRoute);
      // console.log("arr: ", arr)

      // arr.forEach(e => {
      //   e.children = e.children.filter(c => c.hidden === undefined);
      // });
      // arr.unshift(dashboard, profile, leaveRequest, request2admin);
      arr.unshift(...generalRoutes.children.filter(c => c.hidden === undefined).map(e => this.mapRoute(e)));
      return arr;
    }
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}

// You can remove below style
// Upgrade Banner
.app-navigation-menu {
  .upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

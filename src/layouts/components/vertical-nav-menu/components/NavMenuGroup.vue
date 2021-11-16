<template>
  <v-list-group
    :group="group"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    color="white"
  >
    <v-icon slot="prependIcon" color="white">{{item.icon}}</v-icon>
    <template v-slot:activator>
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-avatar
        v-else-if="item.avatar"
        class="align-self-center"
        color="white"
        contain
      >
        <v-img
          src="https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="item.title" style="color: white" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in children">
      <!-- <base-item-sub-group
        v-if="child.children"
        :key="`sub-group-${i}`"
        :item="child"
      /> -->

      <nav-menu-link class="ml-3" :key="`item-${i}`" :item="child" />
    </template>
  </v-list-group>
</template>

<script>
// Utilities
import kebabCase from "lodash/kebabCase";
import { mapState } from "vuex";
import NavMenuLink from './NavMenuLink.vue'

export default {
  name: "ItemGroup",

  inheritAttrs: false,

  components: {
    NavMenuLink,
  },

  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(["barColor"]),
    children() {
      return this.item.children.map((item) => ({
        ...item,
        to: !item.to ? undefined : `${this.item.to}/${item.to}`,
      }));
    },
    computedText() {
      if (!this.item || !this.item.title) return "";

      let text = "";

      this.item.title.split(" ").forEach((val) => {
        text += val.substring(0, 1);
      });

      return text;
    },
    group() {
      return this.genGroup(this.item.children);
    },
  },

  methods: {
    genGroup(children) {
      return children
        .filter((item) => item.to)
        .map((item) => {
          const parent = item.group || this.item.group;

          let group = `${parent}/${kebabCase(item.to)}`;

          if (item.children) {
            group = `${group}|${this.genGroup(item.children)}`;
          }

          return group;
        })
        .join("|");
    },
  },
};
</script>

<style lang="scss">
// @import '~vuetify/src/styles/styles.sass';

.app-navigation-menu {
  .v-list-item {
    padding-left: 22px;
    margin-top: 0.375rem;
    height: 44px;
    min-height: 44px;

    .v-list-item__icon {
      margin-top: 0;
      margin-bottom: 0;
      align-self: center;
    }
  }

  @include theme(v-list-group__header) using ($material) {
    &.v-list-item--active {
      background-color: rgba(map-deep-get($material, 'text', 'primary'), map-deep-get($material, 'states', 'selected'));
    }
  }

  .vertical-nav-menu-group {
    & > .v-list-group__header > .v-list-group__header__append-icon .v-icon {
      transform: rotate(-90deg);
    }

    &.v-list-group--active > .v-list-group__header > .v-list-group__header__append-icon .v-icon {
      transform: none;
    }
  }
}

// .vertical-nav-menu-group {
//   &.v-list-group--active > .v-list-group__header > .v-list-group__header__append-icon .v-icon {
//     transform: none;
//   }

//   & > .v-list-group__header > .v-list-group__header__append-icon .v-icon {
//     transform: rotate(-90deg);
//   }

//   & & .v-list-group__items .v-list-item__icon {
//     visibility: hidden;
//   }
// }

// @include theme(vertical-nav-menu-group) using ($material) {
//   &.vertical-nav-menu-group-active > .v-list-group__header {
//     background-color: rgba(map-deep-get($material, 'text', 'primary'), map-deep-get($material, 'states', 'selected'));
//   }
// }

// .alternate-icon-small {
//   font-size: 14px;
//   height: 14px;
//   width: 14px;
// }
</style>

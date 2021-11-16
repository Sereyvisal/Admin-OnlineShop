<template>
<v-container fluid>
  <PageNavigation />

  <v-card id="account-setting-card" class="mt-10">
    <!-- tabs -->
    <v-tabs
      v-model="tab"
      show-arrows
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.icon"
      >
        <v-icon
          size="20"
          class="me-3"
        >
          {{ tab.icon }}
        </v-icon>
        <span>{{ tab.title }}</span>
      </v-tab>
    </v-tabs>

    <!-- tabs item -->
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <account-settings-account :account-data.sync="obj"></account-settings-account>
      </v-tab-item>

      <v-tab-item>
        <account-settings-security :userInfo.sync="obj"></account-settings-security>
      </v-tab-item>

      <v-tab-item>
        <account-settings-info :information-data="accountSettingData.information"></account-settings-info>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</v-container>
</template>

<script>
import { mdiAccountOutline, mdiLockOpenOutline, mdiInformationOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'

import AccountSettingsAccount from './AccountSettingsAccount.vue'
import AccountSettingsSecurity from './AccountSettingsSecurity.vue'
import AccountSettingsInfo from './AccountSettingsInfo.vue'

import { mapGetters } from "vuex";
import { getUserInfo } from "@/api/generalAPI";
import _ from "lodash";

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
  components: {
    AccountSettingsAccount,
    AccountSettingsSecurity,
    AccountSettingsInfo,
    PageNavigation: () => import("@/components/pageNavigation"),
  },
  setup() {
    const tab = ref('')

    // tabs
    const tabs = [
      { title: 'Account', icon: mdiAccountOutline },
      { title: 'Security', icon: mdiLockOpenOutline },
      // { title: 'Info', icon: mdiInformationOutline },
    ]

    // account settings data
    const accountSettingData = {
      account: {
        avatarImg: require('@/assets/images/avatars/1.png'),
        firstname: 'Alex',
        lastname: 'Costa',
        email: 'alex@example.com',
        role: 'Admin',
        gender: 'Male',
        birthday: 'February 22, 1995',
      },
      information: {
        bio: 'The name’s John Deo. I am a tireless seeker of knowledge, occasional purveyor of wisdom and also, coincidentally, a graphic designer. Algolia helps businesses across industries quickly create relevant 😎, scaLabel 😀, and lightning 😍 fast search and discovery experiences.',
        birthday: 'February 22, 1995',
        phone: '954-006-0844',
        website: 'https://themeselection.com/',
        country: 'USA',
        languages: ['English', 'Spanish'],
        gender: 'male',
      },
    }

    return {
      tab,
      tabs,
      accountSettingData,
      icons: {
        mdiAccountOutline,
        mdiLockOpenOutline,
        mdiInformationOutline,
      },
    }
  },
  data() {
    return {
      obj: newObj(),
    }
  },
  methods: {
    getUser() {
      getUserInfo(this.userInfo._id)
        .then((res) => {
          this.obj = res.data;
          this.obj.birthday = this.moment(this.obj.birthday).format("YYYY-MM-DD")
          console.log("obj: ", this.obj)
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    if (!_.isEmpty(this.userInfo)) {
      this.getUser();
    }
  },
  watch: {
    userInfo() {
      if (!_.isEmpty(this.userInfo)) {
        this.getUser();
      }
    },
  },
}
</script>

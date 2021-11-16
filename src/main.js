import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import moment from "moment";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@/permission";
import "./plugins/base";

import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

Vue.use(VueViewer)
VueViewer.setDefaults({
  movable: false
})

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    resetForm() {
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },
    formatNumber(data) {
      return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatPhoneNumber(data) {
      if(data.length === 9){
        return data.replace(/(\d{3})(\d{3})(\d{3})/g, "$1 $2 $3");
      } 
      else if(data.length === 10) {
        return data.replace(/(\d{3})(\d{3})(\d{4})/g, "$1 $2 $3");
      } 
    },
    showAttr(value) {
      var str = "";

      Object.keys(value).map(p => (str += `${p}: ${value[p]} `));

      return str;
    },
    showMore(data) {
      if (data.length > 50) {
        return data.substr(0, 50) + ".......";
      } else {
        return data;
      }
    },
    checkFileType(data) {
      const fileType = ["image/jpeg", "image/png", "application/pdf"];

      if (Array.isArray(data)) {
        const temp = data.filter(p => !fileType.includes(p.type));

        return temp.length == 0 ? false : true;
      } else {
        return !fileType.includes(data.type);
      }
    },
    checkFileSize(data) {
      if (Array.isArray(data)) {
        const temp = data.filter(p => {
          let size = p.size / 1024 / 1024;

          return size > 5 ? true : false;
        });

        return temp;
      } else {
        let size = data.size / 1024 / 1024;

        return size > 5 ? true : false;
      }
    },
    randomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },
    getStatusColor(index) {
      const color = [
        "error",
        "",
        "info",
        "success"
      ];

      return color[index];
    },
    getStatus(index) {
      const status_type = {
        0: "Cancel",
        1: "Pending",
        2: "Department Approved",
        3: "Department_Rejected",
        4: "Approved",
        5: "Rejected",
        6: "Processed",
        7: "Completed",
        8: "Completed with Bad Debt",
        9: "Approved by Finance",
        10: "Rejected by Finance",
      };

      const color = [
        "amber",
        "grey",
        "blue",
        "teal",
        "orange",
        "light-green",
        "deep-orange",
        "purple",
        "brown",
        "green",
        "red",
      ];

      return [color[index], status_type[index]];
    },
    getPayment(index) {
      const payment_type = {
        0: "Unpaid",
        1: "Paid",
        "-1": "Partial Paid",
        2: "Paid with Bad Debt"
      };

      const payment_color = {
        0: "red",
        1: "green",
        "-1": "orange",
        2: "deep-purple"
      };

      return [payment_color[index], payment_type[index]];
    }
  }
});

Vue.prototype.moment = moment;
Vue.config.productionTip = false;

Vue.filter('price', function (val) {
  if (Number.isNaN(val)) {
    return 0
  }
  return '$' + (val).toFixed(2)
});

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: POSITION.TOP_CENTER,
  timeout: 3000
});

new Vue({
  router,
  store,
  vuetify,
  // i18n,
  render: h => h(App)
}).$mount("#app");

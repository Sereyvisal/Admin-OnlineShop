<template>
  <v-container fluid class="sys-page">
    <PageNavigation />

    <v-row class="pt-16">
      <v-col cols="12">
        <base-material-card title="Customer" icon="mdi-account-box">
          <v-row class="mt-2">
            <v-col cols="12" lg="6" md="6" sm="6">
              <v-text-field
                v-model="search.keyword"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                hint="Search email, name, gender, birthday, phone number, address"
                persistent-hint
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="datas"
                :items-per-page="10"
                :loading ="tableLoading"
                :search="search.keyword"
                class="elevation-0"
              >
                <template v-slot:[`item.avatar`]="{ item }">
                  <v-img
                    :lazy-src="blankImg"
                    :src="checkAvatar(item.avatar)"
                    width="70px"
                    height="70px"
                    style="margin: 10px; border-radius: 50px"
                  ></v-img>
                </template>

                <template v-slot:[`item.phone_number`]="{ item }">
                  {{ formatPhoneNumber(item.phone_number) }}
                </template>

                <template v-slot:[`item.address`]="{ item }">
                  {{ getAddressString(item.address) }}
                </template>

              </v-data-table>
            </v-col>
          </v-row>

        </base-material-card>
      </v-col>
    </v-row>

    <!-- <DialogDelete
      :dialogDelete.sync="dialogDelete"
      :deleteObj="deleteObj"
      @handleDelete="handleDeleteConfirm"
    /> -->

  </v-container>
</template>

<script>
import { listCustomer } from "@/api/generalAPI";
import serverConfig from "@/utils/serverConfig";

const newObj = () => {
  return {
    avatar: "",
    email: "",
    firstname: "",
    lastname: "",
    gender: "",
    birthday: "",
    phone_number: "",
    address: ""
  }
};

const newSearch = () => {
  return {
    keyword: ""
  };
};

export default {
  components: {
    DialogDelete: () => import("@/components/deleteDialog"),
    PageNavigation: () => import("@/components/pageNavigation"),
  },
  data() {
    return {
      blankImg: serverConfig.blank_profile_img,
      imgUrl: serverConfig.file_url,
      tableLoading: true,
      datas: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Avatar",
          value: "avatar",
          sortable: false,
          width: '20',
          align: "center"
        },
        {
          text: "Email",
          value: "email",
          sortable: false,
          width: "140"
        },
        {
          text: "Fullname",
          value: "fullname",
          sortable: false,
        },
        {
          text: "Gender",
          value: "gender",
          align: "center",
          sortable: false,
          width: "100"
        },
        {
          text: "Birthday",
          value: "birthday",
          sortable: false,
          width: "190"
        },
        {
          text: "Phone Number",
          value: "phone_number",
          sortable: false,
        },
        {
          text: "Address",
          value: "address",
          sortable: false,
          width: "400"
        },
      ],
      search: newSearch(),
      obj: newObj(),
      deleteObj: newObj(),
    };
  },
  methods: {
    getCustomerData() {
      listCustomer(this.search)
        .then((res) => {
          if(res.meta == 2001) {
            this.tableLoading = false;

            if(res.datas.length == 0){
              this.$toast("No Data");
              this.datas = [];
              return true;
            }

            this.datas = res.datas;

            this.datas.forEach((d, i) => {
              (d.birthday != null) ? (d.birthday = this.moment(d.birthday).format("YYYY-MM-DD")) : "";
              d.fullname = d.firstname + " " + d.lastname;
            })
          }
          else {
            console.log(res);
            this.$toast.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(`Error - ${err.meta}`);
        });
    },
    checkAvatar(item) {
      return item == "" || item == undefined
          ? this.blankImg
          : this.imgUrl + item
    },
    getAddressString(address) {
        if (address.length) {
          var default_addr = address.find(e => e.default);
          console.log("defaultAddr: ", default_addr);
          return default_addr.address + ', ' + default_addr.city + ', ' + ((default_addr.state) ? default_addr.state + ', ' : '') + default_addr.zidefault_addr + ', ' + default_addr.country;
        }

        return '';
    }
  },
  mounted() {
    this.getCustomerData();
  },
};
</script>
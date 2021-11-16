<template>
  <v-dialog v-model="dialogDelete" max-width="600px">
    <v-card>
      <v-card-title class="title font-weight-regular pa-6 justify-center">
        <!-- {{ $vuetify.lang.t("$vuetify.delCurrentPersonInfo") }} -->
        {{ message || `Are you sure you want to delete this ${ objKey || `record` }?`}}
      </v-card-title>

      <v-card-actions>
        <v-spacer />
        
        <v-btn color="error" class="mr-2" @click="$emit('handleDelete', deleteObj)">
          Confirm
        </v-btn>

        <v-btn
          color=""
          outlined
          @click="$emit('update:dialogDelete', false)"
        >
          Cancel
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",
  props: { 
    dialogDelete: Boolean, 
    deleteObj: Object, 
    objKey: String, 
    message: String 
  },
};
</script>

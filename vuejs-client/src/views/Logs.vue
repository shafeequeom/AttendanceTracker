<template>
  <v-container fluid>
    <div>
      <div class="text-center welcome-text">TODAY'S LOGS</div>
      <div class="text-center museum-text">MUSEUM OF FUTURE</div>
    </div>

    <v-card class="ma-auto mt-4 fill-height" height="100%" width="80%" round>
      <v-card-text>
        <v-simple-table scrollable fixed-header height="400">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Picture</th>
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Type</th>
                <th class="text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in entries" :key="item.id">
                <td class="pa-2">
                  <v-avatar
                    ><v-img :src="$apiUrl + item.picture"></v-img
                  ></v-avatar>
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>
                  <v-chip :color="item.type == 'ENTRY' ? 'success' : 'error'">{{
                    item.type
                  }}</v-chip>
                </td>
                <td>{{ item.timestamp | timeStamp }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <div class="d-flex justify-center mt-4">
      <v-btn @click="$router.push('/')">Back</v-btn>
    </div>
  </v-container>
</template>

<script>
import { getAttendance } from "../functions/attendance";
export default {
  data() {
    return {
      entries: [],
    };
  },
  mounted() {
    this.getTodaysAttendance();
  },
  methods: {
    async getTodaysAttendance() {
      this.showLoader("Saving..");
      await getAttendance()
        .then((response) => {
          if (response.status == 200) {
            this.hideLoader();
            this.entries = response.data.data;
          }
        })
        .catch((error) => {
          let message = this.errorParser(error);
          this.showError(message);
        });
    },
  },
};
</script>

<style>
</style>
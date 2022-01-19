<template>
  <div>
    <div class="text-center museum-text mt-10">MUSEUM OF <br />THE FUTURE</div>
    <div class="d-flex justify-center">
      <v-btn
        x-large
        width="150"
        @click="gotoPage('entry')"
        height="70"
        class="ma-2 mr-4"
        color="#35f3d0"
      >
        Entry
      </v-btn>

      <v-btn
        x-large
        width="150"
        @click="gotoPage('exit')"
        height="70"
        color="#ffff95"
        class="ma-2"
      >
        Exit
      </v-btn>

      <v-btn x-large width="150" height="70" class="ma-2 ml-4" color="#7375ff">
        List
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gotoPage(page) {
      this.$router.push(page);
    },
  },
};
</script>

<style scoped>
.museum-text {
  background: #35f3d0;
  background: -webkit-linear-gradient(to bottom, #35f3d0 0%, #ffff95 100%);
  background: -moz-linear-gradient(to bottom, #35f3d0 0%, #ffff95 100%);
  background: linear-gradient(to bottom, #35f3d0 0%, #ffff95 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 20vh !important;
  font-weight: 400;
}
@media only screen and (max-width: 600px) {
  .museum-text {
    font-size: 15vh !important;
  }
}
</style>
import moment from "moment";
import Vue from "vue";

Vue.filter("timeStamp", (arg) => {
  return moment.utc(arg).local().format("Do MMM YYYY hh:mm a");
});

export default Vue.filter;

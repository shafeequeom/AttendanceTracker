import axios from "../../utils/axios";

const getDefaultEntryState = () => {
  return {
    activeEntries: [],
  };
};

const state = getDefaultEntryState();

const getters = {
  getActiveEntries: (state) => state.activeEntries,
};

const actions = {
  loadActiveEntries(context) {
    return new Promise((resolve, reject) => {
      axios
        .get(`attendances/current`)
        .then((response) => {
          if (response.status == 200) {
            const data = response.data.data;
            context.commit("setActiveEntries", data);
            resolve(data);
          }
          reject(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
const mutations = {
  resetEntryState(state) {
    Object.assign(state, getDefaultEntryState());
  },
  setActiveEntries(state, data) {
    state.activeEntries = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

import axios from "../utils/axios";

//API call Function for Entry and Exit
const registerAttendance = (form) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("picture", form.image);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("type", form.type);
    axios
      .post(`attendances`, formData, {
        headers: {
          "Content-Type": "multipart/form-data; boundary=${form._boundary}",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          resolve(response);
        }
        reject(response);
      })
      .catch((error) => reject(error));
  });
};

//API call Function getting today's logs
const getAttendance = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`attendances`)
      .then((response) => {
        if (response.status == 200) {
          resolve(response);
        }
        reject(response);
      })
      .catch((error) => reject(error));
  });
};

export { registerAttendance, getAttendance };

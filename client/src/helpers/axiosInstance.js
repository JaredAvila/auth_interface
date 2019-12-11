import axios from "axios";
const axiosInst = axios.create({
  withCredentials: true
});
export default axiosInst;

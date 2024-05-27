

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.host
});

export { axiosInstance };
import axios from "axios";

export const Http = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
})
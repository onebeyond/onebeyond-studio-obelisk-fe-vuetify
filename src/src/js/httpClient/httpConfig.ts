import axios from "axios";
import Configuration from "@js/configuration/configuration";

const http = () =>
    axios.create({
        baseURL: Configuration.appSettings.apiUrl,
        withCredentials: true,
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

export default http;

import axios from "axios";

const API_URL = "http://localhost:9000/api/users/"

export const getAllFollowRequests = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "get/requests", config);
    return response.data;
};

export const acceptFollowRequest = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${name}/accept`, config);
    return response.data;
};

export const rejectFollowRequest = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${name}/reject`, config);
    return response.data;
}

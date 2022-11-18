import axios from "axios";

const API_URL = "http://localhost:9000/api/users"

const getAllUsers = async (query, token) => {
    console.log("getAllUser triggered", query)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `?name=${query}`, config);
    console.log("here", response.data)
    return response.data;
};

const searchService = {
    getAllUsers
};

export default searchService;
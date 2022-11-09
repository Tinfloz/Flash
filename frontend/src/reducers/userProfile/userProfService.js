import axios from "axios";

const API_URL = "http://localhost:9000/api/users/"

const getUserProfs = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${name}`, config)
    return response.data;
};

const folUnfolUser = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${id}/follow`, config);
    console.log("whar is the response", response)
    return response.data;
};


const userProfService = {
    getUserProfs,
    folUnfolUser
};

export default userProfService;
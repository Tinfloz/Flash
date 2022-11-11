import axios from "axios";

const API_URL = "http://localhost:9000/api/users/"

const getUserProfs = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${name}/profile`, config);
    return response.data;
};

const folUnfolUsers = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${id}/follow`, config);
    return response.data;
}


const userProfService = {
    getUserProfs,
    folUnfolUsers
};

export default userProfService;
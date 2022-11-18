import axios from "axios";

const API_URL = "http://localhost:9000/api/users/";

const registerUser = async (userCreds) => {
    const response = await axios.post(API_URL + "register", userCreds);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
    };
    return response.data;
};

const loginUser = async (userCreds) => {
    const response = await axios.post(API_URL + "login", userCreds);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
    };
    return response.data;
};

const setProfileVisibility = async (visibility, token) => {
    console.log("running again")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "visibility", visibility, config)
    console.log("response====>", response)
    return response.data;
}


const userService = {
    registerUser,
    loginUser,
    setProfileVisibility
};

export default userService;
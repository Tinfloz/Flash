import axios from "axios";

const API_URL = "http://localhost:9000/api/users/"

const registerUser = async (userData) => {
    const response = await axios.post(API_URL + "register", userData);
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    };
    return response.data;
};

const loginUser = async (userData) => {
    const response = await axios.post(API_URL + "login", userData);
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    };
    return response.data;
};

const logoutUser = () => {
    localStorage.removeItem("user");
};

const authService = {
    registerUser,
    loginUser,
    logoutUser
};

export default authService;
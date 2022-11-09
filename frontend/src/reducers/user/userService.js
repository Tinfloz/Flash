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

// const logoutUser = () => {
//     localStorage.removeItem("user");
// };


const userService = {
    registerUser,
    loginUser,
};

export default userService;
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
    return response.data;
};

const updateProfileDetails = async (token, updates) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "updateprofile", updates, config);
    return response.data;
};

const updateUserPassword = async (token, updateDetails) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "updatepassword", updateDetails, config);
    return response.data;
};

const getResetLink = async (email) => {
    const response = await axios.post(API_URL + "/forget/password", email);
    return response.data;
};

const passwordReset = async (resetToken, resetPasswordDetails) => {
    const response = await axios.post(API_URL + `/reset/password/${resetToken}`, resetPasswordDetails);
    return response.data;
};

const userService = {
    registerUser,
    loginUser,
    setProfileVisibility,
    updateProfileDetails,
    updateUserPassword,
    getResetLink,
    passwordReset
};

export default userService;
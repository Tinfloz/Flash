import axios from "axios";

const API_URL = "http://localhost:9000/api/post";

const getAllPosts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/posts", config);
    return response.data;
};

const postService = {
    getAllPosts
};

export default postService;
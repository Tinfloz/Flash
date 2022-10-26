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

const likeUnlike = async (id, token) => {
    console.log("running")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/${id}/likestatus`, config);
    return response.data
};

const uploadPosts = async (post, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/", post, config);
    return response.data;
};

const deletePost = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(API_URL + `/${id}/delete`, config);
    return response.data;
}

const postService = {
    getAllPosts,
    likeUnlike,
    uploadPosts,
    deletePost
};

export default postService;
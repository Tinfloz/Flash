import axios from "axios";

const API_URL = "http://localhost:9000/api/post/";

const uploadPosts = async (post, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, post, config);
    return response.data;
};

const getLoggedInPosts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "get/posts", config);
    return response.data;
};

const getFollowingPosts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "posts", config);
    return response.data;
};

const deletePosts = async (token, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(API_URL + `${id}/delete`, config);
    return response.data;
};

const changeLikeStatus = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${id}/likestatus`, config);
    return response.data;
}

const postService = {
    uploadPosts,
    getLoggedInPosts,
    getFollowingPosts,
    deletePosts,
    changeLikeStatus
};

export default postService;

import axios from "axios";

const API_URL = "http://localhost:9000/api/post/";
const FOLLOW_URL = "http://localhost:9000/api/users/";

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
};

const folUnfolUsers = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(FOLLOW_URL + `${id}/follow`, config);
    return response.data;
};


const getSearchedUserProf = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${name}/profile`, config);
    return response.data;
};

const addPostComments = async (postId, token, comment) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log("comment is", comment)
    const response = await axios.post(API_URL + `${postId}/comment`, comment, config);
    console.log(response)
    return response.data
};

const editPostComments = async (postId, commentId, comment, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(API_URL + `${postId}/${commentId}/edit`, comment, config);
    return response.data;
};

const deletePostComments = async (postId, commentId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `${postId}/${commentId}/delete/comment`, config);
    return response.data;
};

const postService = {
    uploadPosts,
    getLoggedInPosts,
    getFollowingPosts,
    deletePosts,
    changeLikeStatus,
    getSearchedUserProf,
    folUnfolUsers,
    addPostComments,
    editPostComments,
    deletePostComments
};

export default postService;

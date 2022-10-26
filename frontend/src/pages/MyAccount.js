import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, GridItem, Image, HStack, Flex, IconButton } from '@chakra-ui/react'
import Navbar from '../components/Navbar';
import Post from '../components/Post';
import Footer from '../components/Footer';
import { getAllLoggedPosts, reset } from '../reducers/posts/postSlice';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {

    const dispatch = useDispatch();

    const { posts, userName, isError, isSuccess, isLoading, message } = useSelector(state => state.myPosts);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (posts?.length === 0) {
            dispatch(getAllLoggedPosts());
        }
        if (isSuccess) {
            dispatch(reset());
        }
        if (!user) {
            navigate("/login")
        }

    }, [posts, isSuccess, user, navigate, dispatch])

    console.log(posts)
    return (
        <>
            <Grid templateColumns='repeat(3, 1fr)' gap={7} pl="100px" pt="60px" pb="200px" backgroundColor="rgba(255, 127, 80, 0.1)">
                {posts.map((post) => (
                    <Post key={post._id} my={true} post={post} userName={userName} />
                ))}
            </Grid>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default MyAccount


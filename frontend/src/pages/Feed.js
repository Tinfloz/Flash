import { Flex, VStack, Grid, GridItem, Text, Spinner } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import { useSelector, useDispatch } from 'react-redux';
import { reset, getLoggedPosts, getFolPosts, resetHelpers } from "../reducers/post/postSlice";
import Footer from '../components/Footer';


const Feed = ({ feed }) => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.post);
    const { auth } = useSelector(state => state.user);
    const url = window.location.pathname;

    const getFols = async () => {
        await dispatch(getFolPosts());
        dispatch(resetHelpers())
    }

    const getMyPosts = async () => {
        await dispatch(getLoggedPosts())
        dispatch(resetHelpers())
    }

    useEffect(() => {
        feed ? (
            getFols()
        ) : (
            getMyPosts()
        )
    }, [dispatch, feed])

    useEffect(() => {
        return () => { dispatch(reset()) }
    }, [dispatch, url])

    if (user.posts === null) {
        return (
            <Flex
                justify="center"
                mt="20vh"
            >
                <Spinner />
            </Flex>
        )
    }

    return (
        <>
            {feed ? (
                <>
                    <Flex pb="20vh" justify="center" pt="7vh">
                        <VStack spacing="30px">
                            {user?.posts?.map(post => (
                                <Post my={false} post={post} user={auth} key={post._id} />
                            ))}
                        </VStack>
                    </Flex>
                    <footer id="footer">
                        <Footer />
                    </footer>
                </>
            ) : (
                <>
                    <Grid templateColumns='repeat(3, 1fr)' gap={7} pt="10vh" pb="20vh" pl="7vh" pr="7vh">
                        {user?.posts?.map(post => (
                            <GridItem display="flex" justifyContent="center">
                                <Post key={post._id} my={true} user={auth} post={post} />
                            </GridItem>
                        ))}
                    </Grid>
                    <footer id="footer" >
                        <Footer />
                    </footer>
                </>
            )}
        </>
    );
};

export default Feed
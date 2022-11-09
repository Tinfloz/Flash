import { Flex, VStack, Grid, GridItem, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import { useSelector, useDispatch } from 'react-redux';
import { reset, getLoggedPosts, getFolPosts, resetHelpers } from "../reducers/post/postSlice";
import Footer from '../components/Footer';


const Feed = ({ feed }) => {

    const dispatch = useDispatch();

    const { post } = useSelector(state => state.post);
    const url = window.location.pathname;

    const getFols = () => {
        dispatch(getFolPosts());
        setTimeout(() => { dispatch(resetHelpers()) }, 1000)
    }

    const getMyPosts = () => {
        dispatch(getLoggedPosts())
        setTimeout(() => { dispatch(resetHelpers()) }, 1000)
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

    return (
        <>
            {feed ? (
                <>
                    <Flex pb="20vh" justify="center" pt="7vh">
                        <VStack spacing="30px">
                            {post.map(post => (
                                <Post my={false} post={post} key={post._id} />
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
                        {post.map(post => (
                            <GridItem display="flex" justifyContent="center">
                                <Post key={post._id} my={true} post={post} />
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
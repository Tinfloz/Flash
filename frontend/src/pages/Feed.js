import { Flex, VStack, Grid, GridItem, Text, Spinner, HStack, Button } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import { useSelector, useDispatch } from 'react-redux';
import { reset, getLoggedPosts, getFolPosts, resetHelpers } from "../reducers/post/postSlice";
import Footer from '../components/Footer';
import { likeValidator } from '../helpers/likeValidator';
import { useNavigate } from 'react-router-dom';


const Feed = ({ feed }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.post);
    const { auth } = useSelector(state => state.user);

    const getFols = async () => {
        console.log("feed", feed)
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
        return () => {
            dispatch(reset())
        }
    }, [dispatch, feed])

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
                                <Post my={false} post={post} user={auth} key={post._id}
                                    liked={likeValidator(auth.sendUser._id, post.likes)} />
                            ))}
                        </VStack>
                    </Flex>
                    <footer id="footer">
                        <Footer />
                    </footer>
                </>
            ) : (
                <>
                    <Flex justify="center" p="2vh">
                        <VStack>
                            <HStack>
                                <Text as="b" fontSize="3vh">
                                    {user?.loggedInUser?.userName}
                                </Text>
                                <Button onClick={() => navigate(`/update/${user?.loggedInUser?.userName}`)}>Update Profile</Button>
                            </HStack>
                            <HStack spacing="3vh">
                                <Text>
                                    {user?.loggedInUser?.followers?.length > 1 ? `${user.loggedInUser?.followers?.length} followers` :
                                        `${user?.loggedInUser?.followers?.length} follower`}
                                </Text>
                                <Text>
                                    {`${user.loggedInUser?.following?.length} following`}
                                </Text>
                                <Text>
                                    {user.loggedInUser?.posts?.length > 1 ? `${user.loggedInUser?.posts?.length} posts` :
                                        `${user?.loggedInUser?.posts?.length} post`}
                                </Text>
                            </HStack>
                        </VStack>
                    </Flex>
                    <Grid templateColumns='repeat(3, 1fr)' gap={7} pt="10vh" pb="20vh" pl="7vh" pr="7vh">
                        {user?.posts?.map(post => (
                            <GridItem display="flex" justifyContent="center">
                                <Post key={post._id} my={true} user={auth} post={post} liked={likeValidator(auth.sendUser._id, post.likes)} />
                            </GridItem>
                        ))}
                    </Grid>
                    <footer id="footer" >
                        <Footer />
                    </footer>
                </>
            )
            }
        </>
    );
};

export default Feed
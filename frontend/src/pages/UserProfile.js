import { Flex, VStack, Text, HStack, Button, Spinner, Grid, GridItem } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/Footer';
import Post from '../components/Post';
import { getUserProfPosts, resetHelpers, reset } from "../reducers/userProfile/userProfSlice";
import { useParams } from 'react-router-dom';
import { followAndUnfollowUser } from '../reducers/userProfile/userProfSlice';

const UserProfile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.userProf);
    const { name } = useParams();

    useEffect(() => {
        (async () => {
            await dispatch(getUserProfPosts(name));
            dispatch(resetHelpers())
        })()
    }, [dispatch, name])

    useEffect(() => {
        return () => (
            dispatch(reset())
        )
    }, [dispatch])

    const handleFollow = async () => {
        await dispatch(followAndUnfollowUser(user._id))
        dispatch(resetHelpers())
    }

    if (user?.length === 0) {
        return (
            <Flex
                justify="center"
            >
                <Spinner />
            </Flex>
        )
    } else {

        return (
            <>
                <Flex justify="center"
                    borderBottom="2px"
                    borderBottomColor="gray.300"
                    backgroundColor="white"
                    p="1vh"
                >
                    <VStack spacing="2vh">
                        <HStack spacing="2vh">
                            <Text as="b" fontSize="3vh">{user.userName}</Text>
                            <Button
                                onClick={handleFollow}>Follow</Button>
                        </HStack>
                        <HStack spacing="4vh">
                            <Text>{user?.followers?.length > 1 ? `${user.followers.length} followers` : `${user.followers.length} follower`}</Text>
                            <Text>{user?.following.length} following</Text>
                        </HStack>
                    </VStack>
                </Flex>
                <Grid templateColumns='repeat(2, 1fr)' gap={7} pt="10vh" pb="20vh">
                    {user?.posts?.map(post => (
                        <GridItem display="flex" justifyContent="center">
                            <Post my={false} post={post} key={post._id} />
                        </GridItem>)
                    )}
                </Grid>
                <footer id="footer">
                    <Footer />
                </footer>
            </>
        );
    }
};

export default UserProfile
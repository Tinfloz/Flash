import { VStack, Flex, Text, HStack, Button, Spinner, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { followAndUnfollowUser, searchAndGetUserProfs, resetHelpers, reset } from '../reducers/post/postSlice';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { name } = useParams();
    const { user } = useSelector(state => state.post);

    const [followButton, setFollowButton] = useState(null);
    console.log("re-rendered")

    useEffect(() => {
        (async () => {
            await dispatch(searchAndGetUserProfs(name));
            dispatch(resetHelpers());
        })()
    }, [dispatch, name])

    useEffect(() => {
        setFollowButton(() => {
            if (user?.searchedUser?.followers?.includes(user.loggedInUser)) {
                return "Following"
            } else if (user?.searchedUser?.pendingRequests?.includes(user.loggedInUser)) {
                return "Requested"
            } else if (!(user?.searchedUser?.pendingRequests?.includes(user.loggedInUser) &&
                user?.searchedUser?.followers?.includes(user.loggedInUser))) {
                return "Follow"
            }
        })
    }, [user, followButton])

    useEffect(() => {
        return () => (
            dispatch(reset())
        )
    }, [dispatch])

    if (user.posts === null) {
        return (
            <>
                <Flex
                    justify="center"
                    mt="25vh"
                >
                    <Spinner />
                </Flex>
                <footer id="footer">
                    <Footer />
                </footer>
            </>
        );
    } else {
        if (user?.searchedUser?.visibility === "Public" ||
            (user.searchedUser?.visibility === "Private" &&
                user.searchedUser.followers.includes(user.loggedInUser))) {
            return (
                <>
                    <UserBar user={user} name={name} button={followButton} />
                    {user.posts.length > 0 ? (
                        <Grid templateColumns='repeat(3, 1fr)' gap={7} pt="10vh" pb="20vh" pl="7vh" pr="7vh">
                            {user.posts.map(post => (
                                <GridItem display="flex" justify="center">
                                    <Post my={false} post={post} key={post._id} />
                                </GridItem>
                            ))}
                        </Grid>
                    ) : (
                        <Flex
                            justify="center"
                            pt="20vh"
                        >
                            <Text as="b" fontSize="5vh" color="gray.300">{`${name} has no posts`}</Text>
                        </Flex>
                    )}
                    <footer id="footer">
                        <Footer />
                    </footer>
                </>
            );
        };
        if (user?.searchedUser?.visibility === "Private" &&
            !user.searchedUser.followers.includes(user.loggedInUser)) {
            return (
                <>
                    <UserBar user={user} name={name} button={followButton} />
                    <Flex
                        justify="center"
                        pt="20vh"
                    >
                        <Text as="b" fontSize="5vh" color="gray.300">{`Follow ${name} to see their posts`}</Text>
                    </Flex>
                    <footer id="footer">
                        <Footer />
                    </footer>
                </>
            );
        };
    };

};

const UserBar = ({ user, name, button }) => {

    const dispatch = useDispatch();

    const handleFollow = async () => {
        await dispatch(followAndUnfollowUser(user.searchedUser._id));
        dispatch(resetHelpers());
    };

    return (
        <Flex
            justify="center"
            borderBottom="1px"
            borderBottomColor="gray.300"
            backgroundColor="azure"
            pt="5vh"
        >
            <VStack spacing="3vh">
                <HStack spacing="2vh">
                    <Text as="b" fontSize="2.5vh">{name}</Text>
                    <Button onClick={handleFollow}>{button}</Button>
                </HStack>
                <HStack>
                    <Text>{user?.searchedUser?.followers?.length > 1 ? `${user?.searchedUser?.followers?.length} followers` :
                        `${user?.searchedUser?.followers?.length} follower`}</Text>
                    <Text>{`${user?.searchedUser?.following.length} following`}</Text>
                </HStack>
            </VStack>
        </Flex>
    );
};

export default UserProfile
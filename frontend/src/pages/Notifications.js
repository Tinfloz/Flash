import { useEffect, useState } from 'react';
import { Box, Button, Flex, HStack, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from 'react-redux';
import { reset, resetHelpers, getFollowRequests, followAccept, followReject } from "../reducers/followRequests/followRequestSlice";
import Footer from '../components/Footer';

const Notifications = () => {

    const dispatch = useDispatch();
    const { followRequests, isSuccess, isError } = useSelector(state => state.requests);

    const [showButton, setShowButton] = useState(true);
    const [message, setMessage] = useState(null);
    const toast = useToast();


    useEffect(() => {
        (async () => {
            await dispatch(getFollowRequests());
            dispatch(resetHelpers());
        })()
    }, [dispatch])

    useEffect(() => {
        if (message === null) {
            return
        }
        toast({
            position: "bottom-left",
            title: "Success",
            description: message,
            status: "success",
            duration: 9000,
            isClosable: true,
        })
    }, [message, toast])

    useEffect(() => {
        return () => (
            dispatch(reset())
        )
    }, [dispatch])

    if (followRequests === null) {
        return (
            <>
                <Flex
                    justify="center"
                    pt="20vh"
                >
                    <Spinner />
                </Flex>
                <footer id="footer">
                    <Footer />
                </footer>
            </>
        )
    }

    return (
        <>
            <Flex
                p="3vh">
                <Button onClick={async () => {
                    await dispatch(getFollowRequests())
                    dispatch(resetHelpers())
                }}>Refresh</Button>
            </Flex>
            <Flex
                justify="center">
                <Flex justify="center"
                    width="70vh"
                    borderColor="gray.200"
                    borderWidth="1px"
                    borderRadius="12px"
                    overflow="hidden"
                    p="2.5vh"
                >
                    {
                        followRequests?.length === 0 ? (
                            <Text as="b" fontSize="3vh" color="gray.400">You currently have no follow requests!</Text>
                        ) :
                            (
                                <VStack spacing="3vh">
                                    {followRequests.map((request, i) => (
                                        <HStack spacing="2vh">
                                            <Text as="b" key={i} fontSize="3vh">{request}</Text>
                                            <>
                                                < Button key={i} background="green.200" mr="0"
                                                    onClick={async () => {
                                                        await dispatch(followAccept(request));
                                                        dispatch(resetHelpers());
                                                        setShowButton(false);
                                                        setMessage("Request accepted")
                                                    }}> Accept</Button >
                                                <Button key={i} background="red.200"
                                                    onClick={async () => {
                                                        await dispatch(followReject(request));
                                                        dispatch(resetHelpers());
                                                        setShowButton(false)
                                                        setMessage("Request rejected")
                                                    }}>Reject</Button>
                                            </>
                                        </HStack>
                                    ))}
                                </VStack>
                            )
                    }
                </Flex>
            </Flex>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default Notifications


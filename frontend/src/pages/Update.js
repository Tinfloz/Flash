import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Input, VStack, Button, useToast, HStack } from "@chakra-ui/react";
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { updateUserDetails, resetHelpers } from '../reducers/user/userSlice';

const Update = () => {
    console.log("update render")
    const { name } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const [userProfileName, setUserProfileName] = useState(name);
    const [updates, setUpdates] = useState({
        userName: "",
        email: ""
    });
    const [password, setPassword] = useState(false)
    const handleChange = (e) => {
        setUpdates(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const { message } = useSelector(state => state.user);
    console.log("message", message)

    useEffect(() => {
        if (message === "") {
            console.log("not running useefccet")
            return
        } else {
            toast({
                position: "bottom-left",
                title: "Success",
                description: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            dispatch(resetHelpers());
            console.log("running use effect")
        }

    }, [message, toast, dispatch])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                h="80vh"
            >
                <Box
                    h="70vh"
                    w="50vh"
                    borderWidth="1px"
                    borderColor="gray.200"
                    pt="10vh"
                >
                    <Flex
                        justify="center"
                    >
                        <Text as="b" fontSize="4vh">{userProfileName}</Text>
                    </Flex>
                    <Flex
                        justify="center"
                        p="5vh"
                    >
                        <VStack spacing="4vh">
                            <Input placeholder="Enter a new username" value={updates.userName} name="userName"
                                onChange={handleChange} />
                            <Input placeholder="Enter a new email" value={updates.email} name="email"
                                onChange={handleChange} />
                            <Text as="button" color=" blue.400"
                                onClick={() => navigate("/update/password")}><strong>Change password</strong></Text>
                            <Button bg="blue.200" onClick={async () => {
                                await dispatch(updateUserDetails(updates));
                                setUserProfileName(updates.userName);
                                console.log("setUserProfileName")
                                setUpdates(prevState => ({
                                    ...prevState,
                                    userName: "",
                                    email: ""
                                }))
                            }}>Submit</Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex >
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default Update
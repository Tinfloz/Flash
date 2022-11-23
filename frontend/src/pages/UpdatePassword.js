import React, { useEffect, useState } from 'react';
import { Flex, Box, Input, VStack, Button, HStack, Text, useToast } from "@chakra-ui/react";
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { passwordUpdate, resetHelpers } from '../reducers/user/userSlice';

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { message, isSuccess, isError } = useSelector(state => state.user);
    const [pwdUpdate, setPwdUpdate] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const handleChange = (e) => {
        setPwdUpdate(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            dispatch(resetHelpers())
        };
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: message,
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
            dispatch(resetHelpers())
        }
    }, [isSuccess, isError, message, toast, dispatch])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                h="80vh"
            >
                <Box
                    w="50vh"
                    h="50vh"
                    borderWidth="1px"
                    borderColor="gray.200"
                    justify="center"
                    alignItems="center"
                >
                    <Flex justify="center" p="5vh">
                        <Text as="b" fontSize="3vh">Update password</Text>
                    </Flex>
                    <VStack spacing="3vh">
                        <HStack>
                            <Input placeholder="Confirm old password" value={pwdUpdate.oldPassword}
                                name="oldPassword" onChange={handleChange} />
                        </HStack>
                        <HStack>
                            <Input placeholder="Enter a new password" value={pwdUpdate.newPassword}
                                name="newPassword" onChange={handleChange} />
                        </HStack>
                        <HStack>
                            <Input placeholder="Confirm new password" value={pwdUpdate.confirmNewPassword}
                                name="confirmNewPassword" onChange={handleChange} />
                        </HStack>
                        <Button
                            onClick={async () => {
                                await dispatch(passwordUpdate(pwdUpdate));
                                setPwdUpdate(prevState => ({
                                    ...prevState,
                                    oldPassword: "",
                                    newPassword: "",
                                    confirmNewPassword: ""
                                }))
                            }}
                        >Confirm</Button>
                    </VStack>
                </Box>
            </Flex>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default UpdatePassword
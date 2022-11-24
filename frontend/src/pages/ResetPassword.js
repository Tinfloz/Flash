import { Box, Flex, Text, VStack, Input, Button, useToast } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { generateResetLink, resetHelpers } from '../reducers/user/userSlice';

const ResetPassword = () => {

    const dispatch = useDispatch();
    const toast = useToast();
    const { message, isSuccess, isError } = useSelector(state => state.user);
    const [showMessage, setShowMessage] = useState(false)

    console.log("rerendeerrrr")
    const [resetPassword, setResetPassword] = useState({
        email: "",
    });

    useEffect(() => {
        if (!isError && !isSuccess) {
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
            setShowMessage(true)
        };
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "email could not be sent",
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
                    h="50vh"
                    w="50vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        pt="10vh"
                    >
                        <VStack spacing="4vh">
                            <Text as="b" fontSize="2.5vh">Reset Password with your email</Text>
                            <Input type="email" placeholder="Enter your email"
                                value={resetPassword.email}
                                onChange={(e) => {
                                    setResetPassword(prevState => ({
                                        ...prevState,
                                        email: e.target.value
                                    }))
                                }}
                            />
                            <Button
                                onClick={async () => {
                                    await dispatch(generateResetLink(resetPassword))
                                    setResetPassword(prevState => ({
                                        ...prevState,
                                        email: ""
                                    }))
                                }}
                            >Reset</Button>
                            {showMessage && <Text as="b" color="blue.300">Check your email to reset password</Text>}
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default ResetPassword
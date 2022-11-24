import { Box, Button, Flex, Text, VStack, Input, useToast, HStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetHelpers, resetUserPassword } from '../reducers/user/userSlice';
import { BiShow, BiHide } from "react-icons/bi";
import { IconButton } from '@chakra-ui/react';

const SetNewPassword = () => {

    const { resetToken } = useParams();
    console.log(resetToken)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const { message, isSuccess, isError } = useSelector(state => state.user);
    const [resetPassword, setResetPassword] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });
    const [id, setId] = useState(null);
    const [show, setShow] = useState(false)
    const handleChange = (e) => {
        setResetPassword(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
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
            });
            dispatch(resetHelpers());
            setTimeout(() => navigate("/login"), 3000)
        };
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: message,
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            dispatch(resetHelpers());
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
                    borderColor="gray.300"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="8vh"
                    >
                        <VStack spacing="2vh">
                            <Text as="b" fontSize="3vh"> Enter new password</Text>
                            <Input placeholder="Enter new password"
                                type={id === 1 && show ? "text" : "password"}
                                value={resetPassword.newPassword} name="newPassword"
                                onChange={handleChange}
                            />
                            <Input placeholder="Confirm new password"
                                type="password"
                                value={resetPassword.confirmNewPassword} name="confirmNewPassword"
                                onChange={handleChange}
                            />
                            <Button
                                onClick={async () => {
                                    let resetDetails = {
                                        resetToken,
                                        resetPassword
                                    };
                                    await dispatch(resetUserPassword(resetDetails));
                                    setResetPassword(prevState => ({
                                        ...prevState,
                                        newPassword: "",
                                        confirmNewPassword: ""
                                    }));
                                }}
                            >Reset</Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex >
        </>
    )
}

export default SetNewPassword
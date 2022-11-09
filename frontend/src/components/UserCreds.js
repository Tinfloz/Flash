import { useState } from 'react';
import { Flex, Input, Box, VStack, Button, Text, HStack } from "@chakra-ui/react";
import { useDispatch } from 'react-redux';
import { register, login, resetHelpers } from "../reducers/user/userSlice";
import { useNavigate } from 'react-router-dom';
import { BiShow, BiHide } from "react-icons/bi";
import { IconButton } from '@chakra-ui/react';


const UserCreds = ({ first }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [creds, setCreds] = useState({
        email: "",
        userName: "",
        password: ""
    })

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(!show)
    };

    const handleChange = (e) => {
        setCreds(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        { first ? await dispatch(register(creds)) : await dispatch(login(creds)) };
        resetHelpers();
        navigate("/");
    };

    return (
        <>
            <Box
                h="50vh"
                w={first ? "60vh" : "55vh"}
                justifyContent="center"
                alignItems="center"
                border="1px"
                borderColor="gray.100"
                borderRadius="7px"
            >
                <VStack spacing="2vh">
                    <Flex justify="center"
                        backgroundColor="azure"
                        w={first ? "60vh" : "55vh"}
                        border="1px"
                        borderColor="gray.100"
                        borderRadius="7px"
                        mb="6vh"
                    >
                        <Text as="b" fontSize={first ? "4vh" : "5vh"}>{first ? "Create your Flash account" : "Login to Flash"}</Text>
                    </Flex>
                    {first ? <Input type="text" placeholder="Enter a username" name="userName" w="45vh"
                        value={creds.userName} onChange={handleChange} /> : null}
                    <Input type="email" placeholder="Enter email" name="email" w="45vh"
                        value={creds.email} onChange={handleChange} />
                    <HStack>
                        <Input type={show ? "text" : "password"} placeholder="Enter password" name="password" w="39vh"
                            value={creds.password} onChange={handleChange}
                        />
                        <IconButton
                            onClick={handleShow}
                            icon={show ? <BiHide /> : <BiShow />}
                            background="white" />
                    </HStack>
                    <Button
                        onClick={handleSubmit}>Submit</Button>
                    {first ? (
                        <Text as="button" color="gray.400" onClick={() => navigate("/login")}>Already registered? Login</Text>
                    ) : (<Text as="button" color="gray.400" onClick={() => navigate("/register")}>Not a user? Sign up!</Text>)}
                </VStack>
            </Box>
        </>
    );
};

export default UserCreds

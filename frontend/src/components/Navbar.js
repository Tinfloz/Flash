import React from 'react';
import { Flex, Text, Image, Button, Spacer, Box } from "@chakra-ui/react";
import logo from "../assets/flash.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "../reducers/auth/authSlice";

const Navbar = ({ user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await dispatch(logout());
        navigate("/login");
    }

    return (
        <>
            <Flex borderBottom="2px" borderBottomColor="gray.300" backgroundColor="azure" alignItems="end">
                <Box>
                    <Link to="/">
                        <Image src={logo} alt="logo"
                            borderRadius="12px"
                            width="4rem"
                            height="4rem"
                            ml="0.4rem"
                            mb="0.4rem"
                            mt="0.4rem"
                        />
                    </Link>
                </Box>
                <Spacer />
                {user ? (
                    <Box>
                        <Button size="lg" colorScheme="purple"
                            mr="0.4rem"
                            mb="0.9rem"
                            onClick={handleLogOut}>Logout</Button>
                    </Box>
                ) : (
                    <Box>
                        <Button size="lg" colorScheme="purple"
                            mr="0.4rem"
                            mb="0.9rem">Register</Button>
                        <Button size="lg" colorScheme="purple"
                            mr="0.4rem"
                            mb="0.9rem">Login</Button>
                    </Box>
                )}
            </Flex>
        </>
    );
};

export default Navbar
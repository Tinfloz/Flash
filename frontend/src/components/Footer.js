import React, { useState } from 'react'
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { HStack, IconButton, Flex } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { RiUserSearchLine, RiUserSearchFill } from "react-icons/ri";
// import './Footer.css'

const Footer = () => {
    const [link, setLink] = useState(window.location.pathname);
    const navigate = useNavigate();
    return (
        <>
            <Flex justifyContent="center" background="azure" h="10vh">
                <Flex justifyContent="center">
                    <HStack spacing="50px">
                        <IconButton
                            icon={link === "/" ? <AiFillHome /> : <AiOutlineHome />}
                            onClick={() => {
                                navigate("/");
                                setLink("/");
                            }} />
                        <IconButton
                            icon={link === "/add" ? <IoIosAddCircle /> : <IoIosAddCircleOutline />}
                            onClick={() => {
                                navigate("/add");
                                setLink("/add");
                            }} />
                        <IconButton
                            icon={link === "/search" ? <RiUserSearchFill /> : <RiUserSearchLine />}
                            onClick={() => {
                                navigate("/search");
                                setLink("/search");
                            }} />
                        <IconButton
                            icon={<CgProfile />}
                            onClick={() => {
                                navigate("/account");
                                setLink("/account");
                            }} />
                    </HStack>
                </Flex>
            </Flex>
        </>
    );
};

export default Footer


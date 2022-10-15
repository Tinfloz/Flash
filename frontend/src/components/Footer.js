import React, { useState } from 'react'
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { HStack, IconButton } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import './Footer.css'
const Footer = () => {
    const navigate = useNavigate();
    const [link, setLink] = useState(window.location.pathname);
    return (
        <>
            <div className='d-flex justify-content-center' id='footer-div'>
                <HStack>
                    <IconButton
                        icon={link === "/" ? <AiFillHome /> : <AiOutlineHome />}
                        onClick={() => {
                            setLink("/")
                            navigate("/")
                        }} />
                    <IconButton
                        icon={link === "/add" ? <IoIosAddCircle /> : <IoIosAddCircleOutline />}
                        onClick={() => {
                            setLink("/add")
                            navigate("/add")
                        }} />
                    <IconButton
                        icon={<CgProfile />}
                        onClick={() => {
                            setLink("/account")
                            navigate("/account")
                        }} />
                </HStack>
            </div>
        </>
    );
};

export default Footer
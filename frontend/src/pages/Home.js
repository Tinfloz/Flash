import { Flex, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import "./Home.css";
import Post from '../components/Post';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();


    return (
        <>
            <Navbar user={true} />
            <Flex backgroundColor="rgba(255, 127, 80, 0.1)" justifyContent="center" pt="50px" pb="200px">
                <VStack spacing="60px">
                    <Post my={false} />
                    <Post />
                </VStack>
            </Flex>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    );
};

export default Home
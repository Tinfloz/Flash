import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex, VStack, Input, Button } from "@chakra-ui/react";
import Footer from '../components/Footer';
import { upload } from '../reducers/posts/postSlice';

const AddPost = () => {

    const [post, setPost] = useState({
        image: "",
        caption: ""
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setPost((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        // e.preventDefault(e);
        dispatch(upload(post));
    };

    return (
        <>
            <Flex backgroundColor="rgba(255, 127, 80, 0.1)" justifyContent="center" pt="50px" pb="200px" >
                <Flex w="50vh" h="50vh" backgroundColor="azure" mt="4vh" justifyContent="center">
                    <VStack spacing="4vh" mt="12vh">
                        <Input type="text" name="caption" value={post.caption}
                            placeholder="Enter a caption for your post" w="300px" backgroundColor="white"
                            onChange={handleChange} />
                        <Input type="text" name="image" value={post.image} placeholder="Upload image"
                            backgroundColor="white"
                            onChange={handleChange} />
                        <Button backgroundColor="purple.100" onClick={handleSubmit}>Submit</Button>
                    </VStack>
                </Flex>
            </Flex>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    );
};

export default AddPost
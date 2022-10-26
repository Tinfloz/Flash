import React from 'react';
import { Avatar, HStack, Text, Image, Box, Flex, IconButton, VStack } from "@chakra-ui/react";
import "./Post.css";
import { AiFillHeart, AiFillDelete } from "react-icons/ai";

const Post = ({ my, post, userName }) => {
    return (
        <>
            <Box w={my ? "20rem" : "30rem"} borderRadius={my ? "md" : "lg"} borderWidth="2px" overflow="hidden" backgroundColor="azure">
                <Flex borderBottom="2px" borderBottomColor="gray.200">
                    <HStack spacing="1rem" mt="0.5rem" mb="0.5rem">
                        <Avatar name={userName} src="https://bit.ly/dan-abramov" ml="1rem" />
                        <Text>{userName}</Text>
                    </HStack>
                </Flex>
                <Image src={post.image} w="inherit" />
                <Box p="10px">
                    <HStack spacing="150px">
                        <HStack spacing="10px">
                            <IconButton
                                icon={<AiFillHeart />} />
                            <Text>5 likes</Text>

                        </HStack>
                        {my ? <IconButton
                            icon={<AiFillDelete />} /> : null}
                    </HStack>
                </Box>
                <Box p="10px">
                    <Text>{post.caption}</Text>
                </Box>
            </Box>
        </>
    );
};

export default Post

import React from 'react';
import { Avatar, HStack, Text, Image, Box, Flex, IconButton } from "@chakra-ui/react";
import "./Post.css";
import { AiFillHeart, AiFillDelete } from "react-icons/ai";
import { updateLikes, deletePostings } from '../reducers/posts/postSlice';
import { useDispatch } from 'react-redux';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react';

const Post = ({ my, post, userName }) => {

    const dispatch = useDispatch();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleLikes = () => {
        dispatch(updateLikes(post._id));
    }

    const handleDelete = () => {
        dispatch(deletePostings(post._id));
        window.location.reload();
    }

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
                                icon={<AiFillHeart />}
                                onClick={handleLikes} />
                            <Text>{post.likes.length} likes</Text>
                        </HStack>
                        {my ? (
                            <>
                                <IconButton
                                    icon={<AiFillDelete />}
                                    onClick={onOpen} />
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Delete Post</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <Text fontSize="20px">Are you sure you want to delete this post?</Text>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                                Close
                                            </Button>
                                            <Button colorScheme="blue"
                                                onClick={handleDelete}>Delete</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </>)
                            : null}
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

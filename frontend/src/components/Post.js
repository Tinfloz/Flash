import React, { useEffect, useState } from 'react';
import { Avatar, HStack, Text, Image, Box, Flex, IconButton, useToast, VStack } from "@chakra-ui/react";
import "./Post.css";
import { AiFillHeart, AiFillDelete } from "react-icons/ai";
import { deletePost, resetHelpers, likeAndUnlikePosts } from '../reducers/post/postSlice';
import { useDispatch, useSelector } from 'react-redux';
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
    const toast = useToast();
    const { isOpen: isFirstOpen, onClose: onFirstClose, onOpen: onFirstOpen } = useDisclosure();
    const { isOpen: isSecondOpen, onClose: onSecondClose, onOpen: onSecondOpen } = useDisclosure();

    const [liked, setLiked] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const { isSuccess, isError } = useSelector(state => state.post);
    console.log("delete status", deleted)

    const handleDeleteButton = async () => {
        setDeleted(true)
        await dispatch(deletePost(post._id));
        dispatch(resetHelpers());
        onSecondClose();
    };

    const handleLike = async () => {
        setLiked(!liked)
        await dispatch(likeAndUnlikePosts(post._id));
        dispatch(resetHelpers())
    };


    useEffect(() => {
        if (deleted) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Post has been deleted successfully!",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        }
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Post could not be deleted",
                status: "warning",
                duration: 9000,
                isClosable: true,
            })
        }

    }, [dispatch, toast, deleted])

    return (
        <>
            <Box justify="center" w={my ? "25rem" : "30rem"} borderRadius={my ? "md" : "lg"} borderWidth="2px" overflow="hidden" backgroundColor="azure">
                <Flex borderBottom="2px" borderBottomColor="gray.200">
                    <HStack spacing="1rem" mt="0.5rem" mb="0.5rem">
                        <Avatar name={post.userId.userName} src="https://bit.ly/dan-abramov" ml="1rem" />
                        <Text as="b">{post.userId.userName}</Text>
                    </HStack>
                </Flex>
                <Box minH={"20rem"} display="flex" alignItems="center" justifyContent="center" bg="white">
                    <Image src={post.image} overflow="hidden" />
                </Box>
                <Flex justify="center" mt="2vh">
                    <HStack spacing="25vh" w="95%">
                        <HStack spacing="10px" w="100%">
                            <IconButton
                                icon={<AiFillHeart style={{ color: liked ? "red" : "white", stroke: "black", strokeWidth: "15" }} />}
                                onClick={handleLike}
                                backgroundColor="azure"
                            />
                            <Text as="button" onClick={onFirstOpen}>{post.likes.length} likes</Text>
                            <Modal isOpen={isFirstOpen} onClose={onFirstClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Likes</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <VStack>
                                            {post.likes.map(like => (
                                                <Text key={post._id}>{like.name}</Text>
                                            ))}
                                        </VStack>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </HStack>
                        {my ? (
                            <>
                                <IconButton
                                    icon={<AiFillDelete />}
                                    backgroundColor="azure"
                                    onClick={onSecondOpen} />
                                <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Delete Post</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <Text fontSize="20px">Are you sure you want to delete this post?</Text>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme='blue' mr={3} onClick={onSecondClose}>
                                                Close
                                            </Button>
                                            <Button colorScheme="blue"
                                                onClick={handleDeleteButton}>Delete</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </>)
                            : null}
                    </HStack>
                </Flex>
                <Box p="1.5vh" mt="1vh">
                    <Text>{post.caption}</Text>
                </Box>
            </Box>
        </>
    );
};

export default Post

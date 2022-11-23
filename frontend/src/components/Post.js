import React, { useEffect, useState } from 'react';
import { Avatar, HStack, Text, Image, Box, Flex, IconButton, useToast, VStack, Input, Spacer, Tooltip } from "@chakra-ui/react";
import { AiFillHeart, AiFillDelete } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import {
    deletePost, resetHelpers, likeAndUnlikePosts,
    addComments, editComments, deleteComments, updateCaptionPost
} from '../reducers/post/postSlice';
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
import { BiDotsVerticalRounded } from "react-icons/bi";

const Post = ({ my, post, user, liked }) => {

    const dispatch = useDispatch();
    const toast = useToast();
    const { isOpen: isFirstOpen, onClose: onFirstClose, onOpen: onFirstOpen } = useDisclosure();
    const { isOpen: isSecondOpen, onClose: onSecondClose, onOpen: onSecondOpen } = useDisclosure();
    const { isOpen: isThirdOpen, onClose: onThirdClose, onOpen: onThirdOpen } = useDisclosure();
    const { isOpen: isFourthOpen, onClose: onFourthClose, onOpen: onFourthOpen } = useDisclosure();

    // const [liked, setLiked] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [newComment, setNewComment] = useState({
        comment: ""
    });
    const [editComment, setEditComment] = useState({
        newComment: ""
    });
    const [caption, setCaption] = useState({
        caption: ""
    })

    const [id, setId] = useState(0);

    console.log("rendered post", post._id)

    const handleEditClick = (id) => {
        setId(id);
    }

    const handleCommentChange = (e) => {
        setNewComment(prevState => ({
            ...prevState,
            comment: e.target.value
        }))
    };

    const handleEditComment = (e) => {
        setEditComment(prevState => ({
            ...prevState,
            newComment: e.target.value
        }))
    };

    const { isSuccess, isError } = useSelector(state => state.post);

    const handleDeleteButton = async () => {
        setDeleted(true)
        await dispatch(deletePost(post._id));
        dispatch(resetHelpers());
        onSecondClose();
    };

    const handleLike = async () => {
        // setLiked(!liked)
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

    }, [toast, deleted])

    return (
        <>
            <Box justify="center" w={my ? "25rem" : "30rem"} borderRadius={my ? "md" : "lg"} borderWidth="2px" overflow="hidden" backgroundColor="azure">
                <Flex borderBottom="2px" borderBottomColor="gray.200">
                    <HStack spacing="1rem" mt="0.5rem" mb="0.5rem">
                        <Avatar name={post.userId.userName} src="https://bit.ly/dan-abramov" ml="1rem" />
                        <Text as="b">{post.userId.userName}</Text>
                    </HStack>
                    <Spacer />
                    {my ?
                        (
                            <>
                                <Tooltip hasArrow label='Edit caption' bg='gray.300' color='black'>
                                    <IconButton
                                        icon={<BiDotsVerticalRounded />}
                                        bg="azure"
                                        _hover={{ bg: "azure" }}
                                        onClick={onFourthOpen}
                                    />
                                </Tooltip>
                                <Modal isOpen={isFourthOpen} onClose={onFourthClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Edit caption</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <HStack>
                                                <Input placeholder="Enter new caption" value={caption.caption}
                                                    onChange={(e) =>
                                                        setCaption(prevState => ({
                                                            ...prevState,
                                                            caption: e.target.value
                                                        }))
                                                    } />
                                                <Button onClick={async () => {
                                                    let newCaptionDetails = {
                                                        postId: post._id,
                                                        caption
                                                    };
                                                    await dispatch(updateCaptionPost(newCaptionDetails));
                                                    dispatch(resetHelpers())
                                                    setCaption(prevState => ({
                                                        ...prevState,
                                                        caption: ""
                                                    }))
                                                    onFourthClose();
                                                }}>Submit</Button>
                                            </HStack>
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
                            </>) :
                        (
                            null
                        )}
                </Flex>
                <Box minH={"20rem"} display="flex" alignItems="center" justifyContent="center" bg="white">
                    <Image src={post.image.url} overflow="hidden" />
                </Box>
                <Flex justify="center" mt="2vh">
                    <HStack spacing="25vh" w="95%">
                        <HStack spacing="1vh" w="100%">
                            <IconButton
                                icon={<AiFillHeart style={{ color: liked ? "red" : "white", stroke: "black", strokeWidth: "15" }} />}
                                onClick={handleLike}
                                backgroundColor="azure"
                            />
                            <Text as="button" onClick={onFirstOpen}>{post.likes.length}</Text>
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
                            <IconButton
                                icon={<FaRegComment style={{ color: "black" }} />}
                                backgroundColor="azure"
                                onClick={onThirdOpen}
                            />
                            <Modal isOpen={isThirdOpen} onClose={onThirdClose} size={"4xl"}>
                                <ModalOverlay />
                                <ModalContent p="2vh">
                                    <ModalHeader as="b">Comments</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        {post?.comments.length === 0 ? (
                                            <Text>Be the first one to comment!</Text>
                                        ) : (
                                            post.comments.map(comment => (
                                                < HStack >
                                                    <Text as="b" key={comment._id}>{comment.owner}</Text>
                                                    <Text key={comment._id}>{comment.comment}</Text>
                                                    {
                                                        user.sendUser._id === post.userId._id ? (
                                                            <Text as="button" color="blue.200"
                                                                onClick={async () => {
                                                                    let dispatchDetails = {
                                                                        postId: post._id,
                                                                        commentId: comment._id
                                                                    };
                                                                    await dispatch(deleteComments(dispatchDetails));
                                                                    dispatch(resetHelpers());
                                                                }} key={comment._id}>Delete</Text>
                                                        ) : (null)
                                                    }
                                                    {
                                                        user.sendUser.userName === comment.owner ? (
                                                            <>
                                                                {user.sendUser._id === post.userId._id ? (
                                                                    null
                                                                ) : (<Text as="button" color="blue.200"
                                                                    onClick={async () => {
                                                                        let dispatchDetails = {
                                                                            postId: post._id,
                                                                            commentId: comment._id
                                                                        };
                                                                        await dispatch(deleteComments(dispatchDetails));
                                                                        dispatch(resetHelpers());
                                                                    }} key={comment._id}>Delete</Text>)}
                                                                <Text as="button" color="blue.200"
                                                                    onClick={() => handleEditClick(comment._id)} key={comment._id}>Edit</Text>
                                                                {id === comment._id ?
                                                                    (
                                                                        <>
                                                                            <Input value={editComment.newComment}
                                                                                onChange={handleEditComment}
                                                                                placeholder="Edit comment"
                                                                                type="text"
                                                                                width="30vh"
                                                                            />
                                                                            <Button
                                                                                onClick={
                                                                                    async () => {
                                                                                        let editCommentDetails = {
                                                                                            commentId: comment._id,
                                                                                            postId: post._id,
                                                                                            newComment: editComment
                                                                                        };
                                                                                        await dispatch(editComments(editCommentDetails));
                                                                                        dispatch(resetHelpers());
                                                                                        setId(0)
                                                                                        setEditComment(prevState => ({
                                                                                            ...prevState,
                                                                                            newComment: ""
                                                                                        }))
                                                                                    }
                                                                                }
                                                                            >Edit</Button>
                                                                            <Button
                                                                                onClick={() => {
                                                                                    setId(0)
                                                                                    setEditComment(prevState => ({
                                                                                        ...prevState,
                                                                                        newComment: ""
                                                                                    }))
                                                                                }
                                                                                }>Cancel</Button>
                                                                        </>
                                                                    ) : (
                                                                        null
                                                                    )}
                                                            </>
                                                        ) : (null)
                                                    }
                                                </HStack >

                                            )
                                            ))
                                        }
                                    </ModalBody>
                                    <ModalFooter>
                                        <HStack>
                                            <Input value={newComment.comment} type="text" placeholder="Add a comment" w="35vh"
                                                onChange={handleCommentChange} />
                                            <Button onClick={async () => {
                                                let sendCommentDetails = {
                                                    postId: post._id,
                                                    comment: newComment
                                                }
                                                await dispatch(addComments(sendCommentDetails));
                                                dispatch(resetHelpers());
                                                setNewComment(prevState => ({
                                                    ...prevState,
                                                    comment: ""
                                                }))
                                            }}>Send</Button>
                                        </HStack>
                                    </ModalFooter>
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
            </Box >
        </>
    );
};

export default Post


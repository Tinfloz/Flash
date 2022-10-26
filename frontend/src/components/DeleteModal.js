import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Button
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { deletePostings } from '../reducers/posts/postSlice';

const DeleteModal = ({ id }) => {

    const { isOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deletePostings(id));
        window.location.reload();
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize="25px">Are you sure you want to delete this post?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'
                            onClick={handleDelete}>Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DeleteModal
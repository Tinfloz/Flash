import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, Text, Input, VStack, Button, useToast } from '@chakra-ui/react';
import Footer from '../components/Footer';
import { useDispatch } from 'react-redux';
import { createPosts, resetHelpers } from '../reducers/post/postSlice';

const AddPost = () => {

    const dispatch = useDispatch();
    const toast = useToast();
    const [upload, setUpload] = useState({
        image: "",
        caption: ""
    });
    console.log("add post rerendered")
    const [uploadSuccess, setUploadSuccess] = useState(false);


    useEffect(() => {
        if (uploadSuccess) {
            toast(
                {
                    position: "bottom-left",
                    title: "Success",
                    description: "Post has been uploaded!",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                }
            )
            setUploadSuccess(false)
        }
    }, [toast, uploadSuccess])


    const handleFileUpload = (e) => {
        const imgFile = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            if (fileReader.readyState === 2) {
                setUpload(prevState => ({
                    ...prevState,
                    image: fileReader.result
                }))
            }
        };
        fileReader.readAsDataURL(imgFile)
    }
    return (
        <>
            <Flex justifyContent="center" alignItems="center" h="80vh">
                <Box
                    h="55vh" w="55vh"
                    borderWidth="1px"
                    borderRadius="1vh"
                >
                    <Flex justify="center" p="1vh" borderBottom="1px" borderBottomColor="gray.200">
                        <Text as="b" fontSize="3vh">Create a new post</Text>
                    </Flex>
                    <Flex justify="center" p="10vh">
                        <VStack spacing="4vh">
                            <Input w="45vh" type="file" accept='.jpg, .png, .jpeg' onChange={handleFileUpload} />
                            <Input type="text" placeholder='Enter a caption' value={upload.caption}
                                onChange={(e) => setUpload(prevState => ({
                                    ...prevState,
                                    caption: e.target.value
                                }))} />
                            <Button
                                onClick={async () => {
                                    await dispatch(createPosts(upload));
                                    dispatch(resetHelpers());
                                    setUpload(prevState => ({
                                        ...prevState,
                                        caption: "",
                                        image: ""
                                    }))
                                    setUploadSuccess(true)
                                }}>Upload</Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default AddPost
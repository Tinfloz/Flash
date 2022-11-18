import React, { useState } from 'react';
import { Flex, Box, Select, VStack, Button } from "@chakra-ui/react";
import Footer from '../components/Footer';
import { setUserVisibility, resetHelpers } from '../reducers/user/userSlice';
import { useDispatch } from 'react-redux';

const SetProfileVisibility = () => {

    const [visibility, setVisibility] = useState({
        visibility: ""
    });

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(setUserVisibility(visibility));
        dispatch(resetHelpers());
    };

    const handleChange = (e) => {
        setVisibility(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <Flex
                justify="center"
                pt="25vh"
            >
                <Flex
                    justify="center"
                    w="60vh"
                    h="30vh"
                    border="2px"
                    borderColor="gray.200"
                    borderRadius="12px"
                    pt="10vh">
                    <VStack spacing="2vh">
                        <Box
                            display="flex"
                            justify="center"
                            w="40vh"
                        >
                            <Select placeholder="Select profile visibility" name="visibility" value={visibility.visibility}
                                onChange={handleChange}>
                                <option value={"Private"}>Private</option>
                                <option value={'Public'}>Public</option>
                            </Select>
                        </Box>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </VStack>
                </Flex>
            </Flex>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    );
};

export default SetProfileVisibility
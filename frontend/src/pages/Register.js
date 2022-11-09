import React from 'react';
import { Flex } from "@chakra-ui/react";
import UserCreds from '../components/UserCreds';

const Register = () => {
    return (
        <>
            <Flex
                justify="center"
                pt="10vh">
                <UserCreds first={true} />
            </Flex>
        </>
    )
}

export default Register
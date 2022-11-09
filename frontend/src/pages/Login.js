import React from 'react'
import UserCreds from '../components/UserCreds';
import { Flex } from "@chakra-ui/react";

const Login = () => {
    return (
        <>
            <Flex
                pt="15vh"
                justify="center">
                <UserCreds first={false} />
            </Flex>
        </>
    )
}

export default Login
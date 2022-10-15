import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, VStack, Text, HStack, IconButton } from '@chakra-ui/react';
import { BiShow, BiHide } from "react-icons/bi";
import './Login.css'

const Login = () => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };
    const navigate = useNavigate();
    return (
        <>
            <div className='d-flex justify-content-center' id='login-div'>
                <div className='card' id='login-card'>
                    <div className='card-header' id='login-header'>
                        <div className='d-flex justify-content-center'>
                            <Heading as='h3' size='xl' noOfLines={1}>Login to your Flash account</Heading>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='d-flex justify-content-center'>
                            <VStack>
                                <input type='email' className='form-control' placeholder='Enter email' id='email-register' />
                                <HStack>

                                    <input type={show ? 'text' : 'password'} className='form-control' placeholder='Enter a password' id='password-register' />
                                    <IconButton
                                        onClick={handleShow}
                                        icon={show ? <BiHide /> : <BiShow />}
                                        h='44px' />

                                </HStack>
                                <button type='submit' className='btn btn-primary' id='submit-login'>Submit</button>
                                <Text as='button' onClick={() => navigate("/register")}>Don't have an account? Register!</Text>
                            </VStack>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
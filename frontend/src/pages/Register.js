import React, { useState } from 'react';
import { Heading, VStack, Text, HStack, IconButton } from '@chakra-ui/react';
import { BiShow, BiHide } from "react-icons/bi";
import './Register.css'
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Register = () => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };
    const navigate = useNavigate();
    return (
        <>
            <div className='d-flex justify-content-center' id='register-div'>
                <div className='card' id='register-card'>
                    <div className='card-header' id='register-header'>
                        <div className='d-flex justify-content-center'>
                            <Heading as='h1' size='2xl' noOfLines={1}>Welcome to Flash!</Heading>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='d-flex justify-content-center'>
                            <VStack>
                                <input type='text' className='form-control' placeholder='Enter username' id='username-register' />
                                <input type='email' className='form-control' placeholder='Enter email' id='email-register' />
                                <HStack>

                                    <input type={show ? 'text' : 'password'} className='form-control' placeholder='Enter a password' id='password-register' />
                                    <IconButton
                                        onClick={handleShow}
                                        icon={show ? <BiHide /> : <BiShow />}
                                        h='44px' />

                                </HStack>
                                <button type='submit' className='btn btn-primary' id='submit-register'>Submit</button>
                                <Text as='button' onClick={() => navigate("/login")}>Already registered? Login!</Text>
                            </VStack>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
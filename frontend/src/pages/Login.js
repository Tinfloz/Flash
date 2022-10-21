import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, VStack, Text, HStack, IconButton, useToast } from '@chakra-ui/react';
import { BiShow, BiHide } from "react-icons/bi";
import { login, reset } from "../reducers/auth/authSlice";
import { useSelector, useDispatch } from 'react-redux';
import './Login.css'

const Login = () => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)

    const [creds, setCreds] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setCreds((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(creds));
    };

    useEffect(() => {
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: message,
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
        if (isSuccess || user) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: user.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate("/account")
        }
        dispatch(reset());
    }, [user, isLoading, isSuccess, isError, message, navigate, dispatch, toast])

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
                                <input type='email' className='form-control' placeholder='Enter email' id='email-register'
                                    name="email" value={creds.name} onChange={handleChange} />
                                <HStack>

                                    <input type={show ? 'text' : 'password'} className='form-control' placeholder='Enter a password' id='password-register'
                                        name="password" value={creds.password} onChange={handleChange} />
                                    <IconButton
                                        onClick={handleShow}
                                        icon={show ? <BiHide /> : <BiShow />}
                                        h='44px' />
                                </HStack>
                                <button type='submit' className='btn btn-primary' id='submit-login' onClick={handleSubmit}>Submit</button>
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
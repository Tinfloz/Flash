import React, { useState, useEffect } from 'react';
import { Heading, VStack, Text, HStack, IconButton, useToast, Spinner } from '@chakra-ui/react';
import { BiShow, BiHide } from "react-icons/bi";
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


const Register = () => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };

    const [userData, setUserData] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();


    const handleChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

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
                                <input type='text'
                                    className='form-control'
                                    placeholder='Enter username'
                                    id='username-register'
                                    name="userName"
                                    onChange={handleChange}
                                    value={userData.userName} />
                                <input type='email'
                                    className='form-control'
                                    placeholder='Enter email'
                                    id='email-register'
                                    name="email"
                                    onChange={handleChange}
                                    value={userData.email} />
                                <HStack>
                                    <input
                                        type={show ? 'text' : 'password'}
                                        className='form-control'
                                        placeholder='Enter a password'
                                        id='password-register'
                                        name="password"
                                        onChange={handleChange}
                                        value={userData.password}
                                    />
                                    <IconButton
                                        onClick={handleShow}
                                        icon={show ? <BiHide /> : <BiShow />}
                                        h='44px' />
                                </HStack>
                                <button type='submit' className='btn btn-primary' id='submit-register' onClick={handleSubmit}>Submit</button>
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
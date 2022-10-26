import { VStack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "./AddPost.css"

const AddPost = () => {

    const [post, setPost] = useState({
        caption: "",
        image: ""
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setPost((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center" id="add-post-div">
                <VStack spacing="20px">
                    <input className='form-control' value={post.caption} type="text" id="caption" name="caption" placeholder='Enter a caption'
                        onChange={handleChange} />
                    <input className='form-control' value={post.image} type="text" id="image" name='image' onChange={handleChange} />
                    <button onClick={handleSubmit} className='btn btn-primary'>Submit</button>
                </VStack>
            </div>
            <footer id="footer">
                <Footer />
            </footer>
        </>
    );
};

export default AddPost
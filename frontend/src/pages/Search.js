import { Flex, Input, Text, VStack, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from "react-redux";
import { getAllUsersDisp, reset } from '../reducers/search/searchSlice';
import { useNavigate } from 'react-router-dom';
import searchService from '../reducers/search/searchService';

const Search = () => {

    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { result, isSuccess } = useSelector(state => state.search);
    const [prevSearches, setPrevSearches] = useState(JSON.parse(window.localStorage.getItem("searches")) ? JSON.parse(window.localStorage.getItem("searches")) : [])
    console.log(prevSearches)
    useEffect(() => {
        dispatch(getAllUsersDisp(query))
        console.log(prevSearches)
    }, [query, dispatch])

    useEffect(() => {
        return () => {
            dispatch(reset())
        }
    }, [dispatch])

    return (
        <>
            <Flex pt="8vh" justify="center">
                <Input type="text" placeholder="Search..."
                    w="45vh"
                    background="gray.100"
                    onChange={(e) =>
                        setQuery(e.target.value)
                    } />
            </Flex>
            <Flex pb="50vh" justify="center">
                <VStack>
                    {query ? (
                        result.map(search => (<Text as="button"
                            onClick={() => {
                                navigate(`/user/${search}`)
                                window.localStorage.setItem("searches", JSON.stringify([...prevSearches, search]))
                            }}>{search}</Text>
                        ))) : (prevSearches?.map(prvsch => (
                            <Text color="gray.500" as="button"
                                onClick={() => {
                                    navigate(`/user/${prvsch}`)
                                }}>{prvsch}</Text>
                        )))}
                </VStack>
            </Flex >
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default Search
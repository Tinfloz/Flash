import { Flex, Input, Text, VStack, HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from "react-redux";
import { getAllUsersDisp, reset, getRecentSearches, deleteRecentSearches } from '../reducers/search/searchSlice';
import { useNavigate } from 'react-router-dom';
import searchService from '../reducers/search/searchService';

const Search = () => {

    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { result } = useSelector(state => state.search);
    const [prevSearches, setPrevSearches] = useState(JSON.parse(window.localStorage.getItem("searches")) ? JSON.parse(window.localStorage.getItem("searches")) : [])
    console.log("first", prevSearches)
    console.log("rerendered")
    useEffect(() => {
        dispatch(getAllUsersDisp(query))
    }, [query, dispatch])

    useEffect(() => {
        return () => {
            dispatch(reset())
        }
    }, [dispatch])

    useEffect(() => {
        window.localStorage.setItem("searches", JSON.stringify([...prevSearches]))
    }, [prevSearches])

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
                        ))) : (
                        prevSearches.length !== 0 ? (
                            prevSearches.map(prvsch => (
                                <HStack>
                                    <Text as="button" color="gray.500"
                                        onClick={() => {
                                            navigate(`/user/${prvsch}`)
                                        }}>{prvsch}</Text>
                                    <Text as="button" color="red"
                                        onClick={() => {
                                            setPrevSearches(prevState => prevState.filter(sch => sch !== prvsch))
                                        }}>X</Text>
                                </HStack>
                            ))
                        ) : (
                            <Text>No searches made</Text>
                        )
                    )}

                </VStack>
            </Flex >
            <footer id="footer">
                <Footer />
            </footer>
        </>
    )
}

export default Search
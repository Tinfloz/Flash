import Footer from "./components/Footer";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import MyAccount from "./pages/MyAccount";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
// import { ColorModeSwitcher } from './ColorModeSwitcher';
// import { Logo } from './Logo';
{/* <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" /> */}

function App() {

  const { user } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<AddPost />} />
          <Route path='/account' element={<MyAccount />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

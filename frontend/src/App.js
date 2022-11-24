import Footer from "./components/Footer";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
// import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
// import MyAccount from "./pages/MyAccount";
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
import Feed from "./pages/Feed";
import "./App.css";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import SetProfileVisibility from "./pages/SetProfileVisibility";
import Notifications from "./pages/Notifications";
import TestUp from "./pages/TestUp";
import Update from "./pages/Update";
import UpdatePassword from "./pages/UpdatePassword";
import ResetPassword from "./pages/ResetPassword";
import SetNewPassword from "./pages/SetNewPassword";
// import { ColorModeSwitcher } from './ColorModeSwitcher';
// import { Logo } from './Logo';
{/* <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" /> */}

function App() {

  const { auth } = useSelector(state => state.user);

  return (
    <Router>
      <div className="App">
        <Navbar user={auth} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<AddPost />} />
          <Route path='/account' element={<Feed feed={false} />} />
          <Route path={"/search"} element={<Search />} />
          <Route path="/user/:name" element={<UserProfile />} />
          <Route path="/set/visibility" element={<SetProfileVisibility />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/testup" element={<TestUp />} />
          <Route path="/update/:name" element={<Update />} />
          <Route path="/update/password" element={<UpdatePassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          <Route path="/reset/password/:resetToken" element={<SetNewPassword />} />
          <Route path='/' element={<Feed feed={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import Footer from "./components/Footer";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import MyAccount from "./pages/MyAccount";

function App() {
  return (
    <Router>
      <div className="App">
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

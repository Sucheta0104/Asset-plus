import Home from "./pages/Home";
import About from "./pages/About";
import SignUpForm from "./pages/SignUpForm";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import { Route,Routes } from "react-router-dom";


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About/>}></Route>
      <Route path="/Pricing" element={<Pricing/>}></Route>
      <Route path="/Contact" element={<Contact/>}></Route>
      <Route path="/signup" element={<SignUpForm/>}></Route>   
    </Routes>
     
    </>
  );
}

export default App;
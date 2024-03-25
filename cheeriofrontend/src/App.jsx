import "react-toastify/dist/ReactToastify.css";
import Background from "./components/background";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Lunch from "./components/Lunch";

const App = () => {
  return (
    <>
      <Background />
      <Routes>
        <Route path="/:id" element={<Home />} />
        <Route path="/lunch/:id" element={<Lunch />} />
      </Routes>
    </>
  );
};

export default App;

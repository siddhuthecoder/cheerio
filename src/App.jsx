import "react-toastify/dist/ReactToastify.css";
import Background from "./components/background";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Home2 from "./components/Home2";
import Lunch from "./components/Lunch";
import Lunch1 from "./components/Lunch1";

const App = () => {
  return (
    <>
      <Background />
      <Routes>
        <Route path="/:id" element={<Home />} />
        <Route path="/v2/:id" element={<Home2 />} />
        <Route path="/lunch/:id" element={<Lunch />} />
        <Route path="/lunch2/:id" element={<Lunch1 />} />
      </Routes>
    </>
  );
};

export default App;

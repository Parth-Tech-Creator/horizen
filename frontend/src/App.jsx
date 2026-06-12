import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";
import Companion from "./pages/Companion";
import MoviePlayer from "./pages/MoviePlayer";
import Reflection from "./pages/Reflection";
import Perspective from "./pages/Perspective";
import Insights from "./pages/Insights";
import Login from "./pages/Login"





function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<Session />} />
      <Route path="/movie" element={<MoviePlayer />} />
      <Route path="/companion" element={<Companion />} />
      <Route path="/reflection" element={<Reflection />} />
      <Route path="/perspective" element={<Perspective />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
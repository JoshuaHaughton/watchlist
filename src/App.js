import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Landing from './components/Landing';
import Search from './components/pages/Search';
import MediaInfo from './components/pages/MediaInfo';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/media/:id"
              element={<MediaInfo />}
            />
          </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Landing from './components/pages/Landing';
import Search from './components/pages/Search';
import MediaInfo from './components/pages/MediaInfo';
import Footer from './components/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import Discover from './components/pages/Discover';
import MyList from './components/pages/MyList';
import ProtectedRoutes from './components/ProtectedRoutes';
import { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <ScrollToTop>
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/search" element={<Search />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/my-list" element={<MyList />} />
              {/* <ProtectedRoutes /> */}
              <Route
                path="/:media/:id"
                element={<MediaInfo isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
              />
            </Routes>
        <Footer/>
      </ScrollToTop>
    </Router>
  );
}

export default App;

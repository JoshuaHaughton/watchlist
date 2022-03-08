import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/ui/Nav/Nav";
// import Landing from './components/pages/Landing';
import Landing from './components/pages/Landing/Landing';
import Search from './components/pages/Search/Search';
import MediaInfo from './components/pages/MediaInfo/MediaInfo';
import Footer from './components/ui/Footer/Footer';
import ScrollToTop from './components/ui/ScrollToTop/ScrollToTop';
import Discover from './components/pages/Discover/Discover';
import MyList from './components/pages/MyList/MyList';
import ProtectedRoutes from './components/ProtectedRoutes';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { AuthProvider } from './components/contexts/auth-context';


function App() {
  // const [cookies] = useCookies()
  // const [isLoggedIn, setIsLoggedIn] = useState(cookies.AuthToken ? true : false);

  return (
    <Router>
      <ScrollToTop>
        <AuthProvider>
          <Nav />
          <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/search" element={<Search />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/my-list" element={<MyList />} />
                <Route
                  path="/:media/:id"
                  element={<MediaInfo />}
                />
              </Routes>
          <Footer/>
        </AuthProvider>
      </ScrollToTop>
    </Router>
  );
}

export default App;

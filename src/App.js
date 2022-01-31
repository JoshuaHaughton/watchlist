import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";

function App() {
  return (
    <Router>
      <Nav />
    </Router>
  );
}

export default App;

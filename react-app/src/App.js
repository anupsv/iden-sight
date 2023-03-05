import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';

import Home from './components/Home';
import Register from './components/Register';
import Footer from './components/Footer';
import VotingPage from './components/VotingPage';
import CreateProcess from './components/CreateProcessPage';
import HowItWorks from './components/HowItWorks';

import { useSelector } from 'react-redux';
import { selectHasRegistered } from './store/home.slice';
import OpenRegistrations from "./components/OpenRegistrations";
import {useEffect, useState} from "react";
import {Group} from "@semaphore-protocol/group";

function App() {
  const hasRegistered = useSelector(selectHasRegistered);
  const [groupArray, setGroupArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    let _groupArray = [];
    // 10 to 14, including 10, is for proposals.
    for(let i = 0; i < 14; i++){
      console.log("Creating group ", i)
      let grp = new Group(i, 30)
      _groupArray.push(grp)
    }
    setGroupArray(_groupArray);
    setLoading(false);
  }, []);



  const renderRoutes = () => {
    let ret;
    if (!hasRegistered){
      ret = 
      <Routes>
        <Route path="/" element={<Register groups={groupArray}/>} />
        <Route path="/howItWorks" element={<HowItWorks/>} />
      </Routes>
    }else{
      ret = 
      <Routes>
        <Route path="/" element={<Home groups={groupArray}/>} />
        <Route path="/open-registrations" element={<OpenRegistrations groups={groupArray}/>} />
        <Route path="/voting/:id/:group" element={<VotingPage groups={groupArray}/>} />
        <Route path="/createProcess" element={<CreateProcess groups={groupArray}/>} />
      </Routes>
    }
    return ret;
  }

  return (
    <Router>
      <div className="app">
		    <Navbar />
		    <div className="content">
          {loading ? "Please wait ....." : renderRoutes()}
		    </div>
        {/* <Footer />   */}
      </div>
    </Router>
  );
}

export default App;

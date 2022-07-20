import React from 'react';
import {Routes, Route, BrowserRouter, Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Component from './components/Component';
import OPMList from './components/OPMTree';
import SensorList from './components/SensorList';
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {

  const struct = (comp: JSX.Element): JSX.Element => {
    return (
        <div>
          <Header />
          {comp}
          <Footer />
        </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/*<Header />*/}
        </header>
        <Routes>
          {/*<Header />*/}
          {/*<Route path="/" element={struct(Component)} />*/}
          <Route path="/" element={struct(<Component />)} />
          {/*<Route path="/app/:app" element={<SensorList />} />*/}
          <Route path="/app/:app" element={struct(<SensorList />)} />
          <Route path="/resource/:app" element={struct(<OPMList />)} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

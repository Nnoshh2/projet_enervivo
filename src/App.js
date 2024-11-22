 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Main from './Main';
import Step2 from './Step2';
import Step3 from './Step3';
import StepChoice from './StepChoice';
import Hangar from './Hangar';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/etape-2" element={<Step2/>} />
          <Route path="/etape-3" element={<Step3/>} />
          <Route path="/stepchoice" element={<StepChoice/>} />
          <Route path="/hangar" element={<Hangar/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import './App.css';
import Signup from './pages/Signup';
import Create from './pages/Createrequest';
import Ask from './pages/Asking';
import Responses from './pages/Responses';
import Answers from './pages/Answers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup/>}></Route>
      <Route path='/create' element={<Create/>}></Route>
      <Route path='/created/:user/get-answer/:sender' element={<Ask/>}></Route>
      <Route path='/:user/responses' element={<Responses/>}></Route>
      <Route path='/:user/responses/:partnerId' element={<Answers/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;

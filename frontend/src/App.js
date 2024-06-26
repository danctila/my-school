import Home from './Home'
import Create from './Create'
import Update from './Update'
import Login from './Login';
import UpdateResources from './UpdateResources';
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<Home />}></Route>
        <Route path='/create' element={<Create />}></Route>
        <Route path='/update/:id' element={<Update />}></Route>
        <Route path="/update-resources" element={<UpdateResources />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

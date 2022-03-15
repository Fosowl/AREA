import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Home,
         AddWidget,
         UpdateWidget,
         Settings,
         Profile,
         Login,
         Register
} from 'pages';

const App = () => {
  return(
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login/>}></Route>
          <Route exact path='/home' element={<Home/>}></Route>
          <Route exact path='/login' element={<Login/>}></Route>
          <Route exact path='/register' element={<Register/>}></Route>
          <Route exact path='/profile' element={<Profile/>}></Route>
          <Route exact path='/settings' element={<Settings/>}></Route>
          <Route exact path='/widget/add' element={<AddWidget />} />
          <Route exact path='/widget/update/:widget_id' element={<UpdateWidget />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
  );
}

export default App;
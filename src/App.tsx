import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './componant/signin&login/login';
import SignIn from './componant/signin&login/signup';
import Home from './componant/portfolio/home';
import About from './componant/portfolio/about';

import UploadFile from './componant/portfolio/UploadFile';
import Contact from './componant/portfolio/contact';

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const switchToLogin = () => setIsLogin(true);
  const switchToSignIn = () => setIsLogin(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLogin ? (
              <Login switchToSignIn={switchToSignIn} />
            ) : (
              <SignIn switchToLogin={switchToLogin} />
            )
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/upload" element={<UploadFile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
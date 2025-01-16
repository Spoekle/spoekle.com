import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './pages/components/Navbar/Navbar';
import Footer from './pages/components/Footer';
import About from './pages/About';
import EditorDash from './pages/EditorDash';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Projects from './pages/Projects';
import SpoekleSearch from './pages/SpoekleSearch';
import AdminDash from './pages/AdminDash/Index';
import ResetPassword from './pages/ResetPassword';
import PrivacyStatement from './pages/PrivacyStatement';
import Games from './pages/Games/Index';
import BeatSaber from './pages/Games/BeatSaber';
import ProfilePage from './pages/ProfilePage';
import background from './media/background.jpg';
import apiUrl from './config/config';
import Minecraft from './pages/Games/Minecraft';

function Spoekle() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const extractTokenFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${apiUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setLoading(false);
    };

    extractTokenFromURL();
    fetchUser();
  }, []);

  const RequireAuth = ({ children, isAdminRequired = false, isEditorRequired = false }) => {
    const [busy, setBusy] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 500);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (!busy) setBusy(false);
    }, [busy]);

    if (showLoadingScreen) {
      return (
        <div className="absolute z-70 w-full h-full bg-neutral-200 dark:bg-neutral-900 ">
          <div
            className="flex h-96 justify-center items-center"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
            }}
          >
            <div className="flex bg-gradient-to-b from-neutral-900 to-bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-4 text-white text-center animate-pulse animate-duration-[800ms]">
                  Checking Authentication...
                </h1>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/posts" replace state={{ alert: "You must be logged in to view this page." }} />;
    }

    if (isAdminRequired && !user.roles.includes('admin')) {
      return <Navigate to="/posts" replace state={{ alert: "You must have admin rights to do this!" }} />;
    }

    if (isEditorRequired && !(user.roles.includes('admin') || user.roles.includes('editor'))) {
      return <Navigate to="/posts" replace state={{ alert: "You must have editor rights to do this!" }} />;
    }

    return children;
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route
          path="/editor"
          element={
            <RequireAuth isEditorRequired={true}>
              <EditorDash />
            </RequireAuth>
          }
        />
        <Route path="/posts" element={<Posts />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/posts/:postId" element={<Posts />} />
        <Route path="/search" element={<SpoekleSearch />} />
        <Route
          path="/admin"
          element={
            <RequireAuth isAdminRequired={true}>
              <AdminDash />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage user={user} setUser={setUser} />
            </RequireAuth>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacystatement" element={<PrivacyStatement />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/beatsaber" element={<BeatSaber />} />
        <Route path="games/minecraft" element={<Minecraft />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Spoekle;
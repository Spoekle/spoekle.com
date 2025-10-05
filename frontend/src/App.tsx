import { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationContainer from './components/NotificationContainer';
import { NotificationProvider } from './context/NotificationContext';
import AuthenticationLayout from './layouts/AuthenticationLayout';

// Import blog-related components
import About from './pages/About/Index';
import Admin from './pages/Admin/Index';
import Blog from './pages/Blog/Index';
import BlogPost from './pages/Blog/BlogPost';
import BlogEditor from './pages/Blog/BlogEditor';
import Contact from './pages/Contact/Index';
import Games from './pages/Games/Index';
import Home from './pages/Home/Index';
import Login from './pages/Login/Index';
import Photography from './pages/Photography/Index';
import Portfolio from './pages/Portfolio/Index';
import ResetPassword from './pages/ResetPassword';
import PrivacyStatement from './pages/PrivacyStatement';
import ProfilePage from './pages/Profile/Index';
import NotFound from './layouts/NotFound';
import { User } from './types/adminTypes';
import PortfolioEditor from './pages/Portfolio/components/PortfolioEditor';

interface RequireAuthProps {
  children: ReactNode;
  isAdminRequired?: boolean;
  isEditorRequired?: boolean;
  isVerifiedRequired?: boolean;
}

interface NavigateState {
  alert: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const extractTokenFromURL = (): void => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    const fetchUser = async (): Promise<void> => {
      setIsAuthLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsAuthLoading(false);
    };

    extractTokenFromURL();
    fetchUser();
  }, []);

  const RequireAuth: React.FC<RequireAuthProps> = ({ 
    children, 
    isAdminRequired = false, 
    isEditorRequired = false, 
    isVerifiedRequired = false 
  }) => {
    // Show loading or waiting state while authentication is being checked
    if (isAuthLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-200 dark:bg-neutral-900">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          <p className="mt-4 text-lg">Verifying your session...</p>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" replace state={{ alert: "You must be logged in to view this page." } as NavigateState} />;
    }

    if (isAdminRequired && !user.roles.includes('admin')) {
      return <Navigate to="/" replace state={{ alert: "You must have admin rights to do this!" } as NavigateState} />;
    }

    if (isEditorRequired && !(user.roles.includes('admin') || user.roles.includes('editor'))) {
      return <Navigate to="/" replace state={{ alert: "You must have editor rights to do this!" } as NavigateState} />;
    }

    if (isVerifiedRequired && !(user.roles.includes('admin') || user.roles.includes('clipteam'))) {
      return <Navigate to="/" replace state={{ alert: "You must have verified rights to do this!" } as NavigateState} />;
    }

    return (
      <AuthenticationLayout 
        isAdminRequired={isAdminRequired} 
        isEditorRequired={isEditorRequired} 
        isVerifiedRequired={isVerifiedRequired}
      >
        {children}
      </AuthenticationLayout>
    );
  };

  return (
    <NotificationProvider>
      <Router>
        <div className="flex flex-col min-h-screen relative bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white transition duration-200">
          <Navbar user={user} setUser={setUser} />
          <main className="flex-grow pt-20 md:pt-24 relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/new" element={<RequireAuth isAdminRequired={true}><PortfolioEditor /></RequireAuth>} />
              <Route path="/portfolio/edit/:id" element={<RequireAuth isAdminRequired={true}><PortfolioEditor /></RequireAuth>} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog/new" element={<RequireAuth isAdminRequired={true}><BlogEditor /></RequireAuth>} />
              <Route path="/blog/edit/:slug" element={<RequireAuth isAdminRequired={true}><BlogEditor /></RequireAuth>} />
              <Route path="/games" element={<Games />} />
              <Route path="/admin" element={<RequireAuth isAdminRequired={true}><Admin /></RequireAuth>} />
              <Route path="/profile" element={
                <RequireAuth>
                  {user && <ProfilePage user={user} setUser={setUser} />}
                </RequireAuth>
              } />
              <Route path="/privacy-statement" element={<PrivacyStatement />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacystatement" element={<PrivacyStatement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <NotificationContainer />
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;

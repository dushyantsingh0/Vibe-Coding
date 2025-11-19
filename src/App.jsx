import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Lazy load pages for better performance on edge devices
const Home = lazy(() => import('./pages/Home'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Login = lazy(() => import('./pages/Login'));

// Simple loading component for Suspense fallback
const PageLoader = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>Loading vibe...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/edit/:id" element={<EditPost />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;




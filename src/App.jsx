import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;




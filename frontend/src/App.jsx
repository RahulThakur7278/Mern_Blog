// ============================================
// FILE: App.jsx
// PURPOSE: Main application component.
//          Defines all routes — which URL shows which page.
//          Navbar appears on every page (fixed at top).
// CALLED FROM: main.jsx
// CONNECTED TO: All pages (Register, Login, Home, etc.)
//               Navbar component
//               ProtectedRoute component
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';
import AdminPanel from './pages/AdminPanel'; // This is now the Pending Blogs page
import AdminAnalytics from './pages/AdminAnalytics'; // The new Analytics & Users page

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';

// --------------------
// 2. APP COMPONENT
// --------------------
function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar — visible on every page (fixed at top) */}
      <Navbar />

      {/* Main content area — pages render here */}
      {/* pt-16: space for the fixed navbar height */}
      <main className="pt-16">
        <PageTransition>
        <Routes>
          {/* ---- PUBLIC ROUTES ---- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          {/* ---- PROTECTED ROUTES (login required) ---- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />

          {/* ---- ADMIN ONLY ROUTES ---- */}
          
          {/* Redirect base /admin to the analytics page */}
          <Route 
            path="/admin" 
            element={<Navigate to="/admin/analytics" replace />} 
          />

          {/* Analytics & User List Page */}
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Pending Blogs Review Page */}
          <Route
            path="/admin/pending"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

        </Routes>
        </PageTransition>
      </main>

      {/* Scroll-to-top button — appears on all pages when scrolled down */}
      <ScrollToTop />
    </div>
  );
}

// --------------------
// 3. EXPORT
// --------------------
export default App;
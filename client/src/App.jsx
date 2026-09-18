import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { CourseLearn } from './pages/CourseLearn';
import { Dashboard } from './pages/Dashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { CourseEditor } from './pages/CourseEditor';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { CertificateVerify } from './pages/CertificateVerify';

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetails />} />
                  <Route path="/verify" element={<CertificateVerify />} />
                  <Route path="/verify/:id" element={<CertificateVerify />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Student Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learn/:id"
                    element={
                      <ProtectedRoute>
                        <CourseLearn />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Instructor & Admin Studio Protected Routes */}
                  <Route
                    path="/instructor"
                    element={
                      <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                        <InstructorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/instructor/courses/new"
                    element={
                      <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                        <CourseEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/instructor/courses/edit/:id"
                    element={
                      <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                        <CourseEditor />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route
                    path="*"
                    element={
                      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                          Page not found. The link might be broken or moved.
                        </p>
                        <a href="/" className="btn btn-primary">
                          Return Home
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostIdeas from './pages/PostIdeas';
import ContentKanban from './pages/ContentKanban';
import JobPipeline from './pages/JobPipeline';
import CalendarPage from './pages/Calendar';
import Settings from './pages/Settings';
import Recruiters from './pages/Recruiters';
import LinkedInCallback from './pages/LinkedInCallback';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/linkedin/callback" element={<LinkedInCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/content"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContentKanban />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/post-ideas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PostIdeas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pipeline"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <JobPipeline />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CalendarPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiters"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Recruiters />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CarListPage from './pages/CarListPage';
import CarDetailPage from './pages/CarDetailPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px',
          fontFamily: 'monospace',
          background: '#fff1f0',
          border: '2px solid red',
          margin: '20px',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: 'red' }}>⚠️ JavaScript алдаа гарлаа</h2>
          <pre style={{ marginTop: '12px', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cars" element={<CarListPage />} />
            <Route path="cars/:brand" element={<CarListPage />} />
            <Route path="cars/:brand/:model" element={<CarListPage />} />
            <Route path="listing/:id" element={<CarDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
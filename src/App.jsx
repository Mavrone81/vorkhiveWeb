import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div className="pt-24 min-h-screen text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to VorkWeb</h1>
          <p className="text-lg text-slate-600">Your HRMS Platform</p>
        </div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RuleList from './components/RuleList';
import RuleCreator from './components/RuleCreator';
import RuleEvaluator from './components/RuleEvaluator';
import RuleCombiner from './components/RuleCombiner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rules" element={<RuleList />} />
            <Route path="/create" element={<RuleCreator />} />
            <Route path="/evaluate" element={<RuleEvaluator />} />
            <Route path="/combine" element={<RuleCombiner />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
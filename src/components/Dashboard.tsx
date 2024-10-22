import React from 'react';
import { Link } from 'react-router-dom';
import { Book, PlusCircle, CheckCircle, Combine } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link to="/rules" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">View Rules</h2>
            <p className="text-gray-600">Browse and manage existing rules</p>
          </div>
          <Book className="h-12 w-12 text-blue-500" />
        </div>
      </Link>
      <Link to="/create" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Create Rule</h2>
            <p className="text-gray-600">Define new rules for the system</p>
          </div>
          <PlusCircle className="h-12 w-12 text-green-500" />
        </div>
      </Link>
      <Link to="/evaluate" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Evaluate Rule</h2>
            <p className="text-gray-600">Test rules against user data</p>
          </div>
          <CheckCircle className="h-12 w-12 text-yellow-500" />
        </div>
      </Link>
      <Link to="/combine" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Combine Rules</h2>
            <p className="text-gray-600">Merge multiple rules into complex logic</p>
          </div>
          <Combine className="h-12 w-12 text-purple-500" />
        </div>
      </Link>
    </div>
  );
};

export default Dashboard;
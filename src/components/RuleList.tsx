import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';

interface Rule {
  _id: string;
  name: string;
  expression: string;
}

const RuleList: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState<string | null>(null); // Track any errors
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/rules');
      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error(`Error fetching rules: ${response.statusText}`);
      }
      const data = await response.json();
      setRules(data); // Update state with rules data
      setError(null); // Clear any previous error
    } catch (error: any) {
      console.error('Error fetching rules:', error);
      setError(error.message); // Set the error message
    }
  };

  const deleteRule = async (id: string) => {
    try {
      await fetch(`http://localhost:5001/api/rules/${id}`, { method: 'DELETE' });
      setRules(rules.filter(rule => rule._id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const viewRule = (rule: Rule) => {
    setSelectedRule(rule);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 p-4 bg-blue-600 text-white">Rule List</h2>
      <div className="overflow-x-auto">
        {error ? ( // If there's an error, show a message
          <div className="text-red-600 p-4">
            Error fetching rules. Please try again later.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expression</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{rule.name}</td>
                    <td className="px-6 py-4">{rule.expression}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => viewRule(rule)} className="text-blue-600 hover:text-blue-900 mr-2">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteRule(rule._id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No rules available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {selectedRule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setSelectedRule(null)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedRule.name}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {selectedRule.expression}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setSelectedRule(null)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleList;

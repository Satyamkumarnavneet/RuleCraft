import React, { useState, useEffect } from 'react';
import { Combine } from 'lucide-react';

interface Rule {
  _id: string;
  name: string;
}

const RuleCombiner: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [combinedRuleName, setCombinedRuleName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rules');
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/combine-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleIds: selectedRules, name: combinedRuleName }),
      });
      if (response.ok) {
        setCombinedRuleName('');
        setSelectedRules([]);
        alert('Rules combined successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to combine rules');
      }
    } catch (error) {
      console.error('Error combining rules:', error);
      setError(error.message || 'Failed to combine rules. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 p-4 bg-blue-600 text-white">Combine Rules</h2>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="combinedRuleName" className="block text-sm font-medium text-gray-700">
            Combined Rule Name
          </label>
          <input
            type="text"
            id="combinedRuleName"
            value={combinedRuleName}
            onChange={(e) => setCombinedRuleName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Rules to Combine</label>
          <div className="mt-2 space-y-2">
            {rules.map((rule) => (
              <div key={rule._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={rule._id}
                  value={rule._id}
                  checked={selectedRules.includes(rule._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRules([...selectedRules, rule._id]);
                    } else {
                      setSelectedRules(selectedRules.filter(id => id !== rule._id));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={rule._id} className="ml-2 block text-sm text-gray-900">
                  {rule.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={selectedRules.length < 2}
        >
          <Combine className="h-5 w-5 mr-2" />
          Combine Rules
        </button>
      </form>
    </div>
  );
};

export default RuleCombiner;
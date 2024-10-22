import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Rule {
  _id: string;
  name: string;
}

const RuleEvaluator: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [userData, setUserData] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
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
    setResult(null);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: selectedRule, userData: JSON.parse(userData) }),
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to evaluate rule');
      }
    } catch (error) {
      console.error('Error evaluating rule:', error);
      setError(error.message || 'Failed to evaluate rule. Please check your input and try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 p-4 bg-blue-600 text-white">Evaluate Rule</h2>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="rule" className="block text-sm font-medium text-gray-700">
            Select Rule
          </label>
          <select
            id="rule"
            value={selectedRule}
            onChange={(e) => setSelectedRule(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            <option value="">Select a rule</option>
            {rules.map((rule) => (
              <option key={rule._id} value={rule._id}>
                {rule.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="userData" className="block text-sm font-medium text-gray-700">
            User Data (JSON format)
          </label>
          <textarea
            id="userData"
            value={userData}
            onChange={(e) => setUserData(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
            placeholder='e.g., {"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Evaluate Rule
        </button>
      </form>
      {result !== null && (
        <div className={`p-4 ${result ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="flex items-center text-lg font-semibold">
            {result ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-green-800">Rule Evaluation: True</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-red-800">Rule Evaluation: False</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default RuleEvaluator;
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const RuleCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [expression, setExpression] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, expression }),
      });
      if (response.ok) {
        setName('');
        setExpression('');
        alert('Rule created successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create rule');
      }
    } catch (error) {
      console.error('Error creating rule:', error);
      setError(error.message || 'Failed to create rule. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 p-4 bg-blue-600 text-white">Create New Rule</h2>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Rule Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="expression" className="block text-sm font-medium text-gray-700">
            Rule Expression
          </label>
          <textarea
            id="expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
            placeholder="e.g., ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Rule
        </button>
      </form>
    </div>
  );
};

export default RuleCreator;
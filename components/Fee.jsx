import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader, AlertCircle } from 'lucide-react';

const Fee = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch('/api/fees');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFees(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'due':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderFeesList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
          <p className="ml-2 text-blue-600 font-semibold">Loading fees...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          <AlertCircle className="w-6 h-6 mr-2" />
          <p>Error: {error}</p>
        </div>
      );
    }

    if (fees.length === 0) {
      return (
        <div className="flex items-center bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md">
          <p>No fee records found.</p>
        </div>
      );
    }

    return fees.map((fee) => (
      <motion.li
        key={fee._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="mb-4"
      >
        <Link href={`/fees/${fee._id}`}>
          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{fee.term}</h3>
              <p className="text-sm text-gray-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusStyles(fee.status)}`}>
              {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
            </span>
          </div>
        </Link>
      </motion.li>
    ));
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-blue-600">Fee Status</h2>
        <p className="text-gray-500">Check your fee payment status below.</p>
      </motion.div>
      
      <ul className="space-y-4">{renderFeesList()}</ul>
    </div>
  );
};

export default Fee;

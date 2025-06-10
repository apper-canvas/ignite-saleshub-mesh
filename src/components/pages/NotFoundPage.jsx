import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <ApperIcon name="Search" size={64} className="text-gray-300 mx-auto" />
        </motion.div>

        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
          404 - Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Dashboard
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
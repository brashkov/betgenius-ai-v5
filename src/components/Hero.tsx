import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Transform Your Betting with</span>
                  <span className="block text-indigo-600">AI-Powered Predictions</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Get ahead of the game with our advanced AI predictions. Backed by data analysis and machine learning, we provide accurate sports betting insights for informed decisions.
                </p>
              </motion.div>

              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Start Free Trial
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </main>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <TrendingUp className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">90% Accuracy Rate</h3>
              <p className="mt-2 text-base text-gray-500">Our AI models consistently deliver highly accurate predictions</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <Award className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Expert Analysis</h3>
              <p className="mt-2 text-base text-gray-500">Combining AI with expert sports analysis for better results</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <BarChart2 className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Updates</h3>
              <p className="mt-2 text-base text-gray-500">Get instant predictions and updates for all major sports</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
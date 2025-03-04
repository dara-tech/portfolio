import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ChatModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.5 }}
          className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative"
        >
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
            <X size={24} />
          </button>
          <h2 className="text-lg font-bold mb-3 text-center">Chat</h2>
          <div className="h-64 overflow-y-auto p-2 border rounded-md bg-gray-100">
            <p className="text-gray-700">This is the chat content area. Messages will appear here.</p>
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Send</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

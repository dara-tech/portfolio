import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import WriterLayout from '../components/writter/layout';

const WriterPage = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement API call to process content (e.g., send content to backend)
    console.log("Submitting content:", content);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Content submitted successfully!");
    }, 2000); // Simulate delay
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <WriterLayout content={content} onEditorChange={setContent}>
          <motion.div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
            {/* <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form> */}
          </motion.div>
        </WriterLayout>
      </div>
    </div>
  );
};

export default WriterPage;

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
    <WriterLayout content={content} onEditorChange={setContent}>
      <motion.div className="py-10">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </motion.div>
    </WriterLayout>
  );
};

export default WriterPage;

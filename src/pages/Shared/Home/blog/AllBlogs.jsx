import React, { useState } from 'react';
import { getAllBlogs, BLOGS_PER_PAGE } from '../../../../data/parkingBlogs';
import BlogList from '../../../../components/blogs/BlogList';
import Pagination from '../../../../components/blogs/Pagination';

const AllBlogs = () => {
  const allBlogs = getAllBlogs();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allBlogs.length / BLOGS_PER_PAGE);
  
  const indexOfLast = currentPage * BLOGS_PER_PAGE;
  const indexOfFirst = indexOfLast - BLOGS_PER_PAGE;
  const currentBlogs = allBlogs.slice(indexOfFirst, indexOfLast);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            স্মার্ট পার্কিং ব্লগ 🇧🇩
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            বাংলাদেশের প্রেক্ষাপটে আধুনিক পার্কিং প্রযুক্তি, উদ্ভাবন ও সমাধান
          </p>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Blog Grid */}
        <BlogList blogs={currentBlogs} />
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllBlogs;
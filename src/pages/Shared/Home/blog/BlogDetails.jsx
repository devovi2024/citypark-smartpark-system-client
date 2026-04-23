import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../../../../data/parkingBlogs';

const BlogDetails = () => {
  const { id } = useParams();
  const blog = getBlogById(id);
  
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">ব্লগটি পাওয়া যায়নি</h2>
          <Link to="/" className="text-green-600 mt-4 inline-block">← হোম পেজে ফিরুন</Link>
        </div>
      </div>
    );
  }
  
  const { title, titleEn, content, readTime, author, coverImage, additionalImages, description } = blog;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <Link to="/all-blogs" className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 mb-6">
          ← সব ব্লগ দেখুন
        </Link>
        
        {/* Hero Image */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <img src={coverImage} alt={title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>
        
        {/* Title & meta */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{titleEn}</p>
        </div>
        
        {/* Author & read time */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-6">
          <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-200" />
          <div>
            <p className="font-semibold text-gray-800">{author.name}</p>
            <p className="text-gray-500 text-sm">{readTime} • {new Date().toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
        
        {/* Description / excerpt */}
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-6 italic text-gray-700">
          {description}
        </div>
        
        {/* Main content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 mb-8">
          {content.split('\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
        
        {/* Additional Images (4 images total, cover already shown, so show 3 more) */}
        {additionalImages && additionalImages.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">সম্পর্কিত ছবি</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {additionalImages.map((img, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden shadow-md">
                  <img src={img} alt={`additional ${idx+1}`} className="w-full h-48 object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        )}
        
      
      </div>
    </div>
  );
};

export default BlogDetails;
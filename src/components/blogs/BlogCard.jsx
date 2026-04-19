import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { id, title, description, coverImage, readTime, author } = blog;
  
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md card-hover flex flex-col h-full">
      <Link to={`/blog/${id}`} className="block overflow-hidden h-48">
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={author.avatar} 
            alt={author.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
          <span className="text-sm text-gray-600">{author.name}</span>
          <span className="text-xs text-gray-400 mx-1">•</span>
          <span className="text-sm text-gray-500">{readTime}</span>
        </div>
        <Link to={`/blog/${id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-green-700 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        <Link 
          to={`/blog/${id}`}
          className="mt-auto text-green-700 font-medium text-sm hover:text-green-900 inline-flex items-center gap-1"
        >
          বিস্তারিত পড়ুন →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
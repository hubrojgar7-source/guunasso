import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'How to Start a Petition That Gets Results',
    category: 'Guide',
    date: 'May 15, 2024',
    comments: 12,
    author: 'Sanjok Gharti',
    image: 'https://images.unsplash.com/photo-1499678329028-3e7f5e5d3b3b?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: '5 Petitions That Changed Nepal This Year',
    category: 'Impact',
    date: 'May 10, 2024',
    comments: 8,
    author: 'Sita Sharma',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Your Rights as a Citizen: Speaking Up Matters',
    category: 'Rights',
    date: 'May 05, 2024',
    comments: 15,
    author: 'Rajesh Thapa',
    image: 'https://images.unsplash.com/photo-1580130775562-0ef92da028bc?w=600&h=400&fit=crop',
  },
];

const BlogSection = () => {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Read Our <span className="text-[#10B981]">Latest Blog</span>
          </h2>
          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#10B981] transition-colors cursor-pointer">
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#10B981] transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group block">
              <article className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-[#10B981] text-white text-xs font-semibold px-3 py-1 rounded-md">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.comments} comments</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-4 group-hover:text-[#10B981] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-xs font-bold text-[#10B981]">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

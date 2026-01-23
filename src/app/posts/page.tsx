import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export default function PostsPage() {
  const posts = getSortedPostsData();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">Coaching Corner</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/posts/${post.slug}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-slate-100 group"
          >
             <div className="flex items-center text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(post.date).toLocaleDateString()}
             </div>
             <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
             </h2>
             <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                {post.excerpt || post.content.substring(0, 150) + '...'}
             </p>
             <div className="flex items-center text-blue-500 text-sm font-medium">
                Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { getPostData, getAllPostIds } from '@/lib/posts';
import Markdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

export async function generateStaticParams() {
    const ids = getAllPostIds();
    return ids.map((id) => id.params);
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostData(slug);

    // Clean up Jekyll/Kramdown specific syntax
    // Removes {:target="_blank"} and similar attributes from links
    const cleanContent = post.content.replace(/\{:target="_blank"\}/g, '');

    return (
        <article className="max-w-4xl mx-auto">
            <Link href="/posts" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-700 mb-8">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Coaching Corner
            </Link>

            <header className="mb-10 text-center">
                <div className="flex items-center justify-center text-sm text-slate-500 mb-4 font-medium uppercase tracking-wide">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                    {post.title}
                </h1>
            </header>

            <div className="prose prose-lg prose-slate mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
                <Markdown>{cleanContent}</Markdown>
            </div>
        </article>
    );
}
import { getSortedPostsData } from '@/lib/posts';
import { DashboardClient } from '@/components/DashboardClient';

export default function Home() {
  const allPosts = getSortedPostsData();
  
  return <DashboardClient latestPost={allPosts[0]} />;
}
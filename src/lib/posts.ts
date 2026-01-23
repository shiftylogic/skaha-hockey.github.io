import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  [key: string]: any;
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id/slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    
    // Parse date from filename if not in frontmatter
    // Filename format: YYYY-MM-DD-title.md
    let dateStr = matterResult.data.date;
    if (!dateStr) {
      const match = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
      if (match) {
        dateStr = match[1];
      } else {
        dateStr = new Date().toISOString(); // Fallback
      }
    }

    return {
      slug,
      content: matterResult.content,
      ...matterResult.data,
      date: dateStr,
      title: matterResult.data.title || slug,
    } as PostData;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  let dateStr = matterResult.data.date;
  if (!dateStr) {
    // Try to recover date from slug if it matches YYYY-MM-DD pattern
    const match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      dateStr = match[1];
    } else {
       dateStr = new Date().toISOString();
    }
  }
  
  return {
    slug,
    content: matterResult.content,
    ...matterResult.data,
    date: dateStr,
    title: matterResult.data.title || slug,
  } as PostData;
}

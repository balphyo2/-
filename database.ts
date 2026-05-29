// types/database.ts

export type UserRole = 'STUDENT' | 'TEACHER' | 'DEVELOPER';
export type PostType = 'FREE' | 'TASK'; // 자유게시글 vs 수행평가 공지
export type ReportStatus = 'PENDING' | 'RESOLVED';

export interface UserRow {
  user_id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface PostRow {
  post_id: string;
  type: PostType;
  author_id: string;
  title: string;
  content: string;
  view_count: number;
  due_date: string | null;
  created_at: string;
}

// CommentRow, PostLikeRow, ReportRow 등도 동일하게 정의

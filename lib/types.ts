export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  nickname: string;
  realName: string;
  role: UserRole;
  createdAt: Date;
}

export type BoardType = 'free' | 'subject' | 'teacher';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  boardType: BoardType;
  subject?: string;
  isNotice: boolean;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export type ReportCategory = 'insult' | 'spam' | 'illegal' | 'inappropriate' | 'others';

export interface PostReport {
  id: string;
  postId: string;
  reporterId: string;
  reporterName: string;
  category: ReportCategory;
  reason?: string;
  createdAt: Date;
}

export interface CommentReport {
  id: string;
  commentId: string;
  postId: string;
  reporterId: string;
  reporterName: string;
  category: ReportCategory;
  reason?: string;
  createdAt: Date;
}

export const REPORT_CATEGORIES: Record<ReportCategory, string> = {
  insult: '욕설/비방',
  spam: '스팸/도배',
  illegal: '불법 정보',
  inappropriate: '부적절한 내용',
  others: '기타',
};

export const BOARD_NAMES: Record<BoardType, string> = {
  free: '자유게시판',
  subject: '과목별 게시판',
  teacher: '선생님 게시판',
};

export const SUBJECTS = [
  '국어',
  '영어',
  '수학',
  '과학',
  '사회',
  '역사',
  '체육',
  '음악',
  '미술',
];

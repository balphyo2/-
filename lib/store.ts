'use client';

import { create } from 'zustand';
import type { User, Post, Comment, PostReport, CommentReport, BoardType } from './types';
import { mockUsers, mockPosts, mockComments, mockPostReports, mockCommentReports } from './mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => boolean;
  signup: (email: string, nickname: string, realName: string) => User;
  logout: () => void;
}

interface DataState {
  posts: Post[];
  comments: Comment[];
  postReports: PostReport[];
  commentReports: CommentReport[];
  
  // Post actions
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'commentCount'>) => Post;
  deletePost: (postId: string) => void;
  toggleNotice: (postId: string) => void;
  incrementViewCount: (postId: string) => void;
  
  // Comment actions
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Comment;
  deleteComment: (commentId: string) => void;
  
  // Report actions
  reportPost: (report: Omit<PostReport, 'id' | 'createdAt'>) => void;
  reportComment: (report: Omit<CommentReport, 'id' | 'createdAt'>) => void;
  dismissPostReport: (reportId: string) => void;
  dismissCommentReport: (reportId: string) => void;
  
  // Getters
  getPostsByBoard: (boardType: BoardType, subject?: string) => Post[];
  getPostById: (postId: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (userId: string, password: string) => {
    // Teacher login
    if (userId === 'abc1234' && password === 'abc1234!') {
      const teacher = mockUsers.find(u => u.id === 'teacher-1');
      if (teacher) {
        set({ user: teacher, isAuthenticated: true });
        return true;
      }
    }
    
    // Student login (simplified - in production would check credentials)
    const student = mockUsers.find(u => u.email.includes(userId) || u.nickname === userId);
    if (student && password.length >= 6) {
      set({ user: student, isAuthenticated: true });
      return true;
    }
    
    return false;
  },
  
  signup: (email: string, nickname: string, realName: string) => {
    const newUser: User = {
      id: `student-${Date.now()}`,
      email,
      nickname,
      realName,
      role: 'student',
      createdAt: new Date(),
    };
    set({ user: newUser, isAuthenticated: true });
    return newUser;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export const useDataStore = create<DataState>((set, get) => ({
  posts: mockPosts,
  comments: mockComments,
  postReports: mockPostReports,
  commentReports: mockCommentReports,
  
  addPost: (postData) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      commentCount: 0,
    };
    set((state) => ({ posts: [newPost, ...state.posts] }));
    return newPost;
  },
  
  deletePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
      comments: state.comments.filter((c) => c.postId !== postId),
      postReports: state.postReports.filter((r) => r.postId !== postId),
      commentReports: state.commentReports.filter((r) => r.postId !== postId),
    }));
  },
  
  toggleNotice: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, isNotice: !p.isNotice } : p
      ),
    }));
  },
  
  incrementViewCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, viewCount: p.viewCount + 1 } : p
      ),
    }));
  },
  
  addComment: (commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date(),
    };
    set((state) => ({
      comments: [...state.comments, newComment],
      posts: state.posts.map((p) =>
        p.id === commentData.postId
          ? { ...p, commentCount: p.commentCount + 1 }
          : p
      ),
    }));
    return newComment;
  },
  
  deleteComment: (commentId) => {
    const comment = get().comments.find((c) => c.id === commentId);
    if (comment) {
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== commentId),
        posts: state.posts.map((p) =>
          p.id === comment.postId
            ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
            : p
        ),
        commentReports: state.commentReports.filter((r) => r.commentId !== commentId),
      }));
    }
  },
  
  reportPost: (reportData) => {
    const newReport: PostReport = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdAt: new Date(),
    };
    set((state) => ({ postReports: [...state.postReports, newReport] }));
  },
  
  reportComment: (reportData) => {
    const newReport: CommentReport = {
      ...reportData,
      id: `comment-report-${Date.now()}`,
      createdAt: new Date(),
    };
    set((state) => ({ commentReports: [...state.commentReports, newReport] }));
  },
  
  dismissPostReport: (reportId) => {
    set((state) => ({
      postReports: state.postReports.filter((r) => r.id !== reportId),
    }));
  },
  
  dismissCommentReport: (reportId) => {
    set((state) => ({
      commentReports: state.commentReports.filter((r) => r.id !== reportId),
    }));
  },
  
  getPostsByBoard: (boardType, subject) => {
    const { posts } = get();
    let filtered = posts.filter((p) => p.boardType === boardType);
    if (subject) {
      filtered = filtered.filter((p) => p.subject === subject);
    }
    // Sort: notices first, then by date
    return filtered.sort((a, b) => {
      if (a.isNotice && !b.isNotice) return -1;
      if (!a.isNotice && b.isNotice) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },
  
  getPostById: (postId) => {
    return get().posts.find((p) => p.id === postId);
  },
  
  getCommentsByPostId: (postId) => {
    return get().comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
}));

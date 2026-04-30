'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, useDataStore } from '@/lib/store';
import type { BoardType, Post } from '@/lib/types';
import { AuthPage } from '@/components/auth/auth-page';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { PostList } from '@/components/board/post-list';
import { PostDetail } from '@/components/board/post-detail';
import { WritePost } from '@/components/board/write-post';
import { TeacherDashboard } from '@/components/admin/teacher-dashboard';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ViewState = 'list' | 'detail' | 'write';

export function MainApp() {
  const { isAuthenticated, user } = useAuthStore();
  const incrementViewCount = useDataStore((state) => state.incrementViewCount);
  
  const [currentBoard, setCurrentBoard] = useState<BoardType>('free');
  const [currentSubject, setCurrentSubject] = useState<string | undefined>(undefined);
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Reset view when board changes
  useEffect(() => {
    setViewState('list');
    setSelectedPost(null);
    setShowDashboard(false);
  }, [currentBoard, currentSubject]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleBoardChange = (board: BoardType, subject?: string) => {
    setCurrentBoard(board);
    setCurrentSubject(subject);
    setShowDashboard(false);
  };

  const handlePostClick = (post: Post) => {
    incrementViewCount(post.id);
    setSelectedPost(post);
    setViewState('detail');
    setShowDashboard(false);
  };

  const handleWritePost = () => {
    setViewState('write');
    setShowDashboard(false);
  };

  const handleBack = () => {
    setViewState('list');
    setSelectedPost(null);
  };

  const handleWriteSuccess = () => {
    setViewState('list');
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
    setViewState('list');
    setSelectedPost(null);
  };

  const renderContent = () => {
    if (showDashboard && user?.role === 'teacher') {
      return <TeacherDashboard />;
    }

    switch (viewState) {
      case 'detail':
        return selectedPost ? (
          <PostDetail post={selectedPost} onBack={handleBack} />
        ) : null;
      case 'write':
        return (
          <WritePost
            boardType={currentBoard}
            subject={currentSubject}
            onBack={handleBack}
            onSuccess={handleWriteSuccess}
          />
        );
      default:
        return (
          <PostList
            boardType={currentBoard}
            subject={currentSubject}
            onPostClick={handlePostClick}
            onWritePost={handleWritePost}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <SidebarNav
        currentBoard={currentBoard}
        currentSubject={currentSubject}
        onBoardChange={handleBoardChange}
        onShowDashboard={handleShowDashboard}
        showDashboard={showDashboard}
      />

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              운암고등학교 커뮤니티
            </h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {user?.nickname.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-secondary-foreground">
                  {user?.nickname}
                </span>
                {user?.role === 'teacher' && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    선생님
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 max-w-4xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

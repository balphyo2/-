'use client';

import { useDataStore, useAuthStore } from '@/lib/store';
import type { BoardType, Post } from '@/lib/types';
import { BOARD_NAMES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PenSquare, Eye, MessageSquare, Pin, FileText } from 'lucide-react';

interface PostListProps {
  boardType: BoardType;
  subject?: string;
  onPostClick: (post: Post) => void;
  onWritePost: () => void;
}

export function PostList({ boardType, subject, onPostClick, onWritePost }: PostListProps) {
  const getPostsByBoard = useDataStore((state) => state.getPostsByBoard);
  const user = useAuthStore((state) => state.user);
  
  const posts = getPostsByBoard(boardType, subject);
  const isTeacher = user?.role === 'teacher';
  const canWrite = boardType !== 'teacher' || isTeacher;

  const getBoardTitle = () => {
    if (boardType === 'subject' && subject) {
      return `${subject} 게시판`;
    }
    return BOARD_NAMES[boardType];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground truncate">{getBoardTitle()}</h2>
        {canWrite && (
          <Button onClick={onWritePost} className="gap-2 shrink-0">
            <PenSquare className="h-4 w-4" />
            <span className="hidden sm:inline">글쓰기</span>
          </Button>
        )}
      </div>

      {/* Post List */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">게시글이 없습니다</p>
              {canWrite && (
                <Button variant="link" onClick={onWritePost} className="mt-2">
                  첫 글을 작성해보세요
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
              onClick={() => onPostClick(post)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {post.isNotice && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                          <Pin className="h-3 w-3" />
                          공지
                        </Badge>
                      )}
                      {post.subject && (
                        <Badge variant="outline" className="text-xs">
                          {post.subject}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-1 text-sm lg:text-base">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 lg:gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground/80">{post.authorName}</span>
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

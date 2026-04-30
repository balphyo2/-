'use client';

import { useDataStore, useAuthStore } from '@/lib/store';
import type { BoardType, Post } from '@/lib/types';
import { BOARD_NAMES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PenSquare, Eye, MessageSquare, Pin } from 'lucide-react';

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{getBoardTitle()}</h2>
        {canWrite && (
          <Button onClick={onWritePost} className="gap-2">
            <PenSquare className="h-4 w-4" />
            글쓰기
          </Button>
        )}
      </div>

      {/* Post List */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">게시글이 없습니다.</p>
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
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPostClick(post)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
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
                    <h3 className="font-semibold text-foreground truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
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

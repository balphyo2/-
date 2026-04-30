'use client';

import { useState } from 'react';
import { useDataStore, useAuthStore } from '@/lib/store';
import type { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, Pin, Eye, MessageSquare, Send, Flag, Trash2, MoreHorizontal } from 'lucide-react';
import { ReportDialog } from '@/components/report/report-dialog';
import { CommentReportDialog } from '@/components/report/comment-report-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export function PostDetail({ post, onBack }: PostDetailProps) {
  const [commentContent, setCommentContent] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [commentReportDialogOpen, setCommentReportDialogOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  
  const { getCommentsByPostId, addComment, deleteComment, toggleNotice, deletePost } = useDataStore();
  const user = useAuthStore((state) => state.user);
  
  const comments = getCommentsByPostId(post.id);
  const isTeacher = user?.role === 'teacher';
  const isAuthor = user?.id === post.authorId;

  const handleAddComment = () => {
    if (!commentContent.trim() || !user) return;

    addComment({
      postId: post.id,
      content: commentContent,
      authorId: user.id,
      authorName: user.nickname,
    });
    setCommentContent('');
  };

  const handleToggleNotice = () => {
    toggleNotice(post.id);
  };

  const handleDeletePost = () => {
    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      deletePost(post.id);
      onBack();
    }
  };

  const handleReportComment = (commentId: string) => {
    setSelectedCommentId(commentId);
    setCommentReportDialogOpen(true);
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      deleteComment(commentId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">뒤로 가기</span>
        </Button>
        <h2 className="text-lg lg:text-xl font-semibold text-foreground truncate">게시글</h2>
      </div>

      {/* Post Content */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 px-4 lg:px-6">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {post.isNotice && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                    <Pin className="h-3 w-3" />
                    공지
                  </Badge>
                )}
                {post.subject && (
                  <Badge variant="outline">{post.subject}</Badge>
                )}
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground break-words">{post.title}</h1>
            </div>
            
            {/* Actions Menu - Mobile Friendly */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">더보기</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isTeacher && (
                  <DropdownMenuItem onClick={handleToggleNotice}>
                    <Pin className="h-4 w-4 mr-2" />
                    {post.isNotice ? '공지 해제' : '공지 설정'}
                  </DropdownMenuItem>
                )}
                {(isTeacher || isAuthor) && (
                  <DropdownMenuItem onClick={handleDeletePost} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
                  <Flag className="h-4 w-4 mr-2" />
                  신고
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 text-sm text-muted-foreground pt-2 flex-wrap">
            <span className="font-medium text-foreground">{post.authorName}</span>
            <span className="hidden sm:inline">{format(new Date(post.createdAt), 'yyyy년 M월 d일 HH:mm', { locale: ko })}</span>
            <span className="sm:hidden">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.viewCount}
            </span>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 px-4 lg:px-6">
          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">댓글 {comments.length}개</h3>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4 px-4 lg:px-6">
          {/* Comment Input */}
          <div className="flex gap-2 lg:gap-3">
            <div className="flex-1">
              <Textarea
                placeholder="댓글을 입력하세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={2}
                className="resize-none bg-background text-sm"
              />
            </div>
            <Button
              onClick={handleAddComment}
              disabled={!commentContent.trim()}
              size="icon"
              className="self-end shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">댓글 작성</span>
            </Button>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-3 pt-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-medium text-sm text-foreground">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">더보기</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        {(isTeacher || user?.id === comment.authorId) && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleReportComment(comment.id)}>
                          <Flag className="h-4 w-4 mr-2" />
                          신고
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                아직 댓글이 없습니다
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Dialogs */}
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        postId={post.id}
      />
      
      {selectedCommentId && (
        <CommentReportDialog
          open={commentReportDialogOpen}
          onOpenChange={setCommentReportDialogOpen}
          commentId={selectedCommentId}
          postId={post.id}
        />
      )}
    </div>
  );
}

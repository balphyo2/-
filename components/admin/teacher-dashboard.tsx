'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { REPORT_CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Shield, FileText, MessageSquare, Trash2, X, AlertTriangle } from 'lucide-react';

export function TeacherDashboard() {
  const {
    posts,
    comments,
    postReports,
    commentReports,
    deletePost,
    deleteComment,
    dismissPostReport,
    dismissCommentReport,
  } = useDataStore();

  const [activeTab, setActiveTab] = useState('posts');

  const getPostById = (postId: string) => posts.find((p) => p.id === postId);
  const getCommentById = (commentId: string) => comments.find((c) => c.id === commentId);

  const handleDeleteReportedPost = (reportId: string, postId: string) => {
    if (confirm('이 게시글을 삭제하시겠습니까?')) {
      deletePost(postId);
      dismissPostReport(reportId);
    }
  };

  const handleDeleteReportedComment = (reportId: string, commentId: string) => {
    if (confirm('이 댓글을 삭제하시겠습니까?')) {
      deleteComment(commentId);
      dismissCommentReport(reportId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl lg:text-2xl font-bold text-foreground">신고 관리</h2>
          <p className="text-muted-foreground text-sm">신고된 게시글과 댓글을 관리합니다</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 lg:pt-6 px-3 lg:px-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl lg:text-2xl font-bold text-foreground">{postReports.length}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">신고된 게시글</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 lg:pt-6 px-3 lg:px-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl lg:text-2xl font-bold text-foreground">{commentReports.length}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">신고된 댓글</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="posts" className="gap-1 lg:gap-2 text-xs lg:text-sm py-2.5">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">신고된</span> 게시글 ({postReports.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-1 lg:gap-2 text-xs lg:text-sm py-2.5">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">신고된</span> 댓글 ({commentReports.length})
          </TabsTrigger>
        </TabsList>

        {/* Reported Posts Tab */}
        <TabsContent value="posts" className="mt-4">
          {postReports.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">신고된 게시글이 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {postReports.map((report) => {
                const post = getPostById(report.postId);
                if (!post) return null;

                return (
                  <Card key={report.id} className="border-0 shadow-sm">
                    <CardHeader className="pb-2 px-4 lg:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="destructive" className="text-xs">
                              {REPORT_CATEGORIES[report.category]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              신고자: {report.reporterName}
                            </span>
                          </div>
                          <CardTitle className="text-base break-words">{post.title}</CardTitle>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dismissPostReport(report.id)}
                            className="gap-1 text-xs lg:text-sm"
                          >
                            <X className="h-4 w-4" />
                            <span className="hidden sm:inline">무시</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReportedPost(report.id, report.postId)}
                            className="gap-1 text-xs lg:text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">삭제</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 lg:px-6">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2 break-words">
                        {post.content}
                      </p>
                      {report.reason && (
                        <p className="text-sm bg-secondary p-2 rounded break-words">
                          <span className="font-medium">신고 사유:</span> {report.reason}
                        </p>
                      )}
                      <div className="flex items-center gap-3 lg:gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                        <span>작성자: {post.authorName}</span>
                        <span>
                          신고일:{' '}
                          {formatDistanceToNow(new Date(report.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Reported Comments Tab */}
        <TabsContent value="comments" className="mt-4">
          {commentReports.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">신고된 댓글이 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {commentReports.map((report) => {
                const comment = getCommentById(report.commentId);
                const post = getPostById(report.postId);
                if (!comment || !post) return null;

                return (
                  <Card key={report.id} className="border-0 shadow-sm">
                    <CardHeader className="pb-2 px-4 lg:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="destructive" className="text-xs">
                              {REPORT_CATEGORIES[report.category]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              신고자: {report.reporterName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            게시글: {post.title}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dismissCommentReport(report.id)}
                            className="gap-1 text-xs lg:text-sm"
                          >
                            <X className="h-4 w-4" />
                            <span className="hidden sm:inline">무시</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReportedComment(report.id, report.commentId)}
                            className="gap-1 text-xs lg:text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">삭제</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 lg:px-6">
                      <p className="text-sm bg-secondary/50 p-3 rounded mb-2 break-words">
                        {comment.content}
                      </p>
                      {report.reason && (
                        <p className="text-sm bg-secondary p-2 rounded break-words">
                          <span className="font-medium">신고 사유:</span> {report.reason}
                        </p>
                      )}
                      <div className="flex items-center gap-3 lg:gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                        <span>댓글 작성자: {comment.authorName}</span>
                        <span>
                          신고일:{' '}
                          {formatDistanceToNow(new Date(report.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

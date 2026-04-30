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
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">신고 관리</h2>
          <p className="text-muted-foreground">신고된 게시글과 댓글을 관리합니다</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{postReports.length}</p>
                <p className="text-sm text-muted-foreground">신고된 게시글</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{commentReports.length}</p>
                <p className="text-sm text-muted-foreground">신고된 댓글</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            신고된 게시글 ({postReports.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            신고된 댓글 ({commentReports.length})
          </TabsTrigger>
        </TabsList>

        {/* Reported Posts Tab */}
        <TabsContent value="posts" className="mt-4">
          {postReports.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">신고된 게시글이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {postReports.map((report) => {
                const post = getPostById(report.postId);
                if (!post) return null;

                return (
                  <Card key={report.id} className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              {REPORT_CATEGORIES[report.category]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              신고자: {report.reporterName}
                            </span>
                          </div>
                          <CardTitle className="text-base">{post.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dismissPostReport(report.id)}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            무시
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReportedPost(report.id, report.postId)}
                            className="gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.content}
                      </p>
                      {report.reason && (
                        <p className="text-sm bg-secondary p-2 rounded">
                          <span className="font-medium">신고 사유:</span> {report.reason}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
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
                <p className="text-muted-foreground">신고된 댓글이 없습니다.</p>
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
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              {REPORT_CATEGORIES[report.category]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              신고자: {report.reporterName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            게시글: {post.title}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dismissCommentReport(report.id)}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            무시
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReportedComment(report.id, report.commentId)}
                            className="gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm bg-secondary/50 p-3 rounded mb-2">
                        {comment.content}
                      </p>
                      {report.reason && (
                        <p className="text-sm bg-secondary p-2 rounded">
                          <span className="font-medium">신고 사유:</span> {report.reason}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
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

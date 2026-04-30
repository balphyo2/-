'use client';

import { useState } from 'react';
import { useDataStore, useAuthStore } from '@/lib/store';
import type { BoardType } from '@/lib/types';
import { SUBJECTS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Send } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

interface WritePostProps {
  boardType: BoardType;
  subject?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function WritePost({ boardType, subject, onBack, onSuccess }: WritePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subject || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPost = useDataStore((state) => state.addPost);
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;

    if (boardType === 'subject' && !selectedSubject) {
      alert('과목을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    addPost({
      title: title.trim(),
      content: content.trim(),
      authorId: user.id,
      authorName: user.nickname,
      boardType,
      subject: boardType === 'subject' ? selectedSubject : undefined,
      isNotice: false,
    });

    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">뒤로 가기</span>
        </Button>
        <h2 className="text-lg lg:text-xl font-semibold text-foreground">글쓰기</h2>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="px-4 lg:px-6">
          <CardTitle className="text-lg">새 게시글 작성</CardTitle>
        </CardHeader>
        <CardContent className="px-4 lg:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              {boardType === 'subject' && (
                <Field>
                  <FieldLabel htmlFor="subject">과목 선택</FieldLabel>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="과목을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="title">제목</FieldLabel>
                <Input
                  id="title"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-background"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="content">내용</FieldLabel>
                <Textarea
                  id="content"
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                  className="resize-none bg-background"
                />
              </Field>
            </FieldGroup>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={onBack}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    게시 중...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    게시하기
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

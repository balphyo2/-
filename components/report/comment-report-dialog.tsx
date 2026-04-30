'use client';

import { useState } from 'react';
import { useDataStore, useAuthStore } from '@/lib/store';
import { REPORT_CATEGORIES, type ReportCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Flag } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

interface CommentReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commentId: string;
  postId: string;
}

export function CommentReportDialog({ open, onOpenChange, commentId, postId }: CommentReportDialogProps) {
  const [category, setCategory] = useState<ReportCategory>('inappropriate');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportComment = useDataStore((state) => state.reportComment);
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    reportComment({
      commentId,
      postId,
      reporterId: user.id,
      reporterName: user.nickname,
      category,
      reason: reason.trim() || undefined,
    });

    setIsSubmitting(false);
    setCategory('inappropriate');
    setReason('');
    onOpenChange(false);
    alert('댓글 신고가 접수되었습니다.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Flag className="h-5 w-5 text-destructive" />
            댓글 신고
          </DialogTitle>
          <DialogDescription>
            신고 사유를 선택해주세요. 허위 신고 시 불이익을 받을 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="py-4">
          <Field>
            <FieldLabel>신고 사유</FieldLabel>
            <RadioGroup value={category} onValueChange={(v) => setCategory(v as ReportCategory)} className="mt-2">
              {Object.entries(REPORT_CATEGORIES).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`comment-${key}`} />
                  <label htmlFor={`comment-${key}`} className="text-sm font-normal cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="comment-reason">상세 사유 (선택)</FieldLabel>
            <Textarea
              id="comment-reason"
              placeholder="추가 설명이 있으면 작성해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </Field>
        </FieldGroup>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? '신고 중...' : '신고하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

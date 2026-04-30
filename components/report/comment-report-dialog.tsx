'use client';

import { useState } from 'react';
import { useDataStore, useAuthStore } from '@/lib/store';
import { REPORT_CATEGORIES, type ReportCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

    // Simulate network delay
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Flag className="h-5 w-5 text-destructive" />
            댓글 신고
          </DialogTitle>
          <DialogDescription>
            신고 사유를 선택해주세요. 허위 신고 시 불이익을 받을 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-foreground">신고 사유</Label>
            <RadioGroup value={category} onValueChange={(v) => setCategory(v as ReportCategory)}>
              {Object.entries(REPORT_CATEGORIES).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`comment-${key}`} />
                  <Label htmlFor={`comment-${key}`} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment-reason" className="text-foreground">상세 사유 (선택)</Label>
            <Textarea
              id="comment-reason"
              placeholder="추가 설명이 있으면 작성해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
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

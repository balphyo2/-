'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { AlertCircle, CheckCircle2, Mail, UserPlus } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [realName, setRealName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Email verification states
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const signup = useAuthStore((state) => state.signup);

  const handleSendVerification = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    if (!email.includes('@')) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate sending verification email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsVerificationSent(true);
    setShowOtpModal(true);
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    
    // Simulate OTP verification (accept any 6-digit code for demo)
    if (otpValue.length !== 6) {
      setOtpError('6자리 인증 코드를 입력해주세요.');
      return;
    }
    
    // For demo: accept "123456" or any 6-digit number
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsVerified(true);
    setShowOtpModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    signup(email, nickname, realName);
    setIsLoading(false);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-2xl font-bold text-primary">회원가입</CardTitle>
          <CardDescription className="text-muted-foreground">
            운암고등학교 커뮤니티에 가입하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">학교 이메일</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="2024000@unam.hs.kr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsVerified(false);
                    setIsVerificationSent(false);
                  }}
                  required
                  disabled={isVerified}
                  className="flex-1 bg-background border-input"
                />
                <Button
                  type="button"
                  variant={isVerified ? "secondary" : "outline"}
                  onClick={handleSendVerification}
                  disabled={isLoading || isVerified}
                  className="shrink-0"
                >
                  {isVerified ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      인증완료
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      인증하기
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                (예: 2024000... 형식의 학교 이메일을 입력하세요)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="realName" className="text-foreground">실명</Label>
              <Input
                id="realName"
                type="text"
                placeholder="홍길동"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                required
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-foreground">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="사용할 닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="bg-background border-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="6자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background border-input"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !isVerified}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  가입 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  회원가입
                </span>
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline font-medium"
              >
                로그인
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">이메일 인증</DialogTitle>
            <DialogDescription className="text-center">
              {email}로 전송된 6자리 인증 코드를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            
            {otpError && (
              <p className="text-sm text-destructive">{otpError}</p>
            )}
            
            <p className="text-xs text-muted-foreground text-center">
              테스트: 아무 6자리 숫자나 입력하세요 (예: 123456)
            </p>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowOtpModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleVerifyOtp}
                className="flex-1"
                disabled={otpValue.length !== 6}
              >
                인증 확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

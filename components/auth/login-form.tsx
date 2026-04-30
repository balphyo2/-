'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(userId, password);
    
    if (!success) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-2xl font-bold text-primary">로그인</CardTitle>
        <CardDescription className="text-muted-foreground">
          운암고등학교 커뮤니티에 오신 것을 환영합니다
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
          
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="userId">아이디</FieldLabel>
              <Input
                id="userId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="bg-background border-input"
              />
            </Field>
            
            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-input"
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                로그인 중...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                로그인
              </span>
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary hover:underline font-medium"
            >
              회원가입
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

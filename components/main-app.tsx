'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, Loader2 } from 'lucide-react';

export function MainApp() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginFields, setLoginFields] = useState({ id: '', pw: '' });
  const [signupFields, setSignupFields] = useState({ 
    email: '', 
    name: '', 
    id: '', 
    pw: '' 
  });

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, type: 'login' | 'signup') => {
    const { name, value } = e.target;
    if (type === 'login') {
      setLoginFields(prev => ({ ...prev, [name]: value }));
    } else {
      setSignupFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const onLoginSubmit = () => {
    if (!loginFields.id) return alert("아이디를 입력하세요.");
    setIsLoading(true);
    setTimeout(() => {
      alert(`로그인 성공: ${loginFields.id}님 환영합니다!`);
      setIsLoading(false);
      closeAll();
    }, 1000);
  };

  const onSignupSubmit = () => {
    alert(`가입 완료: ${signupFields.name}님, 이메일(${signupFields.email})을 확인해주세요.`);
    closeAll();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* 네비게이션 바 */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.location.href='/'}
          >
            <Image 
              src="/assets/image/logo.png" 
              alt="UTime Logo" 
              width={50} 
              height={60}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsLoginOpen(true)}
            >
              로그인
            </Button>
            <Button 
              onClick={() => setIsSignupOpen(true)}
            >
              회원가입
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          UTime 커뮤니티
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          함께 시간을 공유하는 공간입니다.
        </p>
      </main>

      {/* 로그인 모달 */}
      {isLoginOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeAll()}
        >
          <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <button 
              onClick={closeAll}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">닫기</span>
            </button>
            
            <div className="flex flex-col space-y-1.5 text-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">로그인</h2>
              <p className="text-sm text-muted-foreground">
                커뮤니티로 돌아오신 것을 환영합니다.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Input 
                type="text" 
                name="id" 
                placeholder="아이디" 
                value={loginFields.id} 
                onChange={(e) => handleInputChange(e, 'login')} 
              />
              <Input 
                type="password" 
                name="pw" 
                placeholder="비밀번호" 
                value={loginFields.pw} 
                onChange={(e) => handleInputChange(e, 'login')} 
              />
              <Button className="w-full" onClick={onLoginSubmit}>
                UTime 로그인
              </Button>
            </div>
            
            <p className="mt-4 text-center text-sm text-muted-foreground">
              UTime이 처음이신가요?{' '}
              <button 
                className="font-medium text-primary hover:underline"
                onClick={() => {setIsLoginOpen(false); setIsSignupOpen(true);}}
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {isSignupOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeAll()}
        >
          <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <button 
              onClick={closeAll}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">닫기</span>
            </button>
            
            <div className="flex flex-col space-y-1.5 text-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">회원가입</h2>
              <p className="text-sm text-muted-foreground">
                가입하여 나만의 관심사를 공유해보세요.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  name="email" 
                  placeholder="학교 이메일 주소" 
                  value={signupFields.email} 
                  onChange={(e) => handleInputChange(e, 'signup')}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => alert("인증코드가 발송되었습니다.")}
                  className="shrink-0"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  인증하기
                </Button>
              </div>
              <Input 
                type="text" 
                name="name" 
                placeholder="이름" 
                value={signupFields.name}
                onChange={(e) => handleInputChange(e, 'signup')} 
              />
              <Input 
                type="text" 
                name="id" 
                placeholder="아이디" 
                value={signupFields.id}
                onChange={(e) => handleInputChange(e, 'signup')} 
              />
              <Input 
                type="password" 
                name="pw" 
                placeholder="비밀번호" 
                value={signupFields.pw}
                onChange={(e) => handleInputChange(e, 'signup')} 
              />
              <Button className="w-full" onClick={onSignupSubmit}>
                UTime 가입하기
              </Button>
            </div>
            
            <p className="mt-4 text-center text-sm text-muted-foreground">
              이미 회원이신가요?{' '}
              <button 
                className="font-medium text-primary hover:underline"
                onClick={() => {setIsSignupOpen(false); setIsLoginOpen(true);}}
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

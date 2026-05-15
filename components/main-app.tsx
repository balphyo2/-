'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, Loader2 } from 'lucide-react';
import '@/styles/main.css';

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
    <div className="page-container">
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="loading-overlay">
          <Loader2 className="loading-spinner" />
        </div>
      )}

      {/* 네비게이션 바 */}
      <header className="nav-header">
        <div className="nav-container">
          <div 
            className="nav-logo" 
            onClick={() => window.location.href='/'}
          >
            <Image 
              src="/assets/image/logo.png" 
              alt="UTime Logo" 
              width={50} 
              height={60}
            />
          </div>
          <div className="nav-buttons">
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
      <main className="main-content">
        <h1 className="main-title">
          UTime 커뮤니티
        </h1>
        <p className="main-subtitle">
          함께 시간을 공유하는 공간입니다.
        </p>
      </main>

      {/* 로그인 모달 */}
      {isLoginOpen && (
        <div 
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeAll()}
        >
          <div className="modal-container">
            <button 
              onClick={closeAll}
              className="modal-close"
            >
              <X className="modal-close-icon" />
              <span className="sr-only">닫기</span>
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">로그인</h2>
              <p className="modal-description">
                커뮤니티로 돌아오신 것을 환영합니다.
              </p>
            </div>
            
            <div className="modal-form">
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
            
            <p className="modal-footer">
              UTime이 처음이신가요?{' '}
              <button 
                className="modal-footer-link"
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
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeAll()}
        >
          <div className="modal-container">
            <button 
              onClick={closeAll}
              className="modal-close"
            >
              <X className="modal-close-icon" />
              <span className="sr-only">닫기</span>
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">회원가입</h2>
              <p className="modal-description">
                가입하여 나만의 관심사를 공유해보세요.
              </p>
            </div>
            
            <div className="modal-form">
              <div className="modal-email-row">
                <Input 
                  type="email" 
                  name="email" 
                  placeholder="학교 이메일 주소" 
                  value={signupFields.email} 
                  onChange={(e) => handleInputChange(e, 'signup')}
                  className="modal-email-input"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => alert("인증코드가 발송되었습니다.")}
                  className="modal-verify-btn"
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
            
            <p className="modal-footer">
              이미 회원이신가요?{' '}
              <button 
                className="modal-footer-link"
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

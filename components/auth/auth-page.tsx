'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { GraduationCap } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">운암고등학교</h1>
            <p className="text-muted-foreground text-sm lg:text-base mt-1">커뮤니티</p>
          </div>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

'use client';

import { useAuthStore } from '@/lib/store';
import type { BoardType } from '@/lib/types';
import { BOARD_NAMES, SUBJECTS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  GraduationCap,
  MessageSquare,
  BookOpen,
  Users,
  Shield,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  currentBoard: BoardType;
  currentSubject?: string;
  onBoardChange: (board: BoardType, subject?: string) => void;
  onShowDashboard: () => void;
  showDashboard: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarNav({
  currentBoard,
  currentSubject,
  onBoardChange,
  onShowDashboard,
  showDashboard,
  isOpen,
  onClose,
}: SidebarNavProps) {
  const { user, logout } = useAuthStore();
  const isTeacher = user?.role === 'teacher';

  const handleBoardChange = (board: BoardType, subject?: string) => {
    onBoardChange(board, subject);
    onClose();
  };

  const handleShowDashboard = () => {
    onShowDashboard();
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-72 lg:w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">운암고등학교</h1>
              <p className="text-xs text-sidebar-foreground/70">커뮤니티</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">메뉴 닫기</span>
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {/* Free Board */}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-11",
                currentBoard === 'free' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => handleBoardChange('free')}
            >
              <MessageSquare className="h-5 w-5" />
              {BOARD_NAMES.free}
            </Button>

            {/* Subject Board with Collapsible */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-11",
                    currentBoard === 'subject' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5" />
                    {BOARD_NAMES.subject}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                {SUBJECTS.map((subject) => (
                  <Button
                    key={subject}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9",
                      currentBoard === 'subject' && currentSubject === subject && !showDashboard &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    onClick={() => handleBoardChange('subject', subject)}
                  >
                    {subject}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Teacher Board */}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-11",
                currentBoard === 'teacher' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => handleBoardChange('teacher')}
            >
              <Users className="h-5 w-5" />
              {BOARD_NAMES.teacher}
            </Button>

            {/* Teacher Dashboard */}
            {isTeacher && (
              <>
                <Separator className="my-3 bg-sidebar-border" />
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-11",
                    showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={handleShowDashboard}
                >
                  <Shield className="h-5 w-5" />
                  신고 관리
                </Button>
              </>
            )}
          </nav>
        </ScrollArea>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-semibold text-sidebar-accent-foreground">
                  {user?.nickname.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.nickname}</p>
                <p className="text-xs text-sidebar-foreground/70">
                  {user?.role === 'teacher' ? '선생님' : '학생'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">로그아웃</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

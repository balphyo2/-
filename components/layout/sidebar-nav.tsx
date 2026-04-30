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
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  currentBoard: BoardType;
  currentSubject?: string;
  onBoardChange: (board: BoardType, subject?: string) => void;
  onShowDashboard: () => void;
  showDashboard: boolean;
}

export function SidebarNav({
  currentBoard,
  currentSubject,
  onBoardChange,
  onShowDashboard,
  showDashboard,
}: SidebarNavProps) {
  const { user, logout } = useAuthStore();
  const isTeacher = user?.role === 'teacher';

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-sidebar-foreground">운암고등학교</h1>
          <p className="text-xs text-sidebar-foreground/70">학교 커뮤니티</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {/* Home */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              currentBoard === 'free' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => onBoardChange('free')}
          >
            <Home className="h-4 w-4" />
            홈
          </Button>

          {/* Free Board */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              currentBoard === 'free' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => onBoardChange('free')}
          >
            <MessageSquare className="h-4 w-4" />
            {BOARD_NAMES.free}
          </Button>

          {/* Subject Board with Collapsible */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  currentBoard === 'subject' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4" />
                  {BOARD_NAMES.subject}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 mt-1 space-y-1">
              {SUBJECTS.map((subject) => (
                <Button
                  key={subject}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    currentBoard === 'subject' && currentSubject === subject && !showDashboard &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={() => onBoardChange('subject', subject)}
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
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              currentBoard === 'teacher' && !showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => onBoardChange('teacher')}
          >
            <Users className="h-4 w-4" />
            {BOARD_NAMES.teacher}
          </Button>

          {/* Teacher Dashboard */}
          {isTeacher && (
            <>
              <Separator className="my-2 bg-sidebar-border" />
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  showDashboard && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={onShowDashboard}
              >
                <Shield className="h-4 w-4" />
                신고 관리
              </Button>
            </>
          )}
        </nav>
      </ScrollArea>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-accent-foreground">
                {user?.nickname.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">{user?.nickname}</p>
              <p className="text-xs text-sidebar-foreground/70">
                {user?.role === 'teacher' ? '선생님' : '학생'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

"use client"

import { useState } from "react"
import {
  Search,
  Menu,
  X,
  Bell,
  MessageSquare,
  Calendar,
  BookOpen,
  Calculator,
  Globe,
  Microscope,
  Compass,
  Users,
  AlertTriangle,
  Trash2,
  UserX,
  Shield,
  ChevronRight,
  Plus,
  LogOut,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Hardcoded Admin Accounts
const ADMIN_ACCOUNTS = [
  { id: "unam_admin1", nickname: "운암고 게시판 관리인", password: "unamhs2026!" },
  { id: "unam_admin2", nickname: "운암고 생활 청소부", password: "unamhs2026!" },
  { id: "unam_admin3", nickname: "운암고 1황", password: "unamhs2026!" },
]

// Categories
const CATEGORIES = [
  { id: "free", name: "자유게시판", icon: MessageSquare },
  { id: "notice", name: "학사일정 공지", icon: Calendar },
  { id: "korean", name: "국어", icon: BookOpen },
  { id: "math", name: "수학", icon: Calculator },
  { id: "english", name: "영어", icon: Globe },
  { id: "social", name: "사탐", icon: Users },
  { id: "science", name: "과탐", icon: Microscope },
  { id: "career", name: "진로/상담", icon: Compass },
]

// Mock Posts Data
const MOCK_POSTS = [
  { id: 1, title: "내일 체육대회 준비물 뭐예요?", category: "free", author: "익명의 학생1", date: "2026-05-28", hasReports: false },
  { id: 2, title: "중간고사 범위 정리해봤습니다", category: "korean", author: "공부벌레", date: "2026-05-27", hasReports: true },
  { id: 3, title: "수학 문제 질문드립니다", category: "math", author: "수포자탈출", date: "2026-05-27", hasReports: false },
  { id: 4, title: "영어 에세이 첨삭 부탁드려요", category: "english", author: "영어마스터", date: "2026-05-26", hasReports: false },
  { id: 5, title: "진로상담 신청 방법 알려주세요", category: "career", author: "고민이많아", date: "2026-05-26", hasReports: true },
  { id: 6, title: "과학 실험 보고서 양식 공유", category: "science", author: "과학덕후", date: "2026-05-25", hasReports: false },
  { id: 7, title: "학사일정 변경 안내", category: "notice", author: "운암고 게시판 관리인", date: "2026-05-25", hasReports: false },
  { id: 8, title: "동아리 모집 공고", category: "free", author: "동아리장", date: "2026-05-24", hasReports: false },
]

// Mock Reports Data
const MOCK_REPORTS = [
  { id: 1, type: "post", targetId: 2, title: "중간고사 범위 정리해봤습니다", reason: "불법 광고 (도박/마약 등)", reporter: "익명", date: "2026-05-27" },
  { id: 2, type: "comment", targetId: 5, title: "진로상담 신청 방법 알려주세요", reason: "욕설/비방", reporter: "익명", date: "2026-05-26" },
  { id: 3, type: "post", targetId: 8, title: "동아리 모집 공고", reason: "기타", reporter: "익명", date: "2026-05-24" },
]

// Report Reasons
const REPORT_REASONS = [
  { id: "abuse", label: "욕설/비방" },
  { id: "illegal", label: "불법 광고 (도박/마약 등)" },
  { id: "harassment", label: "성희롱" },
  { id: "other", label: "기타" },
]

interface User {
  id: string
  nickname: string
  isAdmin: boolean
}

export function CommunityBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("free")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{ id: number; title: string; type: "post" | "comment" } | null>(null)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  
  // Mock logged in user (change this to test admin functionality)
  const [currentUser] = useState<User>(() => {
    const admin = ADMIN_ACCOUNTS[0]
    return { id: admin.id, nickname: admin.nickname, isAdmin: true }
  })

  const getCategoryName = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
  }

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      free: "bg-blue-100 text-blue-700",
      notice: "bg-red-100 text-red-700",
      korean: "bg-emerald-100 text-emerald-700",
      math: "bg-purple-100 text-purple-700",
      english: "bg-amber-100 text-amber-700",
      social: "bg-pink-100 text-pink-700",
      science: "bg-cyan-100 text-cyan-700",
      career: "bg-orange-100 text-orange-700",
    }
    return colors[categoryId] || "bg-gray-100 text-gray-700"
  }

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleReport = (postId: number, title: string, type: "post" | "comment" = "post") => {
    setReportTarget({ id: postId, title, type })
    setSelectedReasons([])
    setReportModalOpen(true)
  }

  const handleSubmitReport = () => {
    if (selectedReasons.length > 0 && reportTarget) {
      console.log("[v0] Report submitted:", { target: reportTarget, reasons: selectedReasons })
      setReportModalOpen(false)
      setReportTarget(null)
      setSelectedReasons([])
    }
  }

  const toggleReason = (reasonId: string) => {
    setSelectedReasons(prev =>
      prev.includes(reasonId)
        ? prev.filter(r => r !== reasonId)
        : [...prev, reasonId]
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left - Logo & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-foreground">운암고 자율게시판</h1>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-secondary border-0"
              />
            </div>
          </div>

          {/* Right - User Profile & Admin Toggle */}
          <div className="flex items-center gap-2">
            {currentUser.isAdmin && (
              <Button
                variant={isAdminMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsAdminMode(!isAdminMode)
                  if (!isAdminMode) setShowAdminDashboard(false)
                }}
                className="hidden sm:flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden lg:inline">관리자 모드</span>
              </Button>
            )}
            
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {currentUser.nickname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-foreground max-w-[120px] truncate">
                    {currentUser.nickname}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2">
                  <Users className="w-4 h-4" />
                  내 프로필
                </DropdownMenuItem>
                {currentUser.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => setIsAdminMode(!isAdminMode)}
                    >
                      <Shield className="w-4 h-4" />
                      {isAdminMode ? "일반 모드로 전환" : "관리자 모드"}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-secondary border-0"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-0 w-64 h-full lg:h-[calc(100vh-4rem)] bg-card border-r border-border transition-transform duration-300 overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="p-4">
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="font-semibold text-foreground">카테고리</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Dashboard Button */}
            {isAdminMode && currentUser.isAdmin && (
              <Button
                variant={showAdminDashboard ? "default" : "outline"}
                className="w-full mb-4 justify-start gap-2"
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
              >
                <Shield className="w-4 h-4" />
                관리자 대시보드
              </Button>
            )}

            {/* Categories */}
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setShowAdminDashboard(false)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === "all" && !showAdminDashboard
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Home className="w-4 h-4" />
                전체 게시판
              </button>

              {CATEGORIES.map((category) => {
                const Icon = category.icon
                const isNotice = category.id === "notice"
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setShowAdminDashboard(false)
                        setSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        selectedCategory === category.id && !showAdminDashboard
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {category.name}
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                    
                    {/* Admin Notice Button */}
                    {isNotice && isAdminMode && currentUser.isAdmin && selectedCategory === "notice" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 ml-7 justify-start gap-2 text-xs border-dashed"
                      >
                        <Plus className="w-3 h-3" />
                        학사공지 작성
                      </Button>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {showAdminDashboard && isAdminMode ? (
            /* Admin Dashboard */
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">관리자 대시보드</h2>
                <p className="text-muted-foreground mt-1">신고된 게시글 및 댓글을 관리합니다</p>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">유형</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">제목</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">신고 사유</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">신고일</th>
                        <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {MOCK_REPORTS.map((report) => (
                        <tr key={report.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              {report.type === "post" ? "게시글" : "댓글"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-foreground font-medium line-clamp-1">
                              {report.title}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              {report.reason}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-muted-foreground">{report.date}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                <Trash2 className="w-3 h-3" />
                                {report.type === "post" ? "게시글 삭제" : "댓글 삭제"}
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs text-destructive hover:text-destructive">
                                <UserX className="w-3 h-3" />
                                사용자 제재
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {MOCK_REPORTS.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    신고된 내용이 없습니다
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Posts List */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedCategory === "all" ? "전체 게시판" : getCategoryName(selectedCategory)}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {filteredPosts.length}개의 게시글
                  </p>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">글쓰기</span>
                </Button>
              </div>

              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs font-medium", getCategoryColor(post.category))}>
                            {getCategoryName(post.category)}
                          </Badge>
                          {post.hasReports && isAdminMode && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                              신고됨
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{post.author}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReport(post.id, post.title)
                        }}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">신고</span>
                      </Button>
                    </div>
                  </article>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    게시글이 없습니다
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              게시글 신고
            </DialogTitle>
            <DialogDescription className="text-left">
              {reportTarget && (
                <span className="block mt-2 p-3 bg-secondary rounded-lg text-sm text-foreground line-clamp-2">
                  {`"${reportTarget.title}"`}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm font-medium text-foreground mb-3">신고 사유를 선택해주세요</p>
            <div className="space-y-3">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedReasons.includes(reason.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary/50"
                  )}
                >
                  <Checkbox
                    checked={selectedReasons.includes(reason.id)}
                    onCheckedChange={() => toggleReason(reason.id)}
                  />
                  <span className="text-sm text-foreground">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={selectedReasons.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              신고하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Send, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addComplianceComment } from "../../app/dashboard/compliance/[id]/actions"

interface Comment {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
}

interface ComplianceCommentsProps {
    reportId: string;
    initialComments: Comment[];
    currentUserEmail: string;
}

export function ComplianceComments({ reportId, initialComments, currentUserEmail }: ComplianceCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            // Optimistic update
            const tempComment: Comment = {
                id: Math.random().toString(),
                userId: currentUserEmail,
                content: newComment,
                createdAt: new Date(),
            }
            setComments(prev => [tempComment, ...prev])
            setNewComment("")

            // Server call
            await addComplianceComment(reportId, newComment, currentUserEmail)
            router.refresh()
        } catch (error) {
            console.error("Failed to add comment:", error)
            // Revert optimistic update on failure
            setComments(initialComments)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <ScrollArea className="flex-1 pr-4 -mr-4 h-[300px]">
                {comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-sm transition-all duration-200">
                                <Avatar className="h-10 w-10 border border-indigo-100 bg-indigo-50/50">
                                    <AvatarFallback className="text-indigo-600 font-semibold bg-transparent">
                                        {comment.userId.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1.5 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold truncate text-slate-900">{comment.userId}</span>
                                        <span className="text-xs text-slate-500 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4 space-y-3">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <User className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-900">No comments yet</p>
                            <p className="text-xs text-slate-500 max-w-[200px]">Start the conversation by leaving an internal review comment below.</p>
                        </div>
                    </div>
                )}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="pt-4 border-t relative shrink-0">
                <Textarea
                    placeholder="Write an internal review comment... (Press Enter to send)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[80px] resize-none pr-12 text-sm leading-relaxed bg-white border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!newComment.trim() || isSubmitting}
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-200"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}

'use client'
import React, { useEffect, useState } from 'react'
import { withClientAction } from '@/lib/helper/with-client-action'
import { getTodoById, markChecklistItem, changeTodoStatus } from '@/server/to-do-action'
import type { ITodo, ITodoStatusChangeable } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  PlayCircle, 
  CheckCheck, 
  XCircle,
  Loader2,
  Calendar,
  Flag,
  Tag,
  FileText,
  Repeat,
  Flame,
  AlertCircle,
  Leaf,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckSquare
} from 'lucide-react'
import { toast } from 'sonner'
import { statusColor, priorityColor } from '@/lib/color'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TodoDetailedProps {
  todoId: string
  isOpen?: boolean
  setOpen?: (open: boolean) => void
  onUpdate?: () => void
}

function TodoDetailedPopup({ todoId, isOpen = true, setOpen, onUpdate }: TodoDetailedProps) {
  const [todo, setTodo] = useState<ITodo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingChecklistId, setUpdatingChecklistId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchTodo = async () => {
    setLoading(true)
    setError(null)

    const data = await withClientAction(() =>
      getTodoById({ id: todoId }))

    if (!data) {
      setError("Could not load Todo")
    } else {
      setTodo(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!todoId) return
    fetchTodo()
  }, [todoId])

  const handleChecklistToggle = async (checklistItemId: string) => {
    if (!todo) return
    
    setUpdatingChecklistId(checklistItemId)
    
    try {
      const updatedTodo = await withClientAction(() =>
        markChecklistItem({ todoId: todo.id, checklistItemId }), true
      )
      
      if (updatedTodo) {
        setTodo(updatedTodo)
        toast.success("Checklist item updated!")
        onUpdate?.()
      }
    } catch (err) {
      toast.error("Failed to update checklist item")
    } finally {
      setUpdatingChecklistId(null)
    }
  }

  const handleStatusChange = async (newStatus: ITodoStatusChangeable) => {
    if (!todo) return
    
    setUpdatingStatus(true)
    
    try {
      const updatedTodo = await withClientAction(() =>
        changeTodoStatus({ id: todo.id, status: newStatus }), true
      )
      
      if (updatedTodo) {
        setTodo(updatedTodo)
        toast.success("Status updated!")
        onUpdate?.()
      }
    } catch (err) {
      toast.error("Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLAN':
        return <Clock className={`h-4 w-4 ${statusColor.PLAN}`} />
      case 'PENDING':
        return <PlayCircle className={`h-4 w-4 ${statusColor.PENDING}`} />
      case 'DONE':
        return <CheckCheck className={`h-4 w-4 ${statusColor.DONE}`} />
      case 'CANCELLED':
        return <XCircle className={`h-4 w-4 ${statusColor.CANCELLED}`} />
      case 'OVERDUE':
        return <AlertTriangle className={`h-4 w-4 ${statusColor.OVERDUE}`} />
      case 'ARCHIVED':
        return <Layers className={`h-4 w-4 ${statusColor.ARCHIVED}`} />
      default:
        return null
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <Flame className={`h-4 w-4 ${priorityColor.HIGH}`} />
      case 'MEDIUM':
        return <AlertCircle className={`h-4 w-4 ${priorityColor.MEDIUM}`} />
      case 'LOW':
        return <Leaf className={`h-4 w-4 ${priorityColor.LOW}`} />
      default:
        return <Layers className={`h-4 w-4 ${priorityColor.NONE}`} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error || !todo ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="text-destructive font-medium">{error || "Todo not found"}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-primary mt-1 shrink-0" />
                <span className="flex-1">{todo.title}</span>
              </DialogTitle>
              {todo.description && (
                <DialogDescription className="text-base pt-2">
                  {todo.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <Separator className="my-4" />

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Status and Priority Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Card */}
                <Card className="transition-all duration-300 hover:shadow-lg group">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      {getStatusIcon(todo.status)}
                      <span>Current Status</span>
                    </div>
                    <Select
                      value={todo.status}
                      onValueChange={(value) => handleStatusChange(value as ITodoStatusChangeable)}
                      disabled={updatingStatus || todo.status === 'OVERDUE' || todo.status === 'ARCHIVED'}
                    >
                      <SelectTrigger className="h-11 transition-all duration-300 hover:border-primary/50">
                        <SelectValue>
                          <span className="flex items-center gap-2">
                            {getStatusIcon(todo.status)}
                            <span className={statusColor[todo.status as keyof typeof statusColor]}>
                              {todo.status}
                            </span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLAN">
                          <span className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${statusColor.PLAN}`} />
                            <span className={statusColor.PLAN}>Planning</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="PENDING">
                          <span className="flex items-center gap-2">
                            <PlayCircle className={`h-4 w-4 ${statusColor.PENDING}`} />
                            <span className={statusColor.PENDING}>In Progress</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="DONE">
                          <span className="flex items-center gap-2">
                            <CheckCheck className={`h-4 w-4 ${statusColor.DONE}`} />
                            <span className={statusColor.DONE}>Completed</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="CANCELLED">
                          <span className="flex items-center gap-2">
                            <XCircle className={`h-4 w-4 ${statusColor.CANCELLED}`} />
                            <span className={statusColor.CANCELLED}>Cancelled</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Priority Card */}
                {todo.priority && (
                  <Card className="transition-all duration-300 hover:shadow-lg group">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        {getPriorityIcon(todo.priority)}
                        <span>Priority Level</span>
                      </div>
                      <div className="flex items-center gap-3 h-11">
                        {getPriorityIcon(todo.priority)}
                        <span className={`text-lg font-semibold ${priorityColor[todo.priority as keyof typeof priorityColor]}`}>
                          {todo.priority}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Date and Time Section */}
              {(todo.dueDate || todo.dueTime) && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Due Information</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todo.dueDate && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 transition-all duration-300 hover:bg-muted/50">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">Date</div>
                            <div className="font-medium">{new Date(todo.dueDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</div>
                          </div>
                        </div>
                      )}
                      {todo.dueTime && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 transition-all duration-300 hover:bg-muted/50">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">Time</div>
                            <div className="font-medium">{todo.dueTime}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags Section */}
              {todo.tags && todo.tags.length > 0 && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                      <Tag className="h-4 w-4" />
                      <span>Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {todo.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="px-3 py-1 transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Renewal Section */}
              {todo.renewInterval && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                      <Repeat className="h-4 w-4" />
                      <span>Renewal Settings</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-muted/30">
                        <Repeat className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Interval</div>
                          <div className="font-medium">{todo.renewInterval}</div>
                        </div>
                      </div>
                      {todo.renewInterval === "CUSTOM" && todo.renewCustom && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">Custom Schedule</div>
                            <div className="font-medium">{todo.renewCustom}</div>
                          </div>
                        </div>
                      )}
                      {todo.renewEvery && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">Frequency</div>
                            <div className="font-medium">Every {todo.renewEvery}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Checklist Section */}
              {todo.checklist && todo.checklist.length > 0 && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                      <CheckSquare className="h-4 w-4" />
                      <span>Checklist</span>
                      <span className="ml-auto text-xs">
                        {todo.checklist.filter(i => i.marked).length} / {todo.checklist.length} completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {todo.checklist.map(item => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-3 text-sm font-normal transition-all duration-300 hover:bg-muted hover:scale-[1.02] group"
                          onClick={() => handleChecklistToggle(item.id)}
                          disabled={updatingChecklistId === item.id}
                        >
                          <div className="flex items-start gap-3 w-full">
                            {updatingChecklistId === item.id ? (
                              <Loader2 className="h-5 w-5 mt-0.5 animate-spin text-muted-foreground shrink-0" />
                            ) : item.marked ? (
                              <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                              <Circle className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            )}
                            <span className={`text-left flex-1 transition-all duration-300 ${item.marked ? "line-through opacity-60" : "group-hover:translate-x-1"}`}>
                              {item.text}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TodoDetailedPopup
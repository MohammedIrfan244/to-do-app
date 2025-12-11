"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
// zod import not needed here (types come from schema)
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { createTodoSchema } from "@/schema/todo";
import type { CreateTodoInput, UpdateTodoInput } from "@/schema/todo";
import { IPriority, IRenewInterval } from "@/types/todo";
import { createTodo, updateTodo } from "@/server/to-do-action";
import { toast } from "sonner";
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
  Flag,
  Tag,
  FileText,
  Repeat,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/helper/date-formatter";
import { withClientAction } from "@/lib/helper/with-client-action";

type Props = {
  initialData?: Partial<CreateTodoInput & { id?: string }>;
  trigger?: React.ReactNode;
  onSaved?: (todo?: unknown) => void;
};

export default function ToDoDialog({ initialData, trigger, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: undefined,
      tags: [],
      dueDate: undefined,
      dueTime: undefined,
      renewInterval: undefined,
      renewEvery: undefined,
      renewCustom: undefined,
      checklist: [],
      status: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!initialData) return;

    type Src = Partial<CreateTodoInput> & {
      dueTime?: string;
      renewInterval?: IRenewInterval;
      renewEvery?: number;
      renewCustom?: string;
      checklist?: { text?: string }[];
      status?: string;
    };

    const src = initialData as Src;

    const values: Partial<CreateTodoInput> = {
      title: src.title || "",
      description: src.description || undefined,
      priority: src.priority || undefined,
      tags: src.tags || [],
      dueDate: src.dueDate ? new Date(src.dueDate as string | Date) : undefined,
      dueTime: src.dueTime || undefined,
      renewInterval: src.renewInterval || undefined,
      renewEvery: src.renewEvery || undefined,
      renewCustom: src.renewCustom || undefined,
      checklist: src.checklist || [],
      status: src.status || undefined,
    };

    reset(values as CreateTodoInput);
  }, [initialData, reset]);

  const tags = watch("tags") || [];
  const checklist = watch("checklist") || [];
  const dueDateValue = watch("dueDate");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      setValue("tags", [...tags, value]);
      e.currentTarget.value = "";
    }
  };

  const addChecklistItem = () => {
    setValue("checklist", [...checklist, { text: "" }]);
  };

  useEffect(() => {
    if (!dueDateValue) {
      setValue("dueTime", undefined);
    }
  }, [dueDateValue, setValue]);

  const submitForm = (data: CreateTodoInput) => {
    startTransition(async () => {
      if (initialData && initialData.id) {
        const payload = {
          id: initialData.id,
          ...data,
        } as unknown as UpdateTodoInput;
        const res = await withClientAction(() => updateTodo(payload), true)
        toast.success("Nice! Todo updated 🎉");
        onSaved?.(res);
        setOpen(false);
        return;
      }

      const res = await withClientAction(() => createTodo(data), true);
      toast.success("Nice! Todo added 🎉");
      reset();
      onSaved?.(res);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0">
            <Plus className="w-4 h-4 mr-2" /> New Todo
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-background text-foreground max-h-[90vh] overflow-y-auto overflow-x-hidden max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            What&apos;s on your mind?
          </DialogTitle>
          <DialogDescription className="text-sm">
            Let&apos;s get it down and make it happen ✨
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          {/* ... other form fields ... */}

          {/* Title */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <CheckSquare className="w-3.5 h-3.5" />
              What do you need to do?
            </Label>
            <Input
              {...register("title")}
              placeholder="e.g., grab some coffee beans"
              className="text-sm h-10"
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-3.5 h-3.5" />
              Any extra details?
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Add notes, links, whatever helps..."
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          {/* Priority + Tags Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Flag className="w-3.5 h-3.5" />
                How urgent is it?
              </Label>
              <Select
                onValueChange={(v: string) =>
                  setValue("priority", v as IPriority)
                }
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Pick one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW" className="text-sm">
                    Chill – whenever
                  </SelectItem>
                  <SelectItem value="MEDIUM" className="text-sm">
                    Normal
                  </SelectItem>
                  <SelectItem value="HIGH" className="text-sm">
                    Pretty urgent!
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RENEW INTERVAL */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Repeat className="w-3.5 h-3.5" />
                Does this repeat?
              </Label>
              <Select
                onValueChange={(v: string) =>
                  setValue("renewInterval", v as IRenewInterval)
                }
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Nope, just once" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY" className="text-sm">
                    Every day
                  </SelectItem>
                  <SelectItem value="WEEKLY" className="text-sm">
                    Every week
                  </SelectItem>
                  <SelectItem value="MONTHLY" className="text-sm">
                    Every month
                  </SelectItem>
                  <SelectItem value="YEARLY" className="text-sm">
                    Every year
                  </SelectItem>
                  <SelectItem value="CUSTOM" className="text-sm">
                    Custom schedule
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="w-3.5 h-3.5" />
                Tags (optional)
              </Label>
              <Input
                placeholder="Type and hit Enter"
                onKeyDown={addTag}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 -mt-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-muted text-muted-foreground text-xs flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Date + Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-5">
            {/* DATE SELECTOR */}
            <div className="space-y-2 md:col-span-2 min-w-0">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="w-3.5 h-3.5" />
                When's it due?
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left h-10 text-sm"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 mr-2" />
                    {watch("dueDate")
                      ? formatDate(watch("dueDate"), 15)
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent matchTriggerWidth={false} className="p-0">
                  <div className="flex flex-col">
                    <Calendar
                      mode="single"
                      selected={watch("dueDate") as Date | undefined}
                      onSelect={(date: Date | undefined) =>
                        setValue("dueDate", date)
                      }
                    />

                    {/* CLEAR DATE BUTTON */}
                    {watch("dueDate") && (
                      <Button
                        variant="ghost"
                        className="text-sm w-full border-t rounded-none"
                        onClick={() => {
                          setValue("dueDate", undefined);
                          setValue("dueTime", undefined);
                        }}
                      >
                        Clear Date
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* TIME SELECTORS */}
            <div className="space-y-2 md:col-span-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-3.5 h-3.5" />
                What time?
              </Label>

              <div className="grid grid-cols-3 gap-2">
                {/* Hour */}
                <Select
                  onValueChange={(v) =>
                    setValue(
                      "dueTime",
                      `${v}:${watch("dueTime")?.split(":")[1] || "00"} ${
                        watch("dueTime")?.split(" ")[1] || "AM"
                      }`
                    )
                  }
                >
                  <SelectTrigger
                    className="h-10 text-sm"
                    disabled={!dueDateValue}
                  >
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12).keys()].map((h) => {
                      const hr = (h + 1).toString().padStart(2, "0");
                      return (
                        <SelectItem key={hr} value={hr} className="text-sm">
                          {hr}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Minute */}
                <Select
                  onValueChange={(v) =>
                    setValue(
                      "dueTime",
                      `${watch("dueTime")?.split(":")[0] || "12"}:${v} ${
                        watch("dueTime")?.split(" ")[1] || "AM"
                      }`
                    )
                  }
                >
                  <SelectTrigger
                    className="h-10 text-sm"
                    disabled={!dueDateValue}
                  >
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {["00", "15", "30", "45"].map((m) => (
                      <SelectItem key={m} value={m} className="text-sm">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* AM / PM */}
                <Select
                  onValueChange={(v) =>
                    setValue(
                      "dueTime",
                      `${watch("dueTime")?.split(" ")[0] || "12:00"} ${v}`
                    )
                  }
                >
                  <SelectTrigger
                    className="h-10 text-sm"
                    disabled={!dueDateValue}
                  >
                    <SelectValue placeholder="AM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM" className="text-sm">
                      AM
                    </SelectItem>
                    <SelectItem value="PM" className="text-sm">
                      PM
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="space-y-3 pt-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <CheckSquare className="w-3.5 h-3.5" />
              Break it down into steps?
            </Label>

            <div className="space-y-2">
              {checklist.map((item, i) => (
                <Input
                  key={i}
                  placeholder={`Step ${i + 1}`}
                  {...register(`checklist.${i}.text` as const)}
                  className="h-9 text-sm"
                />
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={addChecklistItem}
              className="w-full h-9 text-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              Add step
            </Button>
          </div>

          {/* FOOTER */}
          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-10 px-6 text-sm"
            >
              Nevermind
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="h-10 px-6 text-sm"
            >
              {isPending ? "Saving..." : "Let's do it!"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

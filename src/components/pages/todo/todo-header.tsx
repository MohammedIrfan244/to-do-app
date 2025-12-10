"use client";

import React, { useEffect } from "react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Tag,
  Calendar,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { TodoFilterInput } from "@/schema/todo";
import { getTodoTags } from "@/server/to-do-action";
import { IGetTodoTagsPayload } from "@/types/todo";
import { withClientAction } from "@/lib/helper/with-client-action";

interface TodoHeaderProps {
  filters: TodoFilterInput;
  setFilters: React.Dispatch<React.SetStateAction<TodoFilterInput>>;
  search: string;
  setSearch: (value: string) => void;
  applyFilters: () => void;
  todayMode: boolean;
  setTodayMode: (value: boolean) => void;
}

export default function TodoHeader({
  filters,
  setFilters,
  search,
  setSearch,
  applyFilters,
  todayMode,
  setTodayMode,
}: TodoHeaderProps) {
  const [availableTags, setAvailableTags] = React.useState<
    IGetTodoTagsPayload[]
  >([]);

  const [openTags, setOpenTags] = React.useState(false);

  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    filters.tags ?? []
  );

  const loadTags = async () => {
    const response = await withClientAction<IGetTodoTagsPayload[]>(() =>
      getTodoTags()
    );
    if (response) setAvailableTags(response);
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      tags: selectedTags.length ? selectedTags : undefined,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  return (
    <Card className="border w-full card">
      <div className="w-full p-4 sm:p-6">
        {/* Top Row - Search and Today Mode */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
          {/* Search Bar - Removed hover/focus shadows from Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for?"
              className="pl-10 bg-background border-border/60 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Today Mode Switch - Removed hover/active shadows */}
          <Card
            className="bg-secondary/30 p-3 sm:p-2 border-border/40 transition-all duration-300 hover:bg-secondary/50 hover:border-primary/20 cursor-pointer group flex items-center justify-between sm:justify-start"
            onClick={() => setTodayMode(!todayMode)}
          >
            <CardContent className="flex items-center gap-3 p-0">
              <Label
                htmlFor="today-mode"
                className="text-sm font-bold text-foreground/80 cursor-pointer group-hover:text-primary transition-colors duration-300 whitespace-nowrap"
              >
                Focus on Today
              </Label>
              <Switch
                id="today-mode"
                checked={todayMode}
                onCheckedChange={setTodayMode}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Separator */}
        <Separator className="h-px bg-border/60 mb-6" />

        {/* Filters Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-extrabold tracking-tight text-foreground">
            Quick Filters & Sorting
          </h3>
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        {/* Bottom Row - Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 items-start">
          {/* Status */}
          <div className="flex flex-col gap-2 group">
            {/* 2. Conversational Label Change */}
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors duration-300">
              <CheckCircle2 className="h-3 w-3" />
              How&apos;s it going?
            </Label>
            <Select
              value={filters.status ?? "ALL"}
              onValueChange={(value: string) =>
                setFilters((prev) => ({
                  ...prev,
                  status:
                    value === "ALL"
                      ? undefined
                      : (value as TodoFilterInput["status"]),
                }))
              }
            >
              {/* SHADOWS REMOVED from SelectTrigger */}
              <SelectTrigger className="bg-background border-border/60 transition-all duration-300 hover:border-primary/30">
                <SelectValue placeholder="All tasks" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All tasks</SelectItem>
                <SelectItem value="PLAN">Planning</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DONE">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2 group">
            {/* 2. Conversational Label Change */}
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors duration-300">
              <Sparkles className="h-3 w-3" />
              Need to panic?
            </Label>
            <Select
              value={filters.priority ?? "ALL"}
              onValueChange={(value: string) =>
                setFilters((prev) => ({
                  ...prev,
                  priority:
                    value === "ALL"
                      ? undefined
                      : (value as TodoFilterInput["priority"]),
                }))
              }
            >
              {/* SHADOWS REMOVED from SelectTrigger */}
              <SelectTrigger className="bg-background border-border/60 transition-all duration-300 hover:border-primary/30">
                <SelectValue placeholder="Any priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Any priority</SelectItem>
                <SelectItem value="LOW">Chill (Low)</SelectItem>
                <SelectItem value="MEDIUM">Regular (Medium)</SelectItem>
                <SelectItem value="HIGH">Urgent! (High)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags multiselect */}
          <div className="flex flex-col gap-2 group lg:col-span-2">
            {/* 2. Conversational Label Change */}
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors duration-300">
              <Tag className="h-3 w-3" />
              Got any topics?
            </Label>

            <Popover open={openTags} onOpenChange={setOpenTags}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start font-medium border-border/60 transition-all duration-300 hover:border-primary/30"
                >
                  {selectedTags.length ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                        {selectedTags.length}
                      </span>
                      <span className="text-foreground/80">
                        {selectedTags.length === 1
                          ? "tag selected"
                          : "tags selected"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Pick some tags...
                    </span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandEmpty>No tags found.</CommandEmpty>

                  <CommandGroup>
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.tag}
                        onSelect={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag.tag)
                              ? prev.filter((x) => x !== tag.tag)
                              : [...prev, tag.tag]
                          );
                        }}
                      >
                        <CheckCircle2
                          className={`mr-2 h-4 w-4 transition-all duration-200 ${
                            selectedTags.includes(tag.tag)
                              ? "text-primary fill-primary/20"
                              : "text-muted-foreground/50"
                          }`}
                        />
                        {tag.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort by */}
          <div className="flex flex-col gap-2 group">
            {/* 2. Conversational Label Change */}
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors duration-300">
              <Calendar className="h-3 w-3" />
              Order by...
            </Label>

            <Select
              value={filters.sortBy ?? "CREATED_AT"}
              onValueChange={(value: string) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: value as TodoFilterInput["sortBy"],
                }))
              }
            >
              {/* SHADOWS REMOVED from SelectTrigger */}
              <SelectTrigger className="bg-background border-border/60 transition-all duration-300 hover:border-primary/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CREATED_AT">
                  Newest First (Created)
                </SelectItem>
                <SelectItem value="DUE_DATE">Due Soon (Due Date)</SelectItem>
                <SelectItem value="PRIORITY">
                  Most Important (Priority)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort order */}
          <div className="flex flex-col gap-2 group">
            {/* 2. Conversational Label Change */}
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors duration-300">
              <ArrowUpDown className="h-3 w-3" />
              Direction
            </Label>

            <Select
              value={filters.sortOrder ?? "DESC"}
              onValueChange={(value: string) =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: value as TodoFilterInput["sortOrder"],
                }))
              }
            >
              {/* SHADOWS REMOVED from SelectTrigger */}
              <SelectTrigger className="bg-background border-border/60 transition-all duration-300 hover:border-primary/30">
                <SelectValue placeholder="Order" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ASC">Oldest / A-Z (Ascending)</SelectItem>
                <SelectItem value="DESC">Newest / Z-A (Descending)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply Button */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1 xl:col-span-1 self-end">
            <Label className="text-xs font-semibold text-transparent select-none">
              &nbsp;
            </Label>
            <Button
              onClick={applyFilters}
              className="bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 font-semibold w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Show Me The Tasks!
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

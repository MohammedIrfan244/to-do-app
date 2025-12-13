"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { withClientAction } from "@/lib/helper/with-client-action";
import { softDeleteTodo } from "@/server/to-do-action";
import { Trash2, Loader2, CheckCircle2 } from "lucide-react";

interface TodoDeleteDialogueProps {
  todoId: string | null;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function TodoDeleteDialogue({ todoId, isOpen, setOpen }: TodoDeleteDialogueProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    if (!todoId) return;

    setIsDeleting(true);

    await withClientAction(
      () => softDeleteTodo({ id: todoId }),
      true
    );

    setIsDeleting(false);
    setShowSuccess(true);

    // Show success animation for 1 second before closing
    setTimeout(() => {
      setShowSuccess(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <CheckCircle2 className="h-16 w-16 animate-in zoom-in duration-500" />
              <div className="absolute inset-0 h-16 w-16 animate-ping opacity-75">
                <CheckCircle2 className="h-16 w-16" />
              </div>
            </div>
            <p className="text-lg font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
              Gone! 👋
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 transition-transform duration-300 hover:scale-110">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <DialogTitle className="text-xl">Hey, wait a sec...</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <p className="text-base text-foreground">
                Are you sure you want to delete this todo?
              </p>
              <p className="text-sm text-muted-foreground">
                Just checking because, you know, we can't bring it back once it's gone. No pressure though! 😊
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isDeleting}
                className="transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Nah, keep it
              </Button>

              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Yeah, delete it
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
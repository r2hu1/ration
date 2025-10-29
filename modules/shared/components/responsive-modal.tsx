"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

interface ResponsiveModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  content: ReactNode;
  footer?: ReactNode;
  cancelText?: string;
  confirmText?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  showDefaultFooter?: boolean;
  variant?: "default" | "destructive";
}

export default function ResponsiveModal({
  children,
  open,
  onOpenChange,
  title,
  description,
  content,
  footer,
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false,
  showDefaultFooter = true,
  variant = "default",
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
            {content}
          </DrawerHeader>
          {footer ||
            (showDefaultFooter && (
              <DrawerFooter className="sm:flex grid grid-cols-2 gap-3">
                <DrawerClose
                  asChild
                  disabled={cancelDisabled}
                  onClick={onCancel}
                >
                  <Button variant="outline" disabled={cancelDisabled}>
                    {cancelText}
                  </Button>
                </DrawerClose>
                <Button
                  disabled={confirmDisabled}
                  onClick={onConfirm}
                  variant={
                    variant === "destructive" ? "destructive" : "default"
                  }
                >
                  {confirmText}
                </Button>
              </DrawerFooter>
            ))}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {content}
        </AlertDialogHeader>
        {footer ||
          (showDefaultFooter && (
            <AlertDialogFooter className="sm:flex grid grid-cols-2 gap-3">
              <AlertDialogCancel disabled={cancelDisabled} onClick={onCancel}>
                {cancelText}
              </AlertDialogCancel>
              <Button
                disabled={confirmDisabled}
                onClick={onConfirm}
                variant={variant === "destructive" ? "destructive" : "default"}
              >
                {confirmText}
              </Button>
            </AlertDialogFooter>
          ))}
      </AlertDialogContent>
    </AlertDialog>
  );
}

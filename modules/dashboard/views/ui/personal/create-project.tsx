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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function CreatePersonalProject({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const Slot = isMobile ? Drawer : AlertDialog;
  const SlotContent = isMobile ? DrawerContent : AlertDialogContent;
  const SlotTrigger = isMobile ? DrawerTrigger : AlertDialogTrigger;
  const SlotTitle = isMobile ? DrawerTitle : AlertDialogTitle;
  const SlotDescription = isMobile ? DrawerDescription : AlertDialogDescription;
  const SlotHeader = isMobile ? DrawerHeader : AlertDialogHeader;
  const SlotFooter = isMobile ? DrawerFooter : AlertDialogFooter;
  const SlotAction = isMobile ? Button : AlertDialogAction;
  const SlotCancel = isMobile ? DrawerClose : AlertDialogCancel;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.projects.create_personal_project.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleProjectCreation = () => {
    mutate(
      {
        name,
        description,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.projects.get_all.queryOptions());
          setModalOpen(false);
          toast.success("Project created successfully");
        },
      },
    );
  };
  if (error) {
    toast.error(error.message);
  }
  return (
    <Slot open={modalOpen} onOpenChange={setModalOpen}>
      <SlotTrigger asChild>{children}</SlotTrigger>
      <SlotContent>
        <SlotHeader>
          <SlotTitle>Creating Project</SlotTitle>
          <SlotDescription>
            A project can have multiple variables and can be used to organize,
            store and share variables.
          </SlotDescription>
          <div className="py-2 grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="My Cool Project"
            />
            <Label htmlFor="project-description" className="mt-1.5">
              Description{" "}
              <span className="text-xs text-foreground/80">Optional*</span>
            </Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              placeholder="This project is for, about ..."
            />
          </div>
        </SlotHeader>
        <SlotFooter className="sm:flex grid grid-cols-2 gap-3">
          <SlotCancel disabled={isPending}>Cancel</SlotCancel>
          <Button disabled={isPending} onClick={handleProjectCreation}>
            {isPending && <Loader />}
            Continue
          </Button>
        </SlotFooter>
      </SlotContent>
    </Slot>
  );
}

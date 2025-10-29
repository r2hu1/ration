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
import ChangeProjectType, { ProjectType } from "./change-type";
import { usePathname, useRouter } from "next/navigation";
import { Trash } from "lucide-react";

export default function PersonalProjectSettings({
  slug,
  prevName,
  prevDescription,
  prevType,
  children,
}: {
  slug: string;
  prevName: string;
  prevDescription: string;
  prevType: ProjectType;
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

  const [name, setName] = useState(prevName);
  const [description, setDescription] = useState(prevDescription);

  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.projects.update_by_slug.mutationOptions(),
  );
  const {
    mutate: deleteProject,
    isPending: isDeleting,
    error: deleteError,
    status: deleteStatus,
  } = useMutation(trpc.projects.delete.mutationOptions());
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleProjUpdate = () => {
    mutate(
      {
        slug: slug,
        name: name,
        description: description,
        projectType: "PERSONAL",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.projects.get_all.queryOptions({ type: "PERSONAL" }),
          );
          queryClient.invalidateQueries(
            trpc.projects.get_by_slug.queryOptions({
              slug: slug,
              type: "PERSONAL",
            }),
          );
          setModalOpen(false);
        },
      },
    );
  };
  const pathname = usePathname();
  const handleDelete = () => {
    deleteProject(
      {
        slug: slug,
        type: "PERSONAL",
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(
            trpc.projects.get_all.queryOptions({ type: "PERSONAL" }),
          );
          if (pathname.includes(data.slug)) {
            router.push("/~");
          }
          setModalOpen(false);
        },
      },
    );
  };
  if (error) {
    toast.error(error.message);
  }
  if (deleteError) {
    toast.error(deleteError.message);
  }
  return (
    <Slot open={modalOpen} onOpenChange={setModalOpen}>
      <SlotTrigger asChild>{children}</SlotTrigger>
      <SlotContent>
        <SlotHeader>
          <SlotTitle>{prevName}</SlotTitle>
          <SlotDescription>
            Rename, edit or delete your project.
          </SlotDescription>
          <div className="py-3 grid gap-3">
            <Label>Project Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="My Cool Project"
            />
            <Label>Project Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              placeholder="Describe your project"
            />
            <Label>Project Type</Label>
            <ChangeProjectType slug={slug} prevType={prevType} />
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleDelete}
              disabled={isPending || isDeleting}
              className="h-7 px-3! text-xs w-fit"
            >
              Delete Project{" "}
              {isDeleting ? <Loader /> : <Trash className="size-3.5" />}
            </Button>
            <Label className="text-xs text-foreground/80">
              This action cannot be undone*
            </Label>
          </div>
        </SlotHeader>
        <SlotFooter className="sm:flex grid grid-cols-2 gap-3">
          <SlotCancel disabled={isPending || isDeleting}>Cancel</SlotCancel>
          <Button disabled={isPending || isDeleting} onClick={handleProjUpdate}>
            {isPending && <Loader />}
            Save
          </Button>
        </SlotFooter>
      </SlotContent>
    </Slot>
  );
}

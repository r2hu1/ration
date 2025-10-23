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
import { useIsMobile } from "@/hooks/use-mobile";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateTeam({
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
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.teams.create.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleTeamCreation = () => {
    mutate(
      { name: name.replace(/\s+/g, "-").toLowerCase() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
        },
        onSettled: () => {
          setModalOpen(false);
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
          <SlotTitle>Create Team</SlotTitle>
          <SlotDescription>
            A team can have multiple members and can be used to organize and
            share projects.
          </SlotDescription>
          <div className="py-2 grid gap-2">
            <Label>Team Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="Unique Team"
            />
          </div>
        </SlotHeader>
        <SlotFooter className="sm:flex grid grid-cols-2 gap-3">
          <SlotCancel disabled={isPending}>Cancel</SlotCancel>
          <Button disabled={isPending} onClick={handleTeamCreation}>
            {isPending && <Loader />}
            Continue
          </Button>
        </SlotFooter>
      </SlotContent>
    </Slot>
  );
}

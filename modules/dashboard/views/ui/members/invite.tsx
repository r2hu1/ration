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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InviteMembers({
  children,
  teamId,
}: {
  children: React.ReactNode;
  teamId: string;
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

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<any>("member");
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.teams.invite.mutationOptions(),
  );

  const handleTeamInvite = () => {
    mutate(
      { email: email, teamId: teamId, role: role },
      {
        onSettled: () => {
          setModalOpen(false);
          setRole("member");
          setEmail("");
        },
        onSuccess: () => {
          toast.success("Collaborator invitation sent successfully");
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
          <SlotTitle>Invite Collaborator</SlotTitle>
          <SlotDescription>
            Enter the email address of the person you want to invite and select
            their role.
          </SlotDescription>
          <div className="py-2 grid gap-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="name@domain.com"
            />
            <Label>Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="member" className="flex items-center">
                    Member
                  </SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-foreground/80">
              {role == "admin" &&
                "Can view, edit projects, and invite collaborators."}
              {role == "member" && "Can view and edit projects."}
              {role == "guest" && "Can view projects and members."}
            </p>
          </div>
        </SlotHeader>
        <SlotFooter className="sm:flex grid grid-cols-2 gap-3">
          <SlotCancel disabled={isPending}>Cancel</SlotCancel>
          <Button disabled={isPending} onClick={handleTeamInvite}>
            {isPending && <Loader />}
            Continue
          </Button>
        </SlotFooter>
      </SlotContent>
    </Slot>
  );
}

"use client";
import { useAuthState } from "@/components/providers/auth-context";
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
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { act, useState } from "react";
import { toast } from "sonner";

export default function KickUser({
  email,
  children,
}: {
  email: string;
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

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleKickMember = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.removeMember({
      memberIdOrEmail: email,
    });
    if (!error) {
      toast.success("Kicked user from team.");
      queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
      queryClient.invalidateQueries(
        trpc.teams.get_members_in_active_team.queryOptions(),
      );
      setModalOpen(false);
    }
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <Slot open={modalOpen} onOpenChange={setModalOpen}>
      <SlotTrigger asChild>{children}</SlotTrigger>
      <SlotContent>
        <SlotHeader>
          <SlotTitle>Are you sure?</SlotTitle>
          <SlotDescription>
            You are about to kick {email} from the {activeOrganization?.name}.
          </SlotDescription>
        </SlotHeader>
        <SlotFooter className="sm:flex grid grid-cols-2 gap-3">
          <SlotCancel disabled={loading}>Cancel</SlotCancel>
          <Button disabled={loading} onClick={handleKickMember}>
            {loading && <Loader />}
            Continue
          </Button>
        </SlotFooter>
      </SlotContent>
    </Slot>
  );
}

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
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { act, useState } from "react";
import { toast } from "sonner";

export default function LeaveTeam({
  slug,
  children,
}: {
  slug: string;
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
  const router = useRouter();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleTeamLeave = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.leave({
      organizationId: activeOrganization?.id,
    });
    if (!error) {
      toast.success("You have successfully left the team.");
      queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
      router.push("/~/me");
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
            You are about to leave {activeOrganization?.name}. Are you sure you
            want to proceed? This action cannot be undone.
          </SlotDescription>
        </SlotHeader>
        <SlotFooter className="sm:flex grid grid-cols-2 gap-3">
          <SlotCancel disabled={loading}>Cancel</SlotCancel>
          <Button disabled={loading} onClick={handleTeamLeave}>
            {loading && <Loader />}
            Continue
          </Button>
        </SlotFooter>
      </SlotContent>
    </Slot>
  );
}

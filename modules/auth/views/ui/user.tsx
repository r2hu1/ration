"use client";
import { useAuthState } from "@/components/providers/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Home, UserPlus } from "lucide-react";
import { Logout } from "./logout";
import { ThemeChanger } from "@/components/ui/theme-changer";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DialogTitle } from "@/components/ui/dialog";
import CreateTeam from "@/modules/dashboard/views/ui/create-team";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function User() {
  const { data } = useAuthState();
  const isMobile = useIsMobile();
  const Slot = isMobile ? Drawer : DropdownMenu;
  const SlotContent = isMobile ? DrawerContent : DropdownMenuContent;
  const SlotTrigger = isMobile ? DrawerTrigger : DropdownMenuTrigger;
  const SlotItem = isMobile ? "div" : DropdownMenuItem;
  const SlotSeparator = isMobile ? "div" : DropdownMenuSeparator;

  const router = useRouter();
  const switchDashboard = async () => {
    const { data, error } = await authClient.organization.setActive({
      organizationId: null,
    });
    if (!error) {
      router.push("/~/me");
    }
  };

  return (
    <Slot modal>
      <SlotTrigger asChild>
        <Avatar>
          <AvatarFallback>{data?.user?.name.slice(0, 2)}</AvatarFallback>
          <AvatarImage src={data?.user?.image} />
        </Avatar>
      </SlotTrigger>
      <SlotContent
        className={
          !isMobile ? "mr-10 w-[250px] mt-2" : "px-4 pb-4 grid gap-5 text-sm"
        }
      >
        {isMobile && (
          <DrawerHeader className="-mt-4!">
            <DialogTitle>Settings</DialogTitle>
            <DrawerDescription>Navigation and settings</DrawerDescription>
          </DrawerHeader>
        )}
        <div className="text-sm hidden px-2 gap-px sm:grid py-2">
          <h2>{data?.user?.name}</h2>
          <span className="text-xs text-foreground/80">
            {data?.user?.email}
          </span>
        </div>
        <SlotSeparator className="hidden sm:flex" />
        <SlotItem onClick={switchDashboard}>Personal Dashboard</SlotItem>
        <SlotItem asChild>
          <Link href={`/~/me/settings`}>Account Settings</Link>
        </SlotItem>
        <CreateTeam>
          <SlotItem
            onSelect={(e) => e.preventDefault()}
            className="flex items-center justify-between"
          >
            Create Team
            <UserPlus className="size-4" />
          </SlotItem>
        </CreateTeam>
        <SlotSeparator className="hidden sm:flex" />
        <SlotItem className="flex items-center justify-between">
          Toggle Theme
          <ThemeChanger
            variant="ghost"
            className="ml-auto p-0 h-4 w-4"
            size="icon-sm"
          />
        </SlotItem>
        <SlotItem asChild>
          <Link href="/" className="flex items-center justify-between">
            Homepage <Home className="size-4" />
          </Link>
        </SlotItem>
        <SlotSeparator className="hidden sm:flex" />
        <SlotItem
          onSelect={(e) => {
            e.preventDefault();
          }}
          className="mt-3 sm:mt-0 px-0 py-0"
        >
          <Logout size="sm" className="w-full" />
        </SlotItem>
      </SlotContent>
    </Slot>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronDown,
  FolderCog,
  Grid2X2,
  List,
  Search,
  Users,
} from "lucide-react";

export default function Toolbar() {
  const isMobile = useIsMobile();
  const Slot = isMobile ? Drawer : DropdownMenu;
  const SlotContent = isMobile ? DrawerContent : DropdownMenuContent;
  const SlotTrigger = isMobile ? DrawerTrigger : DropdownMenuTrigger;
  const SlotItem = isMobile ? "div" : DropdownMenuItem;
  const SlotSeparator = isMobile ? "div" : DropdownMenuSeparator;
  return (
    <div>
      <div className="grid sm:flex w-full gap-3">
        <InputGroup>
          <Search className="size-3.5 ml-2.5" />
          <InputGroupInput type="text" placeholder="Search your projects" />
        </InputGroup>
        <div className="grid grid-cols-2 sm:flex gap-3">
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <Grid2X2 className="size-4" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="size-4" />
            </Button>
          </ButtonGroup>
          <Slot modal>
            <SlotTrigger asChild>
              <Button>
                Create New <ChevronDown className="ml-auto size-4" />
              </Button>
            </SlotTrigger>
            <SlotContent
              className={
                !isMobile
                  ? "mr-[110px] w-[250px] mt-2"
                  : "px-4 pb-4 grid gap-3 text-sm"
              }
            >
              {isMobile && (
                <DrawerHeader className="-mt-4!">
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Create a project in your workspace
                  </DialogDescription>
                </DrawerHeader>
              )}
              <SlotItem>
                Private Project <FolderCog className="size-4 ml-auto" />
              </SlotItem>
              <SlotSeparator className="hidden sm:flex" />
              <SlotItem>
                Shared Project <Users className="size-4 ml-auto" />
              </SlotItem>
            </SlotContent>
          </Slot>
        </div>
      </div>
    </div>
  );
}

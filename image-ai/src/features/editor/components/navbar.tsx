"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

import {
  ChevronDown,
  Download,
  MousePointerClickIcon,
  Redo2,
  Undo2,
} from "lucide-react";

import { CiFileOn } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

import { Hint } from "./tooltip";
import { BsCloudCheck } from "react-icons/bs";
import { ActiveTool } from "../types";
import { cn } from "@/lib/utils";

export const Navbar =  ({
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className="flex items-center w-full h-full gap-x-1">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              File
              <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-3">
              <CiFileOn className="size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />
        {/* BUTTON TODO: add functionality
            TODO: add dynamic styles*/}
        <Hint label={"Select"} side="bottom" sideOffset={10}>
          <Button 
            variant="ghost" 
            size={"icon"} 
            onClick={() => onChangeActiveTool('select')} 
            className={cn(activeTool === 'select' && 'bg-gray-100')}>
            <MousePointerClickIcon className="size-4" />
          </Button>
        </Hint>
        <Hint label={"Undo"} side="bottom" sideOffset={10}>
          <Button variant="ghost" size={"icon"} onClick={() => {}} className="">
            <Undo2 className="size-4" />
          </Button>
        </Hint>
        <Hint label={"Redo"} side="bottom" sideOffset={10}>
          <Button variant="ghost" size={"icon"} onClick={() => {}} className="">
            <Redo2 className="size-4" />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className="text-muted-foreground text-sm" />
          <div className="test-xs text-muted-foreground">Saved</div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Export
              <Download className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">
                  Save for later editing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">
                  Best for sharing on the web
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>JPEG</p>
                <p className="text-xs text-muted-foreground">
                 Best for printing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>SVG</p>
                <p className="text-xs text-muted-foreground">
                 Best for vector software
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

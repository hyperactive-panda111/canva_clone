"use client";

import { useFilePicker } from 'use-file-picker';
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
  editor?: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

import { Hint } from "./tooltip";
import { BsCloudCheck } from "react-icons/bs";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";
import { UserButton } from '@/features/auth/components/user-button';

export const Navbar =  ({
  editor,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  const { openFilePicker } = useFilePicker({
    accept: '.json',
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          editor?.loadJson(reader.result as string);
        };
      }
    },
  });

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
            <DropdownMenuItem 
              className="flex items-center gap-x-3"
              onClick={() => openFilePicker()}
            >
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
        <Hint label={"Select"} side="bottom" sideOffset={10}>
          <Button 
            variant="ghost" 
            size={"icon"} 
            onClick={() => onChangeActiveTool('select')} 
            className={cn(activeTool === 'select' && 'bg-gray-100')}
          >
            <MousePointerClickIcon className="size-4" />
          </Button>
        </Hint>
        <Hint label={"Undo"} side="bottom" sideOffset={10}>
          <Button 
            disabled={!editor?.canUndo()}
            variant="ghost" 
            size={"icon"} 
            onClick={() => editor?.onUndo()} 
          >
            <Undo2 className="size-4" />
          </Button>
        </Hint>
        <Hint label={"Redo"} side="bottom" sideOffset={10}>
          <Button 
            disabled={!editor?.canRedo()}
            variant="ghost" 
            size={"icon"} 
            onClick={() => editor?.onRedo()} 
            className="">
            <Redo2 className="size-4" />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className="text-muted-foreground text-sm" />
          <div className="test-xs text-muted-foreground">Saved</div>
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
            <DropdownMenuItem 
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveJson()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">
                  Save for later editing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-x-2"
              onClick={() => editor?.savePng()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">
                  Best for sharing on the web
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
               className="flex items-center gap-x-2"
               onClick={() => editor?.saveJpg()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>JPEG</p>
                <p className="text-xs text-muted-foreground">
                 Best for printing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveSvg()}
              >
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
        <UserButton />
        </div>
      </div>
    </nav>
  );
}

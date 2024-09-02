import { Button } from "@/components/ui/button";
import { Minimize, ZoomIn, ZoomOut } from "lucide-react";

import { Hint } from "./tooltip";
import { Editor } from "../types";

interface FooterProps {
    editor?: Editor | undefined;
}

export const Footer = ({ editor }: FooterProps) => {
    return (
        <footer className="h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49]
        p-2 gap-x-1 shrink-0 px-4 flex-row-reverse">
            <Hint
               label='Reset'
               side="top"
               sideOffset={10}
            >
                <Button
                    onClick={() => editor?.autoZoom()}
                    size={'icon'}
                    variant={'ghost'}
                    className="h-full"
                >
                    <Minimize className="size-4"/>
                </Button>                
            </Hint>
            <Hint
               label='Zoom In'
               side="top"
               sideOffset={10}
            >
                <Button
                    onClick={() => editor?.zoomIn()}
                    size={'icon'}
                    variant={'ghost'}
                    className="h-full"
                >
                    <ZoomIn  className="size-4"/>
                </Button>                
            </Hint>
            <Hint
               label='Zoom Out'
               side="top"
               sideOffset={10}
            >
                <Button
                    onClick={() => editor?.zoomOut()}
                    size={'icon'}
                    variant={'ghost'}
                    className="h-full"
                >
                    <ZoomOut className="size-4"/>
                </Button>                
            </Hint>
        </footer>
    );
};
import { useState } from "react";
import { ActiveTool, Editor } from "../types";
import { Hint } from "./tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}


export const Toolbar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: ToolbarProps) => {

    const fillColor = editor?.getActiveFillColor();
    const strokeColor = editor?.getActiveStrokeColor();

    if (editor?.selectedObjects.length === 0) {
        return (
            <div className='shrink-0 h-[56px] border-b bg-white w-full flex
        items-center overflow-x-auto z-[49] p-2 gap-x-2' />
        )
    }

    return (
        <div className='shrink-0 h-[56px] border-b bg-white w-full flex
        items-center overflow-x-auto z-[49] p-2 gap-x-2'>
            <div className="flex items-center justify-center h-full">
                <Hint label="Color" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeActiveTool('fill')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            activeTool === 'fill' && 'bg-gray-100'
                        )}
                    >
                        <div
                          className="rounded-sm size-4 border" 
                          style={{
                            backgroundColor: fillColor
                          }}
                        />   
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center justify-center h-full">
                <Hint label="Border Color" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeActiveTool('stroke-color')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            activeTool === 'stroke-color' && 'bg-gray-100'
                        )}
                    >
                        <div
                          className="rounded-sm size-4 border-2" 
                          style={{
                            borderColor: strokeColor
                          }}
                        />   
                    </Button>
                </Hint>
            </div>
        </div>
    )
}

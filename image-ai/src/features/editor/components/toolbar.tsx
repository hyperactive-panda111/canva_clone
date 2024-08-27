import { useState } from 'react';

import { BsBorderWidth } from "react-icons/bs";
import {
     ArrowUp, 
     ArrowDown, 
     ChevronDown, 
     AlignLeft,
     AlignCenter,
     AlignRight
} from "lucide-react";
import { RxTransparencyGrid } from 'react-icons/rx';
import { Button } from "@/components/ui/button";
import { 
    FaItalic, 
    FaBold,
    FaStrikethrough,
    FaUnderline
} from 'react-icons/fa';

import { ActiveTool, Editor, FONT_WEIGHT } from "../types";
import { cn } from "@/lib/utils";

import { Hint } from "./tooltip";
import { isTextType } from "../utils";

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

    const initialFillColor = editor?.getActiveFillColor();
    const initialStrokeColor = editor?.getActiveStrokeColor();
    const initialFontFamily = editor?.getActiveFontFamily();
    const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
    const initialFontStyle = editor?.getActiveFontStyle() || 'normal';
    const initialFontUnderline = editor?.getActiveFontUnderline();
    const initialFontLinethrough = editor?.getActiveFontLinethrough();
    const initialTextAlign = editor?.getActiveTextAlign();

    const [properties, setProperties] = useState({
        fillColor: initialFillColor,
        strokeColor: initialStrokeColor,
        fontFamily: initialFontFamily,
        fontWeight: initialFontWeight,
        fontStyle: initialFontStyle,
        fontUnderline: initialFontUnderline,
        fontLinethrough: initialFontLinethrough,
        textAlign: initialTextAlign,

    });

    const selectedObject = editor?.selectedObjects[0];
    const selectedObjectType = editor?.selectedObjects[0]?.type;
    
    const isText = isTextType(selectedObjectType);

    const onChangeTextAlign = (value: string) => {
        if (!selectedObject) {
            return ;
        }

        editor?.changeTextAlign(value);
        setProperties((current) => ({
            ...current,
            textAlign: value,
        }))
    };

    const toggleBold = () => {
        if (!selectedObject) {
            return;
        }

        const newValue = properties.fontWeight > 500 ? 500 : 700;
        editor.changeFontWeight(newValue);

        setProperties((current) => ({
            ...current,
            fontWeight: newValue,
        }));
    };

    const toggleItalic = () => {
        if (!selectedObject) {
            return;
        }

        const isItalic = properties.fontStyle === 'italic';
        const newValue = isItalic ? 'normal' : 'italic';
        editor.changeFontStyle(newValue);

        setProperties((current) => ({
            ...current,
            fontStyle: newValue,
        }));
    };

    const toggleUnderline  = () => {
        if (!selectedObject) {
            return;
        }
    
        const newValue = properties.fontUnderline ? false : true;
        editor?.changeFontUnderline(newValue);
    
       setProperties((current) => ({
            ...current,
            fontUnderline: newValue,
       }))
    
    };

    const toggleLinethrough = () => {
        if (!selectedObject) {
            return;
        }
    
        const newValue = properties.fontLinethrough ? false : true;
        editor?.changeFontLinethrough(newValue);
    
        setProperties((current) => ({
            ...current,
            fontLinethrough: newValue,
        }));
    
    };

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
                            backgroundColor: properties.fillColor
                          }}
                        />   
                    </Button>
                </Hint>
            </div>
            {!isText && (
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
                            borderColor: properties.strokeColor,
                          }}
                        />   
                    </Button>
                </Hint>
            </div>
            )}
            {!isText && (
            <div className="flex items-center justify-center h-full">
                <Hint label="Border Width" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeActiveTool('stroke-width')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            activeTool === 'stroke-width' && 'bg-gray-100'
                        )}
                    >
                        <BsBorderWidth className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (
            <div className="flex items-center justify-center h-full">
                <Hint label="Font" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeActiveTool('font')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            'w-auto px-2 text-sm',
                            activeTool === 'font' && 'bg-gray-100'
                        )}
                    >
                       <div className="max-w-[100px] truncate">
                        {properties.fontFamily}
                       </div>
                       <ChevronDown className="size-4 ml-2 shrink-0"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Bold" side="bottom" sideOffset={5}>
                    <Button
                        onClick={toggleBold}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.fontWeight > 500 && 'bg-gray-100'
                        )}
                    >
                        <FaBold className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Italic" side="bottom" sideOffset={5}>
                    <Button
                        onClick={toggleItalic}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.fontWeight > 500 && 'bg-gray-100'
                        )}
                    >
                        <FaItalic className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Underline" side="bottom" sideOffset={5}>
                    <Button
                        onClick={toggleUnderline}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.fontUnderline && 'bg-gray-100'
                        )}
                    >
                        <FaUnderline className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Linethrough" side="bottom" sideOffset={5}>
                    <Button
                        onClick={toggleLinethrough}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.fontLinethrough && 'bg-gray-100'
                        )}
                    >
                        <FaStrikethrough className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
             {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Align left" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeTextAlign('left')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.textAlign === 'left' && 'bg-gray-100'
                        )}
                    >
                        <AlignLeft className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Align center" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeTextAlign('center')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.textAlign === 'center' && 'bg-gray-100'
                        )}
                    >
                        <AlignCenter className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            {isText && (<div className="flex items-center justify-center h-full">
                <Hint label="Align right" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeTextAlign('right')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(
                            properties.textAlign === 'right' && 'bg-gray-100'
                        )}
                    >
                        <AlignRight className="size-4"/>
                    </Button>
                </Hint>
            </div>
            )}
            <div className="flex items-center justify-center h-full">
                <Hint label="Bring Foward" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => editor?.bringFoward()}
                        variant={'ghost'}
                        size={'icon'}
                    >
                        <ArrowUp className="size-4"/>
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center justify-center h-full">
                <Hint label="Send Backwards" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => editor?.sendBackwards()}
                        variant={'ghost'}
                        size={'icon'}
                    >
                        <ArrowDown className="size-4"/>
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center justify-center h-full">
                <Hint label="Opacity" side="bottom" sideOffset={5}>
                    <Button
                        onClick={() => onChangeActiveTool('opacity')}
                        variant={'ghost'}
                        size={'icon'}
                        className={cn(activeTool === 'opacity' && 'bg-gray-100')}
                    >
                        <RxTransparencyGrid className="size-4"/>
                    </Button>
                </Hint>
            </div>
        </div>
    )
}

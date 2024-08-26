import { useEffect, useMemo, useState } from 'react';

import { cn } from "@/lib/utils";
import { 
    ActiveTool, 
    Editor, 
} from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

interface OpacitySidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: OpacitySidebarProps) => {
    const initialValue = editor?.getActiveOpacity() || 1;

    const [opacity, setOpacity] = useState(initialValue);
    const selectedObject = useMemo(() => {
        return editor?.selectedObjects[0];
    }, [editor?.selectedObjects])

    useEffect(() => {
        if (selectedObject) {
            setOpacity(selectedObject.get('opacity') || 1);
        }
    }, [selectedObject]);
    
    const onClose = () => {
        onChangeActiveTool('select');
    };

    const onChange = (value: number) => {
        editor?.changeOpacity(value);
        setOpacity(value);
    }
    
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'opacity' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"Opacity"}
                description='Change the opacity of the selected element' />
            <ScrollArea>
                <div className="p-4 space-y-6 border-b">
                    <Slider 
                        value={[opacity]}
                        onValueChange={(values) => onChange(values[0])}
                        min={0}
                        max={1}
                        step={0.01}         
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose
                onClick={onClose} />
        </aside>
    )
}

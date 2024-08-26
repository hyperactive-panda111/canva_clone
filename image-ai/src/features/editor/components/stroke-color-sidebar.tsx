import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR, STROKE_COLOR } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./color-picker";

interface StrokeColorSidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeColorSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: StrokeColorSidebarProps) => {
    const value = editor?.getActiveStrokeColor() || STROKE_COLOR;
    
    const onClose = () => {
        onChangeActiveTool('select');
    };

    const onChange = (value: string) => {
        editor?.changeStrokeColor(value);
    }
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'stroke-color' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"Border color"}
                description='Add a border color to your element' />
            <ScrollArea>
                <div className="p-4 space-y-6">
                <ColorPicker
                       value={value}
                       onChange={onChange}
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose
                onClick={onClose} />
        </aside>
    )
}

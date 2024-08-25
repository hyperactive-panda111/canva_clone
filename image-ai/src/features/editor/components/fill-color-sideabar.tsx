import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./color-picker";

interface FillColorSidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FillColorSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: FillColorSidebarProps) => {
    const value = editor?.fillColor || FILL_COLOR;
    
    const onClose = () => {
        onChangeActiveTool('select');
    };

    const onChange = (value: string) => {
        editor?.changeFillColor(value);
    }
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'fill' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"Fill color"}
                description='Add fill color to your element' />
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
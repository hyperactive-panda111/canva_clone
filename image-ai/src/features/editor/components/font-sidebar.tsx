import { cn } from "@/lib/utils";
import { 
    ActiveTool, 
    Editor,
    fonts, 
} from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FontSidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FontSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: FontSidebarProps) => {
   
    const value = editor?.getActiveFontFamily()
    const onClose = () => {
        onChangeActiveTool('select');
    };
    
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'font' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"Font"}
                description='Modify the font of your text' />
            <ScrollArea>
                <div className="p-4 space-y-1 border-b">
                    {fonts.map((font) => (
                      <Button
                        key={font}
                        size={'lg'}
                        variant={'secondary'}
                        className={cn(
                            "w-full h-16 text-left justify-start",
                        value === font && 'border-2 border-blue-500')}
                        onClick={() => editor?.changeFontFamily(font)}
                        style={{
                          fontFamily: font,
                          fontSize: '16px',
                          padding: '8px 16px',
                        }}
                      >
                        {font}
                      </Button>
                    ))}
                </div>
            </ScrollArea>
            <ToolSidebarClose
                onClick={onClose} />
        </aside>
    )
}

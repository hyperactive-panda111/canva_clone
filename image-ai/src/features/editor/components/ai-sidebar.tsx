import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";

interface AISidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AISidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: AISidebarProps) => {
    
    
    const onClose = () => {
        onChangeActiveTool('select');
    };
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'ai' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"AI"}
                description='Generate an image using AI' 
            />
            <ScrollArea>
                <form className="p-4 space-y-6">  
                        <Textarea
                            placeholder='Enter a prompt'
                            cols={30}
                            rows={10}
                            required
                            minLength={3}
                        />
                        <Button>Generate</Button>              
                </form>
            </ScrollArea>
            <ToolSidebarClose
                onClick={onClose} />
        </aside>
    )
}

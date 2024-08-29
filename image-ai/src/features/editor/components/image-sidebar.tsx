import { cn } from "@/lib/utils";
import { 
    ActiveTool, 
    Editor,
} from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useGetImages } from "@/features/images/api/use-get-images";
import { AlertTriangle, Loader } from "lucide-react";

interface ImageSidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
    activeTool,
    onChangeActiveTool,
}: ImageSidebarProps) => {
    const { isLoading, isError, data } = useGetImages();
    console.log("Incoming data: ", data);
   
    const onClose = () => {
        onChangeActiveTool('select');
    };
    
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'images' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"Images"}
                description='Add images to your canvas' />
                {isLoading && (
                    <div className="flex items-center justify-center flex-1">
                        <Loader className="animate-spin size-4 text-muted-foreground"/>

                    </div>
                )}
                {true && (
                    <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
                        <AlertTriangle className="size-4 text-muted-foreground "/>
                        <p className="text-muted-foreground text-sm">Failed to fetch images</p>

                    </div>
                )}
            <ScrollArea>
                <div className="p-4 space-y-1 border-b">
                
                </div>
            </ScrollArea>
            <ToolSidebarClose
                onClick={onClose} />
        </aside>
    )
}

import { cn } from "@/lib/utils";
import { 
    ActiveTool, 
    Editor,
    filters,
} from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterSidebarProps {
    editor?: Editor;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FilterSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: FilterSidebarProps) => {

    const [currentFilter, setCurrentFilter] = useState<string>('');
    const onClose = () => {
        onChangeActiveTool('select');
    };
    
    
    return (
        <aside
           className={cn(
            'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
            activeTool === 'filter' ? 'visible' : 'hidden',
           )}>
            <ToolSidebarHeader 
                title={"Filters"}
                description='Apply a filter to  the selected image' />
            <ScrollArea>
                <div className="p-4 space-y-1 border-b">
                    {filters.map((filter) => (
                      <Button
                        key={filter}
                        size={'lg'}
                        variant={'secondary'}
                        onClick={() => {editor?.changeImageFilter(filter);
                            setCurrentFilter(filter);
                        }}
                        className={cn(
                            "w-full h-16 text-left justify-start",
                            currentFilter === filter && 'border-2 border-blue-500')
                        }
                      >
                        {filter}
                      </Button>
                    ))}
                </div>
            </ScrollArea>
            <ToolSidebarClose
                onClick={onClose} />
        </aside>
    )
}

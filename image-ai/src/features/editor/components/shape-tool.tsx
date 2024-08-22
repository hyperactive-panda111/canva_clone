import type { IconType } from 'react-icons';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ShapeToolsProps {
    onClick: () => void;
    icon: IconType | LucideIcon;
    iconClassName?: string;
}

export const ShapeTool = ({
    onClick,
    icon: Icon,
    iconClassName,
}: ShapeToolsProps) => {
    return (
        <button
            onClick={onClick}
            className='aspect-square border rounded-md p-5'
        >
            <Icon className={cn('h-full w-full', iconClassName)} />
        </button>
    )
};
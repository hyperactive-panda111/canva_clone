'use client';

import { useGetProjects } from '@/features/projects/api/use-get-projects';

import {
    DropdownMenuContent,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

import { 
    Table,
    TableCell,
    TableRow,
    TableBody
} from '@/components/ui/table';
import { 
    AlertTriangle, 
    CopyIcon, 
    FileIcon, 
    Loader, 
    MoreHorizontal, 
    Search, 
    Trash
} from 'lucide-react';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useDuplicateProject } from '@/features/projects/api/use-duplicate-project';

export const ProjectsSection = () => {
    const duplicateMutatation = useDuplicateProject();
    const router = useRouter();

    const onCopy = (id: string) => {
        duplicateMutatation.mutate({ id });
    };

    const {
        data,
        status,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useGetProjects();

    if (status === 'pending') {
        return (
            <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>
                    Recent Projects
                </h3>
                <div className='flex flex-col gap-y-4 items-center justify-center h-32'>
                    <Loader className='size-6 text-muted-foreground' />
                    <p className='animate-spin text-muted-foreground'>
                        Failed to load projects
                    </p>
                </div>
            </div>
        );
    };

    if (status === 'error') {
        return (
            <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>
                    Recent Projects
                </h3>
                <div className='flex flex-col gap-y-4 items-center justify-center h-32'>
                    <AlertTriangle className='size-6 text-muted-foreground' />
                    <p className='text-muted-foreground'>
                        Failed to load projects
                    </p>
                </div>
            </div>
        );
    };

    if (!data.pages.length) {
        return (
            <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>
                    Recent Projects
                </h3>
                <div className='flex flex-col gap-y-4 items-center justify-center h-32'>
                    <Search className='size-6 text-muted-foreground' />
                    <p className='text-muted-foreground'>
                        No projects found
                    </p>
                </div>
            </div>
        )
    }
   return (
    <div className='space-y-4'>
        <h3 className='font-semibold tex-lg'>
            Recent Projects
        </h3>
        <Table>
            <TableBody>
               {data.pages.map((group, i) => (
                <React.Fragment key={i}>
                    {group.data.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell
                                onClick={() => router.push(`/editor/${project.id}`)}
                                 className='font-medium flex items-center gap-x-2 cursor-pointer'>
                                <FileIcon className='size-6'/>
                                {project.name}
                            </TableCell>
                            <TableCell
                                onClick={() => router.push(`/editor/${project.id}`)}
                                className='hidden md:table-cell cursor-pointer'
                            >
                                {project.width} x {project.height} px
                            </TableCell>
                            <TableCell
                                onClick={() => router.push(`/editor/${project.id}`)}
                                className='hidden md:table-cell cursor-pointer'
                            >
                                {formatDistanceToNow(project.updatedAt, {
                                    addSuffix: true, 
                                })}
                            </TableCell>
                            <TableCell className='flex items-center justify-end'>
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            disabled={false}
                                            variant={'ghost'}
                                            size={'icon'}
                                        >
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end' className='w-60'>
                                        <DropdownMenuItem
                                            className='cursor-pointer h-10'
                                            disabled={duplicateMutatation.isPending}
                                            onClick={() => onCopy(project.id)}
                                        >
                                            <CopyIcon className='size-4 mr-2' />
                                            Make a copy
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='cursor-pointer h-10'
                                            disabled={false}
                                            onClick={() => {}}
                                        >
                                            <Trash className='size-4 mr-2' />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </React.Fragment>
               ))}
            </TableBody>
        </Table>
        {hasNextPage && (
            <div className='w-full flex items-center justify-center pt-4'>
                <Button
                    variant='ghost'
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    Load more
                </Button>
            </div>
        )}
    </div>
   );
};
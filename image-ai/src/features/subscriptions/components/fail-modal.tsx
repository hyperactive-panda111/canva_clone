'use client';   

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { useFailModal } from '@/features/subscriptions/store/use-fail-modal';

export const FailModal = () => {
    const router = useRouter();
    const { isOpen, onClose } = useFailModal();
    
    const handleClose = () => {
        router.replace('/');
        onClose();
    };
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader className='flex items-center space-y-4'>
                   <Image 
                    src='/logo.svg'
                    alt='logo'
                    height={36}
                    width={36}
                   />
                   <DialogTitle className='text-center'>
                    Something went wrong
                   </DialogTitle>
                   <DialogDescription className='text-center'>
                    We could not process your payment
                   </DialogDescription>
                </DialogHeader>
                <Separator />
                <DialogFooter className='pt-2 mt-4 gap-y-2'>
                    <Button
                        onClick={handleClose}
                        className='w-full'
                    >
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
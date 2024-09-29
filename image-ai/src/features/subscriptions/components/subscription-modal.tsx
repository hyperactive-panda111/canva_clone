'use client';

import {
    Dialog,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';

import { useCheckout } from '../api/use-checkout';
import { useSubscriptionModal } from '../store/use-subscription-modal';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const SubscriptionModal = () => {
    const mutation = useCheckout();
    const {isOpen, onClose} = useSubscriptionModal();
     
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className='flex items-center space-y-4'>
                   <Image 
                    src='/logo.svg'
                    alt='logo'
                    height={36}
                    width={36}
                   />
                   <DialogTitle className='text-center'>
                    Upgrade to paid plan
                   </DialogTitle>
                   <DialogDescription className='text-center'>
                    Upgrade to paid plan to unlock more features
                   </DialogDescription>
                </DialogHeader>
                <Separator />
                <ul className='space-y-4'>
                    <li className='flex items-center'>
                        <CheckCircle2 className='size-5 mr-2 fill-blue-500 text-white' />
                        <p className='text-sm text-muted-foreground'>
                            Unlimited projects
                        </p>                        
                    </li>
                    <li className='flex items-center'>
                        <CheckCircle2 className='size-5 mr-2 fill-blue-500 text-white' />
                        <p className='text-sm text-muted-foreground'>
                            Unlimited templates
                        </p>                        
                    </li>
                </ul>
                <DialogFooter className='pt-2 mt-4 gap-y-2'>
                    <Button
                        onClick={() => mutation.mutate()}
                        className='w-full'
                        disabled={mutation.isPending}
                    >
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
 
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export const SignUpCard = () => {
    const onProviderSignUp = (provider: 'github' | 'google') => {
        signIn(provider, { callbackUrl: '/'});
    };

    return (
        <Card className='w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                Create an account
                </CardTitle>
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2.5 px-0 pb-0'>
                <div className='flex flex-col gap-y-2.5'>
                    <Button
                        onClick={() => onProviderSignUp('github')}
                        variant={'outline'}
                        size={'lg'}
                        className='w-full relative'
                    >
                        <FaGithub className='absolute size-5 top-2.5 mr-2 left-2.5'/>
                        Continue with Github
                    </Button>
                    <Button
                        onClick={() => onProviderSignUp('google')}
                        variant={'outline'}
                        size={'lg'}
                        className='w-full relative'
                    >
                        <FaGoogle className='absolute size-5 top-2.5 mr-2 left-2.5' />
                        Continue with Google
                    </Button>
                </div>
                <p className='text-muted-foreground text-xs'>
                Already have an account?
                <Link href={'/sign-in'}>
                    <span className='text-sky-700 hover:underline'>Sign In</span>
                </Link>
                </p>
            </CardContent>
        </Card>
    );
};
'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
 
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export const SignInCard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signIn('credentials', {
            email: email,
            password: password,
            callbackUrl: '/',
        });
    };

    const onProviderSignIn = (provider: 'github' | 'google') => {
        signIn(provider, { callbackUrl: '/'});
    };

    return (
        <Card className='w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                Login to continue
                </CardTitle>
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2.5 px-0 pb-0'>
                <form 
                    onSubmit={onCredentialSignIn}
                    className='space-y-2.5'
                >
                    <Input 
                        type={'email'}
                        placeholder={'Email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input 
                        type={'password'}
                        placeholder={'Password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type={'submit'}
                        size={'lg'}
                        className='w-full'
                    >
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className='flex flex-col gap-y-2.5'>
                    <Button
                        onClick={() => onProviderSignIn('github')}
                        variant={'outline'}
                        size={'lg'}
                        className='w-full relative'
                    >
                        <FaGithub className='absolute size-5 top-2.5 mr-2 left-2.5'/>
                        Continue with Github
                    </Button>
                    <Button
                        onClick={() => onProviderSignIn('google')}
                        variant={'outline'}
                        size={'lg'}
                        className='w-full relative'
                    >
                        <FaGoogle className='absolute size-5 top-2.5 mr-2 left-2.5' />
                        Continue with Google
                    </Button>
                </div>
                <p className='text-muted-foreground text-xs'>
                Don&apos;t have an account? 
                <Link href={'/sign-up'}>
                    <span className='text-sky-700 hover:underline'>Sign up</span>
                </Link>
                </p>
            </CardContent>
        </Card>
    );
};
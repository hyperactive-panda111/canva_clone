'use client'

import { Logo } from './logo';

export default function Navbar() {
    return (
        <nav className='w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]'>
          <Logo />
        </nav>
    )
    
}
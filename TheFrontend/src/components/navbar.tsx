/* eslint-disable @next/next/no-img-element */
import { Items } from '@/constants'
import { User } from '@/lib/types';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
export function NavBar({ user, url }: { user: User | null, url: string }) {
    return (
        <nav className="relative w-full h-[64px] flex shadow-lg mb-[64px]">
            <section className="flex-[0.25] h-full flex items-center justify-center font-bold text-[32px]">
                <Link href="/">Mobot</Link>
            </section>
            <section className="flex-[0.55] flex justify-center">
                <section className="flex justify-start items-center font-semibold gap-[48px]">
                    {Items.map((item, index) => <NavBarItem {...item} key={index} />)}
                </section>
            </section>
            <section className="flex-[0.2] flex items-center">
                <Session user={user} url={url}/>
            </section>
        </nav>
    );
}

export function Session({ user, url }: { user: User | null, url: string }) {
    return (
        <>
            {
                user ? (
                    <div className="w-full flex justify-end items-center mr-[48px]">
                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-[#319795] border-2">
                            <img className="w-full h-full object-contain" src={user.PfP} alt="pfp" />
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-around items-center">
                        <Button>
                            <Link href={url}>Log in</Link>
                        </Button>
                        <p>or</p>
                        <Button colorScheme="teal">
                            <Link href={url}>Sign up</Link>
                        </Button>
                    </div>
                )
            }
        </>
    );
}

export function NavBarItem({ name, link }: { name: string, link: string }) {
    return (
        <>
            <div>
                <Link href={link}>
                    {name}
                </Link>
            </div>
        </>
    );
}

//Search bar will be the last thing implemented in the whole project
export function SearchBar() {
    return (
        <>Search Input</>
    );
}
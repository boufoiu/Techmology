/* eslint-disable react/no-children-prop */

/* eslint-disable @next/next/no-img-element */
import { Button, Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiMenu, HiSearch } from 'react-icons/hi';

import { Items } from '@/constants';
import { Manager } from '@/lib';
import { User } from '@/lib/types';

export function NavBar() {
    const [user, setUser] = useState<User | null>(null);
    const [url, setUrl] = useState('/');
    const [show, setShow] = useState(false);

    useEffect(() => {
        const manager = new Manager();

        manager.api.session
            .get()
            .then((res) => setUser(res))
            .catch(() => setUser(null));
        manager.api.login
            .get()
            .then((res) => setUrl(res.url))
            .catch(() => setUrl('/'));
    }, []);

    return (
        <>
            <nav className="sticky bg-[#fff] top-0 w-full flex flex-col shadow-lg">
                <div className="flex h-[72px]">
                    <section className="min-w-[150px] flex-[1] sm:flex-[0.25] h-full flex items-center justify-center font-bold text-[32px]">
                        <Link href="/">Mobot</Link>
                    </section>
                    <section className="hidden sm:flex flex-[0.55] flex justify-between items-center">
                        <section className="flex justify-start text-[18px] md:text-[20px] items-center font-semibold gap-[36px] md:gap-[48px]">
                            {Items.map((item, index) => (
                                <NavBarItem {...item} key={index} />
                            ))}
                        </section>
                        <section className="flex justify-center items-center font-semibold">
                            <SearchBar />
                        </section>
                    </section>
                    <section className="hidden sm:flex flex-[0.2] flex items-center">
                        <Session user={user} url={url} />
                    </section>
                </div>
                <section className="flex sm:hidden absolute right-1 top-[26px] justify-end items-center">
                    <div className=" mr-[20px]">
                        <HiMenu className="w-[24px] h-[24px] cursor-pointer" onClick={() => setShow(!show)} />
                    </div>
                </section>
                {show && (
                    <section className="sticky top-[72px] w-full h-[150px] bg-[#fff] mt-[10px] flex flex-col items-center justify-around sm:hidden">
                        <div className="h-[80px] font-medium flex flex-col items-center gap-[15px]">
                            {Items.map((item, index) => (
                                <NavBarItem {...item} key={index} />
                            ))}
                        </div>
                        <div className="mb-[20px]">
                            <SearchBar />
                        </div>
                    </section>
                )}
            </nav>
        </>
    );
}

export function Session({ user, url }: { user: User | null; url: string }) {
    return (
        <>
            {user ? (
                <div className="w-full flex justify-end items-center mr-[48px]">
                    <Link href="/profile">
                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-[#319795] border-2">
                            <Image
                                width={50}
                                height={50}
                                className="w-full h-full object-contain"
                                src={user.PfP}
                                alt="pfp"
                            />
                        </div>
                    </Link>
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
            )}
        </>
    );
}

export function NavBarItem({ name, link }: { name: string; link: string }) {
    return (
        <>
            <div>
                <Link href={link}>{name}</Link>
            </div>
        </>
    );
}

export function SearchBar() {
    const [input, setInput] = useState('');
    useEffect(() => {}, [input]);

    return (
        <>
            <div className="w-[175px] md:w-[200px] lg:w-[250px]">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <HiSearch
                            className="w-[20px] h-[20px] cursor-pointer"
                            color="#9ca3af"
                            onClick={() => console.log('Start search...')}
                        />
                    </InputLeftElement>
                    <Input
                        type="text"
                        placeholder="Type to search..."
                        value={input}
                        width="100%"
                        onChange={(event) => setInput(event.target.value)}
                        onKeyUp={(event) => {
                            if (event.code === 'Enter') {
                                const params = new URLSearchParams([['q', input]]);
                                //@ts-ignore
                                window.location = `/search?${params.toString()}`;
                            }
                        }}
                    />
                </InputGroup>
            </div>
        </>
    );
}

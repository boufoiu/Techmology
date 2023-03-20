import { Button, ChakraProvider } from '@chakra-ui/react'
import { Manager } from '@/lib'
import Link from 'next/link'
import { NavBar } from '@/components';
import { User } from '@/lib/types';
import { RequestContext } from 'next/dist/server/base-server';

export async function getServerSideProps({ req: { headers: { cookie } } }: RequestContext) {
  const manager = new Manager();
  try {
    const res = await manager.api.login.get();
    const user = await manager.api.session.get({
      headers: { Cookie: cookie }
    });
    return { props: { url: res.url, user } };
  } catch(err) {
    return { props: { url: '/', user: null } };
  }
}

export default function Home({ url, user }: { url: string, user: User | null }) {
  return (
    <>
      <ChakraProvider>
        <NavBar user={user} url={url} />
      </ChakraProvider>
    </>
  )
}

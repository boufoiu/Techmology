import { Button, ChakraProvider } from '@chakra-ui/react'
import { Manager } from '@/lib'
import Link from 'next/link'

export async function getServerSideProps() {
  const manager = new Manager();
  try {
    const res = await manager.api.login.get();
    return { props: { url: res.url } };
  } catch(err) {
    return { props: { url: '/' } };
  }
}

export default function Home({ url }: { url: string }) {
  return (
    <>
      <ChakraProvider>
        <Button
          colorScheme="teal"
          size="md"
        ><Link href={url}>Login</Link></Button>
      </ChakraProvider>
    </>
  )
}

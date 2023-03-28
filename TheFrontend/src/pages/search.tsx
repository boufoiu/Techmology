import { useRouter } from 'next/router';

export default function Search() {
    const router = useRouter();
    const { q } = router.query;
    return <>Search results for: {q}</>;
}

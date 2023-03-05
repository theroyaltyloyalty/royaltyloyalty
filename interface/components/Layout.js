import { Header } from '../components';
import { useIsMounted } from '../hooks';
import ProgressBar from './ProgressBar';

export function Layout({ children }) {
    const isMounted = useIsMounted();

    return (
        <>
            {isMounted && (
                <>
                    <>
                        <ProgressBar />
                        <Header />
                        {children}
                    </>
                </>
            )}
        </>
    );
}

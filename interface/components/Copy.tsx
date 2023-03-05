import { ReactNode, useCallback, useRef } from 'react';

interface Props {
    text: string;
    successText?: string;
    onCopy?: () => void;
    showToaster?: boolean;
    className?: string;
    children: ReactNode;
}

const DURATION = 2000;

export default function Copy({
    text,
    onCopy,
    className,
    children,
}: Props): JSX.Element {
    const lastCopy = useRef<number | undefined>();

    const copyText = useCallback(() => {
        navigator.clipboard.writeText(text);

        if (onCopy) {
            onCopy();
        }
    }, [text, onCopy]);

    const onClick = useCallback(() => {
        const now = Date.now();

        if (!lastCopy.current || now - lastCopy.current > DURATION) {
            lastCopy.current = now;
            copyText();
        }
    }, [copyText]);

    return (
        <div onClick={onClick} className={className}>
            {children}
        </div>
    );
}

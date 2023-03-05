import NextNProgress from 'nextjs-progressbar';

export default function ProgressBar() {
    return (
        <NextNProgress
            color="#FFFFFF"
            startPosition={0.25}
            stopDelayMs={200}
            height={1}
            showOnShallow={false}
            options={{ showSpinner: false }}
        />
    );
}

import BoringAvatar from 'boring-avatars';

export default function Avatar({
    name,
    size,
    square,
    className,
}: {
    name: string;
    size: number;
    square: boolean;
    className?: string;
}) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <BoringAvatar
                name={name}
                size={size}
                variant="marble"
                square={square}
            />
        </div>
    );
}

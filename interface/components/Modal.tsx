import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, ReactNode, useCallback } from 'react';
import { RiCloseLine as IconClose } from 'react-icons/ri';

type ModalProps = {
    drawer?: boolean;
    children: ReactNode;
    isOpen: boolean;
    onClose?: () => void;
    className?: string;
    hideCloseButton?: boolean;
    persistOnClickOutside?: boolean;
};

export default function Modal(props: ModalProps): JSX.Element {
    const { drawer, isOpen, onClose, persistOnClickOutside } = props;
    const DELAY = 450;

    const changeBodyOverflow = useCallback((overflow: string) => {
        setTimeout(() => {
            document.getElementsByTagName('html')[0].style.overflow = overflow;
        }, DELAY);
    }, []);

    return (
        <Transition
            show={isOpen}
            as={Fragment}
            afterEnter={() => changeBodyOverflow('hidden')}
            afterLeave={() => changeBodyOverflow('auto')}
        >
            <Dialog
                onClose={() => (persistOnClickOutside ? null : onClose?.())}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-linear duration-150 transition-all"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-linear duration-150 transition-all"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 z-20 bg-white/20 backdrop-blur-sm"
                        aria-hidden="true"
                    />
                </Transition.Child>
                {drawer ? (
                    <DrawerWrapper {...props} />
                ) : (
                    <DialogWrapper {...props} />
                )}
            </Dialog>
        </Transition>
    );
}

function DialogWrapper(props: Partial<ModalProps>) {
    const { className, hideCloseButton, onClose, children } = props;
    return (
        <Transition.Child
            as={Fragment}
            enter="ease-rk-easing duration-350 transition-all"
            enterFrom="opacity-0 translate-y-[20%]"
            enterTo="opacity-100 translate-y-0"
            leave="ease-rk-easing duration-350 transition-all"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-[20%]"
        >
            <div className="fixed inset-0 top-0 z-30 overflow-auto">
                <div className="flex min-h-full items-end justify-center pt-6 md:items-center md:px-0 md:pb-6">
                    <Dialog.Panel
                        className={classNames(
                            'relative w-full rounded-none bg-black md:rounded-md max-w-[768px]',
                            className
                        )}
                    >
                        {!hideCloseButton && <CloseButton onClose={onClose} />}
                        <div className="relative p-4 sm:p-6">{children}</div>
                    </Dialog.Panel>
                </div>
            </div>
        </Transition.Child>
    );
}

function DrawerWrapper(props: Partial<ModalProps>) {
    const { children, className, hideCloseButton, onClose } = props;

    return (
        <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-350 transition-all"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in-out duration-350 transition-all"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
        >
            <div className="fixed right-0 top-0 z-30 h-full w-full overflow-auto sm:w-auto">
                <div className="h-full w-full overflow-hidden sm:w-[440px] sm:max-w-[440px] sm:p-5">
                    <Dialog.Panel
                        className={classNames(
                            'relative h-full w-full rounded-lg',
                            className || 'bg-black/95'
                        )}
                    >
                        {!hideCloseButton && <CloseButton onClose={onClose} />}
                        <div className="relative h-full overflow-auto p-4 sm:p-6">
                            {children}
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Transition.Child>
    );
}

function CloseButton(props: Partial<ModalProps>) {
    const { onClose } = props;
    return (
        <div className="relative">
            <div className="absolute top-0 right-0 z-40" onClick={onClose}>
                <button onClick={onClose}>
                    <IconClose className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

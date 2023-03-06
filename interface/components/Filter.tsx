import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import classNames from 'classnames';
import {
    RiArrowDownSFill as IconArrowDown,
    RiArrowUpSFill as IconArrowUp,
    RiCheckLine as IconCheck,
} from 'react-icons/ri';

export interface Option {
    label: string;
    value: number;
}

interface Props {
    label: string;
    options: Option[];
    onChange: (selected: number[]) => void;
    selected?: number[];
    className?: string;
}

export default function Filter({
    label,
    options,
    selected,
    onChange,
    className,
}: Props) {
    return (
        <Listbox value={selected} multiple={true} onChange={onChange}>
            {({ open }) => (
                <div className="relative">
                    <Listbox.Button
                        className={`cursor-pointer rounded-md border border-gray-600 text-sm font-bold px-5 py-2 flex items-center select-none ${className}`}
                    >
                        <span className="mr-2">{label}</span>
                        {open ? (
                            <IconArrowUp className="h-4 w-4" />
                        ) : (
                            <IconArrowDown className="h-4 w-4" />
                        )}
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="border border-gray-600 cursor-pointer absolute w-full mt-2 rounded-md bg-black text-sm outline-none">
                            {options.map((option, i) => (
                                <Listbox.Option
                                    key={i}
                                    value={option.value}
                                    className="outline-none select-none"
                                >
                                    {({ selected }) => {
                                        return (
                                            <div
                                                className={classNames(
                                                    'py-2 px-3 flex items-center justify-between',
                                                    selected ? 'bg-white/5' : ''
                                                )}
                                            >
                                                <span>{option.label}</span>
                                                {selected && (
                                                    <IconCheck className="ml-2 h-3 w-3" />
                                                )}
                                            </div>
                                        );
                                    }}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}

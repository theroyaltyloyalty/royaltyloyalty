import { ChangeEvent, forwardRef, Ref } from 'react';
import classNames from 'classnames';
import { RiCheckLine as IconCheck } from 'react-icons/ri';
import { RiSubtractLine as IconSubtract } from 'react-icons/ri';

export enum CheckboxIcons {
    Check = 'CHECK',
    Subtract = 'SUBTRACT',
}

interface CheckboxProps {
    checked?: boolean;
    id?: string;
    icon?: CheckboxIcons;
    name?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const IconComponent: {
    [key in CheckboxIcons]: JSX.Element;
} = {
    [CheckboxIcons.Check]: <IconCheck className="w-4 h-4" />,
    [CheckboxIcons.Subtract]: <IconSubtract className="w-4 h-4" />,
};

const Checkbox = forwardRef(
    (props: CheckboxProps, ref: Ref<HTMLInputElement>) => {
        return (
            <label
                htmlFor={props.id}
                className={classNames(
                    'relative box-border flex h-4 w-4 cursor-pointer select-none items-center overflow-hidden transition-all hover:cursor-pointer',
                    props.className,
                    props.disabled ? 'cursor-not-allowed opacity-50' : ''
                )}
            >
                <input
                    ref={ref}
                    id={props.id}
                    name={props.name}
                    type="checkbox"
                    checked={props.checked}
                    onChange={props.onChange}
                    disabled={props.disabled}
                    className="absolute h-0 w-0 cursor-pointer opacity-0"
                />
                <span
                    className={classNames(
                        'absolute inset-0 flex items-center justify-center border border-gray-600 rounded-sm'
                    )}
                >
                    {props.checked &&
                        IconComponent[props.icon || CheckboxIcons.Check]}
                </span>
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;

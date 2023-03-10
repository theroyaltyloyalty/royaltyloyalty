import { OwnerExtended } from 'types/types';
import OwnerItem from './OwnerItem';
import {
    useContext,
    useMemo,
    Dispatch,
    SetStateAction,
    useCallback,
} from 'react';
import { MainContext } from '../../contexts/MainContext';
import Checkbox, { CheckboxIcons } from 'components/Checkbox';

enum SelectionState {
    NONE,
    SOME,
    ALL,
}

export default function OwnersList({
    owners,
    selectedOwners,
    setSelectedOwners,
}: {
    owners: OwnerExtended[];
    selectedOwners: OwnerExtended[];
    setSelectedOwners: Dispatch<SetStateAction<OwnerExtended[]>>;
}): JSX.Element {
    const { profile } = useContext(MainContext);
    const showFollowing = useMemo(() => Boolean(profile.profileId), [profile]);
    const selectionState = useMemo(() => {
        if (selectedOwners.length === 0) {
            return SelectionState.NONE;
        } else if (selectedOwners.length === owners.length) {
            return SelectionState.ALL;
        } else {
            return SelectionState.SOME;
        }
    }, [selectedOwners.length, owners.length]);

    const handleHeaderCheckboxChange = useCallback(() => {
        if (selectionState === SelectionState.NONE) {
            setSelectedOwners(owners);
        } else {
            setSelectedOwners([]);
        }
    }, [owners, selectionState, setSelectedOwners]);

    const handleItemCheckboxChange = useCallback(
        (owner: OwnerExtended) => {
            const isSelected = selectedOwners.find(
                (o) => o.address === owner.address
            );

            if (isSelected) {
                setSelectedOwners(
                    selectedOwners.filter((o) => o.address !== owner.address)
                );
            } else {
                setSelectedOwners([...selectedOwners, owner]);
            }
        },
        [selectedOwners, setSelectedOwners]
    );

    return (
        <table className="w-full table-auto ">
            <thead className="text-right">
                <tr className="h-12 uppercase text-xs border-b border-b-gray-600">
                    <th className="pr-4">
                        <div className="flex items-center justify-center">
                            <Checkbox
                                checked={
                                    selectionState === SelectionState.ALL ||
                                    selectionState === SelectionState.SOME
                                }
                                icon={
                                    selectionState === SelectionState.SOME
                                        ? CheckboxIcons.Subtract
                                        : CheckboxIcons.Check
                                }
                                onChange={handleHeaderCheckboxChange}
                            />
                        </div>
                    </th>
                    <th className="text-left">Collector</th>
                    <th className="text-center">Loyalty</th>
                    {profile.profileId && (
                        <th className="text-center">Following</th>
                    )}
                    <th>Balance</th>
                    <th>Royalties Paid</th>
                    <th>Royalties Dodged</th>
                    <th>% Royalties Paid</th>
                    <th>Amount Paid</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {owners?.map((owner) => (
                    <OwnerItem
                        key={owner.address}
                        owner={owner}
                        showFollowing={showFollowing}
                        isSelected={Boolean(
                            selectedOwners.find(
                                (o) => o.address === owner.address
                            )
                        )}
                        onCheckboxChange={() => handleItemCheckboxChange(owner)}
                    />
                ))}
            </tbody>
        </table>
    );
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Exchange.sol";
import "./TransferConstants.sol";
import "./Structs.sol";
import "./Errors.sol";

contract TransferHelper {
    function _transferEthAndFinalize(
        uint256 amount,
        address payable to,
        Payment[] calldata additionalRecipients
    ) internal {
        // Put ether value supplied by the caller on the stack.
        uint256 etherRemaining = msg.value;

        // Retrieve total number of additional recipients and place on stack.
        uint256 totalAdditionalRecipients = additionalRecipients.length;

        // Skip overflow check as for loop is indexed starting at zero.
        unchecked {
            // Iterate over each additional recipient.
            for (uint256 i = 0; i < totalAdditionalRecipients; ++i) {
                // Retrieve the additional recipient.
                Payment calldata additionalRecipient = (
                    additionalRecipients[i]
                );

                // Read ether amount to transfer to recipient & place on stack.
                uint256 additionalRecipientAmount = additionalRecipient.amount;

                // Ensure that sufficient Ether is available.
                if (additionalRecipientAmount > etherRemaining) {
                    revert InsufficientEtherSupplied();
                }

                // Transfer Ether to the additional recipient.
                _transferEth(additionalRecipient.to, additionalRecipientAmount);

                // Reduce ether value available. Skip underflow check as
                // subtracted value is confirmed above as less than remaining.
                etherRemaining -= additionalRecipientAmount;
            }
        }

        // Ensure that sufficient Ether is still available.
        if (amount > etherRemaining) {
            revert InsufficientEtherSupplied();
        }

        // Transfer Ether to the offerer.
        _transferEth(to, amount);
    }

    function _transferEth(address payable to, uint256 amount) internal {
        // Declare a variable indicating whether the call was successful or not.
        (bool success, ) = to.call{value: amount}("");

        // If the call fails...
        if (!success) {
            // Revert with a generic error message.
            revert EtherTransferGenericFailure(to, amount);
        }
    }

    /**
     * @dev Internal function to transfer an ERC721 token from a given
     *      originator to a given recipient. Sufficient approvals must be set on
     *      the contract performing the transfer. Note that this function does
     *      not check whether the receiver can accept the ERC721 token (i.e. it
     *      does not use `safeTransferFrom`).
     *
     * @param token      The ERC721 token to transfer.
     * @param from       The originator of the transfer.
     * @param to         The recipient of the transfer.
     * @param identifier The tokenId to transfer.
     */
    function _performERC721Transfer(
        address token,
        address from,
        address to,
        uint256 identifier
    ) internal returns (bool success) {
        // Utilize assembly to perform an optimized ERC721 token transfer.
        assembly {
            // If the token has no code, revert.
            if iszero(extcodesize(token)) {
                mstore(NoContract_error_sig_ptr, NoContract_error_signature)
                mstore(NoContract_error_token_ptr, token)
                revert(NoContract_error_sig_ptr, NoContract_error_length)
            }

            // The free memory pointer memory slot will be used when populating
            // call data for the transfer; read the value and restore it later.
            let memPointer := mload(FreeMemoryPointerSlot)

            // Write call data to memory starting with function selector.
            mstore(ERC721_transferFrom_sig_ptr, ERC721_transferFrom_signature)
            mstore(ERC721_transferFrom_from_ptr, from)
            mstore(ERC721_transferFrom_to_ptr, to)
            mstore(ERC721_transferFrom_id_ptr, identifier)

            // Perform the call, ignoring return data.
            success := call(
                gas(),
                token,
                0,
                ERC721_transferFrom_sig_ptr,
                ERC721_transferFrom_length,
                0,
                0
            )

            // // If the transfer reverted:
            // if iszero(success) {
            //     // If it returned a message, bubble it up as long as sufficient
            //     // gas remains to do so:
            //     if returndatasize() {
            //         // Ensure that sufficient gas is available to copy
            //         // returndata while expanding memory where necessary. Start
            //         // by computing word size of returndata & allocated memory.
            //         // Round up to the nearest full word.
            //         let returnDataWords := div(
            //             add(returndatasize(), AlmostOneWord),
            //             OneWord
            //         )

            //         // Note: use the free memory pointer in place of msize() to
            //         // work around a Yul warning that prevents accessing msize
            //         // directly when the IR pipeline is activated.
            //         let msizeWords := div(memPointer, OneWord)

            //         // Next, compute the cost of the returndatacopy.
            //         let cost := mul(CostPerWord, returnDataWords)

            //         // Then, compute cost of new memory allocation.
            //         if gt(returnDataWords, msizeWords) {
            //             cost := add(
            //                 cost,
            //                 add(
            //                     mul(
            //                         sub(returnDataWords, msizeWords),
            //                         CostPerWord
            //                     ),
            //                     div(
            //                         sub(
            //                             mul(returnDataWords, returnDataWords),
            //                             mul(msizeWords, msizeWords)
            //                         ),
            //                         MemoryExpansionCoefficient
            //                     )
            //                 )
            //             )
            //         }

            //         // Finally, add a small constant and compare to gas
            //         // remaining; bubble up the revert data if enough gas is
            //         // still available.
            //         if lt(add(cost, ExtraGasBuffer), gas()) {
            //             // Copy returndata to memory; overwrite existing memory.
            //             returndatacopy(0, 0, returndatasize())

            //             // Revert, giving memory region with copied returndata.
            //             revert(0, returndatasize())
            //         }
            //     }

            //     // Otherwise revert with a generic error message.
            //     mstore(
            //         TokenTransferGenericFailure_error_sig_ptr,
            //         TokenTransferGenericFailure_error_signature
            //     )
            //     mstore(TokenTransferGenericFailure_error_token_ptr, token)
            //     mstore(TokenTransferGenericFailure_error_from_ptr, from)
            //     mstore(TokenTransferGenericFailure_error_to_ptr, to)
            //     mstore(TokenTransferGenericFailure_error_id_ptr, identifier)
            //     mstore(TokenTransferGenericFailure_error_amount_ptr, 1)
            //     revert(
            //         TokenTransferGenericFailure_error_sig_ptr,
            //         TokenTransferGenericFailure_error_length
            //     )
            // }

            // Restore the original free memory pointer.
            mstore(FreeMemoryPointerSlot, memPointer)

            // Restore the zero slot to zero.
            mstore(ZeroSlot, 0)
        }
    }

    /**
     * @dev Internal function to transfer ERC1155 tokens from a given
     *      originator to a given recipient. Sufficient approvals must be set on
     *      the contract performing the transfer and contract recipients must
     *      implement the ERC1155TokenReceiver interface to indicate that they
     *      are willing to accept the transfer.
     *
     * @param token      The ERC1155 token to transfer.
     * @param from       The originator of the transfer.
     * @param to         The recipient of the transfer.
     * @param identifier The id to transfer.
     * @param amount     The amount to transfer.
     */
    function _performERC1155Transfer(
        address token,
        address from,
        address to,
        uint256 identifier,
        uint256 amount
    ) internal returns (bool success) {
        // Utilize assembly to perform an optimized ERC1155 token transfer.
        assembly {
            // If the token has no code, revert.
            if iszero(extcodesize(token)) {
                mstore(NoContract_error_sig_ptr, NoContract_error_signature)
                mstore(NoContract_error_token_ptr, token)
                revert(NoContract_error_sig_ptr, NoContract_error_length)
            }

            // The following memory slots will be used when populating call data
            // for the transfer; read the values and restore them later.
            let memPointer := mload(FreeMemoryPointerSlot)
            let slot0x80 := mload(Slot0x80)
            let slot0xA0 := mload(Slot0xA0)
            let slot0xC0 := mload(Slot0xC0)

            // Write call data into memory, beginning with function selector.
            mstore(
                ERC1155_safeTransferFrom_sig_ptr,
                ERC1155_safeTransferFrom_signature
            )
            mstore(ERC1155_safeTransferFrom_from_ptr, from)
            mstore(ERC1155_safeTransferFrom_to_ptr, to)
            mstore(ERC1155_safeTransferFrom_id_ptr, identifier)
            mstore(ERC1155_safeTransferFrom_amount_ptr, amount)
            mstore(
                ERC1155_safeTransferFrom_data_offset_ptr,
                ERC1155_safeTransferFrom_data_length_offset
            )
            mstore(ERC1155_safeTransferFrom_data_length_ptr, 0)

            // Perform the call, ignoring return data.
            success := call(
                gas(),
                token,
                0,
                ERC1155_safeTransferFrom_sig_ptr,
                ERC1155_safeTransferFrom_length,
                0,
                0
            )

            // If the transfer reverted:
            // if iszero(success) {
            //     // If it returned a message, bubble it up as long as sufficient
            //     // gas remains to do so:
            //     if returndatasize() {
            //         // Ensure that sufficient gas is available to copy
            //         // returndata while expanding memory where necessary. Start
            //         // by computing word size of returndata & allocated memory.
            //         // Round up to the nearest full word.
            //         let returnDataWords := div(
            //             add(returndatasize(), AlmostOneWord),
            //             OneWord
            //         )

            //         // Note: use the free memory pointer in place of msize() to
            //         // work around a Yul warning that prevents accessing msize
            //         // directly when the IR pipeline is activated.
            //         let msizeWords := div(memPointer, OneWord)

            //         // Next, compute the cost of the returndatacopy.
            //         let cost := mul(CostPerWord, returnDataWords)

            //         // Then, compute cost of new memory allocation.
            //         if gt(returnDataWords, msizeWords) {
            //             cost := add(
            //                 cost,
            //                 add(
            //                     mul(
            //                         sub(returnDataWords, msizeWords),
            //                         CostPerWord
            //                     ),
            //                     div(
            //                         sub(
            //                             mul(returnDataWords, returnDataWords),
            //                             mul(msizeWords, msizeWords)
            //                         ),
            //                         MemoryExpansionCoefficient
            //                     )
            //                 )
            //             )
            //         }

            //         // Finally, add a small constant and compare to gas
            //         // remaining; bubble up the revert data if enough gas is
            //         // still available.
            //         if lt(add(cost, ExtraGasBuffer), gas()) {
            //             // Copy returndata to memory; overwrite existing memory.
            //             returndatacopy(0, 0, returndatasize())

            //             // Revert, giving memory region with copied returndata.
            //             revert(0, returndatasize())
            //         }
            //     }

            //     // Otherwise revert with a generic error message.
            //     mstore(
            //         TokenTransferGenericFailure_error_sig_ptr,
            //         TokenTransferGenericFailure_error_signature
            //     )
            //     mstore(TokenTransferGenericFailure_error_token_ptr, token)
            //     mstore(TokenTransferGenericFailure_error_from_ptr, from)
            //     mstore(TokenTransferGenericFailure_error_to_ptr, to)
            //     mstore(TokenTransferGenericFailure_error_id_ptr, identifier)
            //     mstore(TokenTransferGenericFailure_error_amount_ptr, amount)
            //     revert(
            //         TokenTransferGenericFailure_error_sig_ptr,
            //         TokenTransferGenericFailure_error_length
            //     )
            // }

            mstore(Slot0x80, slot0x80) // Restore slot 0x80.
            mstore(Slot0xA0, slot0xA0) // Restore slot 0xA0.
            mstore(Slot0xC0, slot0xC0) // Restore slot 0xC0.

            // Restore the original free memory pointer.
            mstore(FreeMemoryPointerSlot, memPointer)

            // Restore the zero slot to zero.
            mstore(ZeroSlot, 0)
        }
    }
}

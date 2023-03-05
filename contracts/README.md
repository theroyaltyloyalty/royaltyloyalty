# @royaltyloyalty/contracts

## Background
For ETH Denver, we propose an extension to EIP-2981 that includes a standardized event for royalty payments, a hook for contracts that royalty payment senders can call, and additional configuration options for artists to specify a preferred or enforced currency to be paid in. The specification of a currency is aimed to alleviate the problem that creators might prefer to receive royalties in a specific currency to minimize headaches due to taxes where they're domiciled.  Separately, the addition of a standard RoyaltyPayment event allows creators to more easily track royalty payment trends within their collector base and determine who their most supportive collectors are at any given time.  The main goal of this submission to help Artists and collectors maintain their social contract to support one another.

In addition to the interface, extended EIP-2981 implementation, we have also implemented a sample marketplace that calls the onPaymentReceived hook of the royalty receiver contract. Using this exchange with a token that implements the EIP-2981 and the extension, we can emit an event every time a royalty is or is not respected and index this data off-chain using our custom subgraph.
## Contracts

| Contract                                                              | Address                                                                                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [MockRoyaltyToken](./tests/RoyaltyReceiver.t.sol)                     | [0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03) |
| [Exchange](./src/Exchange.sol)                                        | [0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515](https://etherscan.io/address/0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515) |
| [SimpleRoyaltyReceiver](./src/recievers/SimpleRoyaltyReceiver.sol)    | [0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63](https://etherscan.io/address/0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63) |

## Development

```sh
forge build
```

### Run tests

```sh
forge test
```

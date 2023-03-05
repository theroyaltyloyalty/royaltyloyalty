# Royalty Loyalty

Royalty Loyalty is our submission for the 2023 ETH Denver BUIDLathon. The project includes:
- Several implementations of our proposal for a new royalty interface
- An NFT exchange that implements our proposed interface
- Deployments of the above through a CREATE3 Factory on 6 different EVM test networks
- A Graph subgraph that can index the events of the interface
- A web app that leverages all of the above, the Infura NFT API, and Lens, to aggregate and respond to data about royalty payments.

Whether or not marketplaces respect royalty payments is a hot topic in the current NFT market. The problem we see in this debate is not directly related to enforcement but rather that there is no easy way for a creator to see when and where royalties are respected. With this data, creators would be able to incentivize greater adherance to their defined social contract.

To confront this problem we propose an extension to EIP-2981 that includes a standardized royalty payment event and a payment hook on the token contract that emits this event. Using these two pieces a contract is able to more dynamically respond to the routing and side effects of these payments. 

In addition to the interface implementation, we have also implemented a sample marketplace that responds to our interface and routes royalty payments through the hook. Using this exchange with a mock token we can emit an event every time a royalty is or is not respected and index this data off-chain using our custom subgraph.

Finally, with these pieces, we have created our web app Royalty Loyalty. This dashboard allows creators to easily see what addresses are or are not respecting loyalties. From here the creator can interact with these addresses through integration with Lens and possibly find ways further enforce their unique social contract around royalties.

## CREATE3 Factorys

Deployed at 0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd on:

| Contract                                                              | Address                                                                                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Goerli                                                                | [0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd](https://etherscan.io/address/0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd) |
| Base Goerli                                                           | [0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd](https://etherscan.io/address/0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd) |
| Optimism Goerli                                                       | [0x7f7f488aa05d5cbf7866df916705db67fd0138fd](https://etherscan.io/address/0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63) |
| Arbitrum Goerli                                                       | [0x7f7f488aa05d5cbf7866df916705db67fd0138fd](https://etherscan.io/address/0x7f7f488aa05d5cbf7866df916705db67fd0138fd) |
| Mumbai                                                                | [0x7f7f488aa05d5cbf7866df916705db67fd0138fd](https://etherscan.io/address/0x7f7f488aa05d5cbf7866df916705db67fd0138fd) |
| Mantle                                                                | [0x7f7f488aa05d5cbf7866df916705db67fd0138fd](https://explorer.testnet.mantle.xyz/address/0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd/contracts#address-tabs) |

## React and Solidity Scaffold

## Technologies

Welcome to my custom fullstack scaffold for Web3 🚀

I prefer to use Javascript instead of Typescript for the frontend. 

In the contracts folder you will find an example contract that should pass all the tests. Once you have set up everything you can delete that contract and its correspondent test to write your own. I believe it is easier to check if the scaffold is working right when tests are passing.

This scaffold has been done with launching a quick project in mind, if you are launching a big project you should probably add more configuration.

### Frontend

The front end is really simple, remember it is just a React scaffold. However, I really recommend the [wagmi](https://github.com/wagmi-dev/wagmi) package for smart contract interaction, it makes my life much easier 🙂

While launching quick, I really recommend using the following technologies which are configured but not developed at all:

- [Chakra](https://github.com/chakra-ui/chakra-ui) for styling and fast development.
- [Formik](https://github.com/jaredpalmer/formik) for form handling.
- [Next](https://github.com/vercel/next.js/) for fast and easy SSR, do not lose time thinking about SSR on quick projects.
- [Yup](https://github.com/jquense/yup) for form validation.

As I stated, if you are launching a more professional or optimized project please consider doing your own SSR or Hybrid strategy, projects like [rendertron](https://github.com/GoogleChrome/rendertron) could help in this matter. Further on, I really recommend doing your own CSS architecture for optimization and styling purposes, architectures such as ITCSS can really help and reduce code duplication (DRY principle😉).

### Smart contracts

Here are my favorite technologies to use while developing with Solidity:

- [Hardhat](https://github.com/NomicFoundation/hardhat), perfect for setting up the smart contract development environment.
- [Hardhat-contract-sizer](https://github.com/ItsNickBarry/hardhat-contract-sizer), great to optimize and check smart contracts size in order to avoid the [EIP-170](https://eips.ethereum.org/EIPS/eip-170) 24576kb limit.

Again, this is for quick projects so I prefer to create my custom fixtures for testing.

You should also create your own utilities, constants and so on.

## Quick start
Please read through this setup for smart contracts and interface to work.

- Fork - https://github.com/ferrodri/react-solidity-scaffold/
- Contracts folder
1. Install Node Modules (nvm use / npm install)
2. Run Tests (npx hardhat test)
3. Start a local node (npx hardhat node - *TERMINAL ONE*)
4. Deploy Contracts / Local Blockchain Instance (npx hardhat --network localhost run scripts/deploy.js - *TERMINAL TWO*)

- Interface folder
  
1. Install Node Modules (nvm use / npm install)
2. Build the project (npm run build)
3. Start Project (npm start - *TERMINAL THREE*)

- Connect wallet using Metamask (Must connect to hardhat instance by switching network and importing a hardhat account)
https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node

- Import 1st hardhat account (You can find your private keys in the first terminal where you ran npx hardhat node)
https://mammothinteractive.com/metamask-how-to-get-funds-on-hardhat-network/#:~:text=Click%20on%20your%20account%20icon,This%20account%20has%2010000%20Eth.

*Note*: Sometimes you may need to reset your metamask account to be able to create, vote or execute a proposal:
https://wealthquint.com/reset-metamask-wallet-account-30599/#:~:text=To%20reset%20MetaMask%20Wallet%2C%20In,MetaMask%20Wallet%20will%20be%20reset.
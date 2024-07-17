# hardhat-nft-marketplace
use hardhat to deploy nft marketplace smart contract.

# complie 编译

`npx hardhat compile`

# deploy 部署

## deploy locally 部署到本地

`npx hardhat node`
`npx hardhat ignition deploy ./ignition/modules/BasicNft.js`

## deploy to Testnet Sepolia 部署到测试网Sepolia & verify contract

`npx hardhat ignition deploy ignition/modules/BasicNft.js --network sepolia --verify`
`npx hardhat ignition deploy ignition/modules/NftMarketplace.js --network sepolia --verify`

if some eror occur, you can use `yarn clean-local` to clean the cache and try again from complieing to deploy.

# test 测试

`npx hardhat test`

## test one file 测试单个文件

`npx hardhat test ./test/BasicNft.js`
`npx hardhat test ./test/NftMarketplace.js`

# current contract address 当前合约地址

## BasicNft
https://sepolia.etherscan.io/address/0x7F4f3D34EE208985c9A53f2872C1Ee13aA2AF0EC#code
## NftMarketplace
https://sepolia.etherscan.io/address/0x82b7b7cC7a13829DAE7d8a1648d6bC2662F754E1#code


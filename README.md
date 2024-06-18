# hardhat-nft-marketplace
use hardhat to deploy nft marketplace smart contract.

# deploy 部署

## deploy locally 部署到本地

`npx hardhat node`
`npx hardhat ignition deploy ./ignition/modules/BasicNft.js`

## deploy to Testnet Sepolia 部署到测试网Sepolia & verify contract

`npx hardhat ignition deploy ignition/modules/BasicNft.js --network sepolia --verify`
`npx hardhat ignition deploy ignition/modules/NftMarketplace.js --network sepolia --verify`

# test 测试

`npx hardhat test`

## test one file 测试单个文件

`npx hardhat test ./test/BasicNft.js`
`npx hardhat test ./test/NftMarketplace.js`
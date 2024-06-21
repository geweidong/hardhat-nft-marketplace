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

# test 测试

`npx hardhat test`

## test one file 测试单个文件

`npx hardhat test ./test/BasicNft.js`
`npx hardhat test ./test/NftMarketplace.js`

# current contract address 当前合约地址

## BasicNft
https://sepolia.etherscan.io/address/0xE00588241f2696C101a3834B721BD0b9e40A7d00#code
## NftMarketplace
https://sepolia.etherscan.io/address/0xF6B64e86dD5705eC0952B6843ad3809A528BF9C5#code


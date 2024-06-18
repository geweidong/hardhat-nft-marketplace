const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NftMarketplaceModule", (m) => {

  const NftMarketplace = m.contract("NftMarketplace");

  return { NftMarketplace };
});

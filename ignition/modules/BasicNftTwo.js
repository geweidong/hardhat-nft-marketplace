const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BasicNftModule", (m) => {

  const BasicNft = m.contract("BasicNft");

  return { BasicNft };
});


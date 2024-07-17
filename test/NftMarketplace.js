const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")

describe("Nft Marketplace Unit Tests", function () {
  let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract
  const PRICE = ethers.parseEther("0.1")
  const TOKEN_ID = 0

  beforeEach(async () => {
      accounts = await ethers.getSigners()
      deployer = accounts[0]
      user = accounts[1]
      basicNft = await ethers.deployContract("BasicNft");
      nftMarketplaceContract = await ethers.deployContract("NftMarketplace")
      nftMarketplace = nftMarketplaceContract.connect(deployer)
      await basicNft.mintNft()
      await basicNft.approve(nftMarketplaceContract.target, TOKEN_ID)
  })

  describe("listItem", function () {
      it("emits an event after listing an item", async function () {
          expect(await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)).to.emit(
              "ItemListed"
          )
      })
      it("exclusively items that haven't been listed", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          await expect(
              nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          ).to.be.revertedWithCustomError(nftMarketplace, 'AlreadyListed')
          .withArgs(basicNft.target, TOKEN_ID )
      })
      it("exclusively allows owners to list", async function () {
          nftMarketplace = nftMarketplaceContract.connect(user)
          // 批准用户管理这个 token
          await basicNft.approve(user.address, TOKEN_ID)
          await expect(
              nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotOwner')
          .withArgs()
      })
      it("needs approvals to list item", async function () {
          await basicNft.approve(user.address, TOKEN_ID)
          await expect(
              nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotApprovedForMarketplace')
            .withArgs()
      })
      it("Updates listing with seller and price", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID)
          assert(listing.price.toString() == PRICE.toString())
          assert(listing.seller.toString() == deployer.address)
      })
      it("reverts if the price be 0", async () => {
        const ZERO_PRICE = ethers.parseEther("0")
        await expect(
            nftMarketplace.listItem(basicNft.target, TOKEN_ID, ZERO_PRICE)
        ).revertedWithCustomError(nftMarketplace, "PriceMustBeAboveZero")
          .withArgs()
      })
  })
  describe("cancelListing", function () {
      it("reverts if there is no listing", async function () {
          await expect(
              nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotListed').withArgs(basicNft.target, TOKEN_ID)
      })
      it("reverts if anyone but the owner tries to call", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          await basicNft.approve(user.address, TOKEN_ID)
          await expect(
              nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotOwner').withArgs()
      })
      it("emits event and removes listing", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          expect(await nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)).to.emit(
              "ItemCanceled"
          )
          const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID)
          assert(listing.price.toString() == "0")
      })
  })
  describe("buyItem", function () {
      it("reverts if the item isn't listed", async function () {
          await expect(
              nftMarketplace.buyItem(PRICE, basicNft.target, TOKEN_ID)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotListed').withArgs(basicNft.target, TOKEN_ID)
      })
      it("reverts if the price isn't met", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          await expect(
              nftMarketplace.buyItem(0, basicNft.target, TOKEN_ID)
          ).to.be.revertedWithCustomError(nftMarketplace, 'PriceNotMet').withArgs(basicNft.target, TOKEN_ID, PRICE)
      })
      it("transfers the nft to the buyer and updates internal proceeds record", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          expect(
              await nftMarketplace.buyItem(PRICE, basicNft.target, TOKEN_ID, { value: PRICE })
          ).to.emit("ItemBought")
          const newOwner = await basicNft.ownerOf(TOKEN_ID)
          const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)
          assert(newOwner.toString() == user.address)
          assert(deployerProceeds.toString() == PRICE.toString())
      })
  })
  describe("updateListing", function () {
      it("must be owner and listed", async function () {
          await expect(
              nftMarketplace.updateListing(basicNft.target, TOKEN_ID, PRICE)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotListed').withArgs(basicNft.target, TOKEN_ID)
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          await expect(
              nftMarketplace.updateListing(basicNft.target, TOKEN_ID, PRICE)
          ).to.be.revertedWithCustomError(nftMarketplace, 'NotOwner').withArgs()
      })
      it("reverts if new price is 0", async function () {
          const updatedPrice = ethers.parseEther("0")
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          await expect(nftMarketplace.updateListing(basicNft.target, TOKEN_ID, updatedPrice)).to.be
            .revertedWithCustomError(nftMarketplace, 'PriceMustBeAboveZero').withArgs()
      })
      it("updates the price of the item", async function () {
          const updatedPrice = ethers.parseEther("0.2")
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          expect(
              await nftMarketplace.updateListing(basicNft.target, TOKEN_ID, updatedPrice)
          ).to.emit("ItemUpdateListed")
          const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID)
          assert(listing.price.toString() == updatedPrice.toString())
      })
  })
  describe("withdrawProceeds", function () {
      it("doesn't allow 0 proceed withdrawls", async function () {
          await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWithCustomError(nftMarketplace, 'NoProceeds').withArgs()
      })
      it("withdraws proceeds", async function () {
          await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          await nftMarketplace.buyItem(PRICE, basicNft.target, TOKEN_ID, { value: PRICE })
          nftMarketplace = nftMarketplaceContract.connect(deployer)

          const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)

          const deployerBalanceBefore = await ethers.provider.getBalance(deployer.address)
          const txResponse = await nftMarketplace.withdrawProceeds()
          const transactionReceipt = await txResponse.wait(1)
          const { gasUsed, gasPrice } = transactionReceipt
          const gasCost = gasUsed * gasPrice;

          const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address)
          assert(
              (deployerBalanceAfter + gasCost).toString() ==
                  (deployerProceedsBefore + deployerBalanceBefore).toString()
          )
      })
  })
})
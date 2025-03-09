import { ethers } from "hardhat";
import { expect } from "chai";

describe("CipherPress", function() {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();
    const CipherPress = await ethers.getContractFactory("CipherPress");
    const contract = await CipherPress.deploy();
    return { contract, owner, otherAccount };
  }

  describe("Publishing", function() {
    it("Should publish an article", async function() {
      const { contract, owner } = await deployContract();
      const cid = "QmTest123";

      await expect(contract.publishArticle(cid))
        .to.emit(contract, "ArticlePublished")
        .withArgs(cid, owner.address, await ethers.provider.getBlock("latest").then(b => b!.timestamp));
    });

    it("Should reject empty CID", async function() {
      const { contract } = await deployContract();
      await expect(contract.publishArticle(""))
        .to.be.revertedWith("CID cannot be empty");
    });
  });

  describe("Retrieval", function() {
    it("Should get correct news count", async function() {
      const { contract } = await deployContract();
      await contract.publishArticle("QmTest1", "Test 1");
      await contract.publishArticle("QmTest2", "Test 2");
      expect(await contract.getNewsCount()).to.equal(2);
    });

    it("Should get latest articles", async function() {
      const { contract } = await deployContract();
      await contract.publishArticle("QmTest1", "Test 1");
      await contract.publishArticle("QmTest2", "Test 2");
      const latest = await contract.getLatestArticles(2);
      expect(latest.length).to.equal(2);
      expect(latest[0].title).to.equal("Test 2");
    });
  });
}); 
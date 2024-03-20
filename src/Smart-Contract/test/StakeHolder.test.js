const { assert } = require('chai');

const StakeHolder = artifacts.require('Stakeholder');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Stakeholder', (accounts) => {
    const stakeHolderAddress = accounts[0]; // Assuming the first account is the stakeholder
    let stakeHolderContract;

    before(async () => {
        stakeHolderContract = await StakeHolder.deployed();
    })

    it("Adding Stakeholder", async () => {
        await stakeHolderContract.register("Stakeholder 1", "Location 1", "Role 1", { from: stakeHolderAddress });
        const stakeHolder = await stakeHolderContract.get(stakeHolderAddress);
        assert.isTrue(stakeHolder.isVerified); // Assuming isVerified should be true after registration
    })
})

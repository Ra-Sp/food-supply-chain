const { assert } = require('chai');

const Farmer = artifacts.require('Farmer');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Farmer',(accounts)=>{
    const admin = accounts[0];
    const farmerAddress = accounts[1];
    let farmerContract;

    before(async()=>{
        farmerContract = await Farmer.deployed();
    })


    it("Contract has no farmers",async () =>{
        // Check if farmers list is empty
        const farmersList = await farmerContract.getAddresses();
        assert.equal(farmersList.length, 0);
    })

    it("Adding Farmer", async () =>{
        // Add a farmer
        await farmerContract.registerFarmer("Farmer1", "South India", "Farmer", ["Milk","Cocoa"], {from: farmerAddress});
        // Check if farmer is added successfully
        const farmer = await farmerContract.get(farmerAddress);
        assert.equal(farmer.id != 0, true);            
    })
    
    it("Contract has farmers",async () =>{
        // Check if farmers list is not empty after adding a farmer
        const farmersList = await farmerContract.getAddresses();
        assert.isAbove(farmersList.length, 0);
    })

    describe("Farmer Verification", async () =>{
        it("Only admin can verify farmer", async ()=>{
            // Try verifying farmer with non-admin account
            let err;
            try{
                await farmerContract.verify(farmerAddress,{from: accounts[2]});
            } catch(error){
                err = error
            }
            // Check if an error is thrown
            assert.ok(err instanceof Error)
        })
        it("Verifying Farmer", async () =>{
            // Verify farmer with admin account
            await farmerContract.verify(farmerAddress,{from: admin});
            // Check if farmer is verified
            const farmer = await farmerContract.get(farmerAddress);
            assert.equal(farmer.isVerified, true);
        })
    })
})

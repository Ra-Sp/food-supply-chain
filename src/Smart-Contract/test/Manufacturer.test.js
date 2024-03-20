const { assert } = require('chai');

const Manufacturer = artifacts.require('Manufacturer');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Manufacturer',(accounts)=>{
    const admin = accounts[0];
    const farmerAddress = accounts[1];
    const manufacturerAddress = accounts[2];
    let manufacturerContract;  
    
    before(async () => {
        manufacturerContract = await Manufacturer.deployed();
    })

    it("Contract has no manufacturers",async () =>{
        // Check if manufacturers list is empty
        const manufacturersList = await manufacturerContract.getAddresses();
        assert.equal(manufacturersList.length,0);
    })

    it("Adding Manufacturer", async () =>{
        // Add a manufacturer
        await manufacturerContract.register("Manufacturer 1", "Location", "Manufacturer", {from: manufacturerAddress});
        // Check if manufacturer is added successfully
        const manufacturer = await manufacturerContract.get(manufacturerAddress);
        assert.equal(manufacturer.id != 0, true);            
    })

    it("Contract has manufacturers",async () =>{
        // Check if manufacturers list is not empty after adding a manufacturer
        const manufacturersList = await manufacturerContract.getAddresses();
        assert.isAbove(manufacturersList.length,0);
    })

    describe("Manufacturer Verification", async () =>{
        it("Only admin can verify Manufacturer", async ()=>{
            // Try verifying manufacturer with non-admin account
            let err;
            try{
                await manufacturerContract.verify(manufacturerAddress,{from: accounts[1]});
            } catch(error){
                err = error
            }
            // Check if an error is thrown
            assert.ok(err instanceof Error)
        })
        it("Verifying Manufacturer", async () =>{
            // Verify manufacturer with admin account
            await manufacturerContract.verify(manufacturerAddress,{from: admin});
            // Check if manufacturer is verified
            const manufacturer = await manufacturerContract.get(manufacturerAddress);
            assert.equal(manufacturer.isVerified, true);
        })
    })
})

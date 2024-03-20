const { assert } = require('chai');

const Product = artifacts.require('Product');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Product',(accounts)=>{
    const manufacturerAddress = accounts[1];
    const distributerAddress = accounts[2];
    const consumerAddress = accounts[3];
    const productSerialNo = "123456";
    let productContract;

    before(async () =>{
        productContract = await Product.deployed();
    })

    it(`Adding Product with serialNo: ${productSerialNo}`, async ()=>{
        await productContract.add(productSerialNo, "Product 1",[{ name: "Cocoa", isVerified: true }, { name: "Milk", isVerified: true }], "image_url", {from: manufacturerAddress});
        const product = await productContract.get(productSerialNo);
        assert.isTrue(product.isValue);
        assert.equal(product.manufacturer, manufacturerAddress); 
    })

    it(`Contract has no product with serialNo: ${productSerialNo}`, async ()=>{
        const product = await productContract.get(productSerialNo);
        assert.isFalse(product.isValue);
    })

    describe("Product Ownership", async ()=>{
        it("Updating Ownership", async ()=>{
            // Add the product first
            await productContract.add(productSerialNo, "Product 1",[{ name: "Cocoa", isVerified: true }, { name: "Milk", isVerified: true }], "image_url", {from: manufacturerAddress});

            // Transfer ownership of product from manufacturer to distributor
            await productContract.transfer(distributerAddress, productSerialNo, {from: manufacturerAddress});
            let product = await productContract.get(productSerialNo);
            assert.equal(product.currentOwner, distributerAddress); 

            // Transfer ownership of product from distributor to consumer
            await productContract.transfer(consumerAddress, productSerialNo, {from: distributerAddress});
            product = await productContract.get(productSerialNo);
            assert.equal(product.currentOwner, consumerAddress); 
        })

    })

})

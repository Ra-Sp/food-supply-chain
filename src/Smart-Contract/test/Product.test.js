const Product = artifacts.require("Product");

contract("Product", (accounts) => {
  let productInstance;

  beforeEach(async () => {
    productInstance = await Product.new();
  });

  it("Should add a product", async () => {
    const productId = 1;
    const title = "Test Product";
    const rawProducts = [{ name: "RawProduct1", isVerified: true }];
    const imageURL = "https://example.com/image.jpg";

    await productInstance.add(productId, title, rawProducts, imageURL);

    const retrievedProduct = await productInstance.get(productId);
    assert.equal(retrievedProduct.item.id, productId, "Product ID mismatch");
    assert.equal(retrievedProduct.item.title, title, "Product title mismatch");
    assert.equal(retrievedProduct.item.image_url, imageURL, "Image URL mismatch");
  });

  it("Should transfer ownership of a product", async () => {
    const productId = 1;
    const newOwner = accounts[1];

    await productInstance.add(productId, "Test Product", [], "https://example.com/image.jpg");

    await productInstance.transfer(newOwner, productId);

    const retrievedProduct = await productInstance.get(productId);
    assert.equal(retrievedProduct.item.currentOwner, newOwner, "Ownership transfer failed");
  });


});

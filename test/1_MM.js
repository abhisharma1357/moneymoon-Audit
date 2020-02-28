const MMToken = artifacts.require('MMToken.sol');
const TokenA = artifacts.require('TokenA.sol');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('Money Moon Token Contract', async (accounts) => {

  it('Should correctly initialize constructor values of MoonX Token Contract', async () => {
    
    this.tokenhold = await MMToken.new({from : accounts[0], gas: 60000000 });
  
  });

  it('Should check the Total Supply of Moon Money Tokens', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply/10**18,2400000000); 

  });

  it('Should check the Name of a token of Moon Money contract', async () => {

    let name = await this.tokenhold.name();
    assert.equal(name,'MM Moon Money'); 

  });

  it('Should check the symbol of a token of Moon Money contract', async () => {

    let symbol = await this.tokenhold.symbol();
    assert.equal(symbol,'MM'); 

  });

  it('Should check the decimal of a token of Moon Money contract', async () => {

    let decimal = await this.tokenhold.decimals();
    assert.equal(decimal.toNumber(),18); 

  });

  it('Should check the Owner of a Moon Money token contract', async () => {

    let owner = await this.tokenhold.owner();
    assert.equal(owner, accounts[0]); 

  });

  it('Should check the balance of a Owner', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,2400000000); 

  });

  it('Should Not be able to transfer tokens to accounts[1] without having token', async () => {

   try{
    let balanceOfSender = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfSender,0);
    await this.tokenhold.transfer(accounts[2],web3.utils.toHex(1*10**18), { from: accounts[1], gas: 5000000 });

   }catch(error){
    var error_ = 'Returned error: VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');
   }

  });

  it('Should be able to transfer tokens to accounts[1]', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,2400000000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiary,0); 
    await this.tokenhold.transfer(accounts[1],web3.utils.toHex(10*10**18), { from: accounts[0], gas: 5000000 });
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater/10**18,2399999990);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiaryLater/10**18,10); 

  });
  
  it("should Approve address[3] to spend specific token on the behalf of owner", async () => {
  
    this.tokenhold.approve(accounts[3], web3.utils.toHex(60*10**18), { from: accounts[0] });
    let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowance/10**18,60, "allowance is wrong when approve");
  
  });

  it('Should be able to transfer tokens to accounts[3] it self after approval from accounts[0]', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,2399999990);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiary/10**18,0); 
    await this.tokenhold.transferFrom(accounts[0],accounts[3],web3.utils.toHex(60*10**18), { from: accounts[3], gas: 5000000 });
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater/10**18,2399999930);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiaryLater/10**18,60);
  });
    
  it("Should Not be able to transfer ownership of Sparkle token Contract from Non Owner Account", async () => {
   
   try{
    let owner = await this.tokenhold.owner();
    assert.equal(owner, accounts[0]); 
    await this.tokenhold.transferOwnership(accounts[9], { from: accounts[1] });
   }catch(error){
    var error_ = 'Returned error: VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');
   }
  });
  
  it("Should be able to transfer ownership of MoonX token Contract ", async () => {
   
    let owner = await this.tokenhold.owner();
    assert.equal(owner, accounts[0]); 
    await this.tokenhold.transferOwnership(accounts[9], { from: accounts[0] });
    let newOwner = await this.tokenhold.newOwner();
    assert.equal(newOwner, accounts[9]);
  });

  it("Should Not be able to accept Ownership of token contract", async () => {
  
     try{

      let newOwner = await this.tokenhold.newOwner();
      assert.equal(newOwner, accounts[9]); 
      await this.tokenhold.acceptOwnership({from : accounts[7]});
     }catch(error){
      var error_ = 'Returned error: VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
     }

  });
  
  it("Should be able to accept Ownership of token contract", async () => {
   
    let newOwner = await this.tokenhold.newOwner();
    assert.equal(newOwner, accounts[9]); 
    await this.tokenhold.acceptOwnership({from : accounts[9]});
  });

  it('Should Not be able to burn tokens more than balance', async () => {

  try{    
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiary/10**18,10);
    await this.tokenhold.burn(web3.utils.toHex(900*10**18),{ from: accounts[1], gas: 5000000 });}
    catch(error){
      var error_ = 'Returned error: VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }
  
  });

  it('Should be able to burn tokens', async () => {

    await this.tokenhold.burn(web3.utils.toHex(9*10**18),{ from: accounts[1], gas: 5000000 });
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiaryLater/10**18,1);  
  });

  it('Should correctly initialize constructor values of sample Token Contract', async () => {
    
    this.sampleHold = await TokenA.new(accounts[0],{from : accounts[0], gas: 60000000 });
  
  });

  it('Should check the balance of a sample contract Owner', async () => {

    let balanceOfOwner = await this.sampleHold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,1000); 

  });

  it('Should be able to transfer sample tokens to MM token contract', async () => {

    let balanceOfOwner = await this.sampleHold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,1000);
    let balanceOfBeneficiary = await this.sampleHold.balanceOf(this.tokenhold.address);
    assert.equal(balanceOfBeneficiary,0); 
    await this.sampleHold.transfer(this.tokenhold.address,web3.utils.toHex(10*10**18), { from: accounts[0], gas: 5000000 });
    let balanceOfOwnerLater = await this.sampleHold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater/10**18,990);
    let balanceOfBeneficiaryLater = await this.sampleHold.balanceOf(this.tokenhold.address);
    assert.equal(balanceOfBeneficiaryLater/10**18,10); 

  });

  it('Should be able to transfer sample tokens to owner of mm tokens, sent to contract of mm tokens', async () => {

    let balanceOfOwnerMMToken = await this.sampleHold.balanceOf(accounts[9]);
    assert.equal(balanceOfOwnerMMToken,0);
    let balanceOfBeneficiary = await this.sampleHold.balanceOf(this.tokenhold.address);
    assert.equal(balanceOfBeneficiary/10**18,10);
    await this.tokenhold.transferAnyERC20Token(this.sampleHold.address,web3.utils.toHex(10*10**18), {from: accounts[9], gas: 5000000});
    let balanceOfOwnerLater = await this.sampleHold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater/10**18,990);
    let balanceOfBeneficiaryLater = await this.sampleHold.balanceOf(accounts[9]);
    assert.equal(balanceOfBeneficiaryLater/10**18,10); 

  });
    
})


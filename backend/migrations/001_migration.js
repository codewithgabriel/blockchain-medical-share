var MyContract = artifacts.require("MedicalDataSharing");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};

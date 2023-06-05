require("@nomicfoundation/hardhat-toolbox");


/* @type import('hardhat/config').HardhatUserConfig */






module.exports = {
  networks: {
    hardhat: {


    },
    Pando_Testnet: {
      url: `https://testnet.ethrpc.pandoproject.org/rpc']`,
      accounts: ["f3bd7440ecc156f71d17be74813efa82057b57d2786fee8e4005baeccd6f5c20"],
      chainId: 3602,
      gasPrice: 4000000000000
    },

    Theta_Testnet: {
      url: `https://eth-rpc-api-testnet.thetatoken.org/rpc']`,
      accounts: ["f3bd7440ecc156f71d17be74813efa82057b57d2786fee8e4005baeccd6f5c20"],
      chainId: 365,
      gasPrice: 4000000000000
    },


    
  },

  solidity: "0.8.7",
};
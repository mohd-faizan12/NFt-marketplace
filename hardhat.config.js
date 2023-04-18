require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports ={
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

      // goerli: {
      //   url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      //   accounts: ["f3bd7440ecc156f71d17be74813efa82057b57d2786fee8e4005baeccd6f5c20"]
      // },

    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/KXyrRyGK9-32E0v0PvHI8RzqTffJMGdP`,
      accounts: [`0xf3bd7440ecc156f71d17be74813efa82057b57d2786fee8e4005baeccd6f5c20`],
      gas: 5500000,
      gasPrice: 7000000000
    },
    
  },

  

  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
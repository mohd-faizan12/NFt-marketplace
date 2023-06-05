// To Use env file Variables
require('dotenv').config();
const response = require("../Exception-handeling/Exceptionhandeling");


const Web3 = require("web3");

// Artifact of FixedCategoryContract 
const compileData = require("../artifacts/contracts/openmarket.sol/NFTMarketplace.json");

// To print statements on terminal without using console.log
const {createModulerLogger}= require("../LoggerServices/loggerservices")
const  logger  = createModulerLogger("userServices");

class readToken {

 /** 
     * @author vishal mendiratta
     * @param {string} owner who has deploy the smart contract or has owner of particular supply of token
     * @returns {number, string, boolean} return particular type of data
     */
 async getallnfts(req,res) {
    try {

        const web3 = await new Web3(
            "https://testnet.ethrpc.pandoproject.org/rpc"
        );
        logger.info(
            `200 : Web3 connection with Blockchain has built successfully`
        );
        // const account = await web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY}`);
        // logger.info(`200 : Account address : ${account.address}`);
        let abi = compileData.abi;
        const contract = await new web3.eth.Contract(
            abi,
            process.env.Contract_Adress
        );
        
          let  result = await contract.methods.getAllNFTs().call();
            console.log(result);
   

        if (!result) {
            return response.error_Bad_request("something went wrong", error);
        }
     
        return response.Success("final",result);
    } catch (error) {
        console.log(error)
        logger.error(`404: error: ${error.message}`);
        return response.error_Bad_request("something went wrong", error);
    }
}
}



module.exports = new readToken();
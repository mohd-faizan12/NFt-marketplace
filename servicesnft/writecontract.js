// To Use env file Variables
require('dotenv').config();
const response = require("../Exception-handeling/Exceptionhandeling");
const nftSchema = require("../db/createNftmodel");


const Web3 = require("web3");

// Artifact of FixedCategoryContract 
const compileData = require("../artifacts/contracts/openmarket.sol/NFTMarketplace.json");

// To print statements on terminal without using console.log
const {createModulerLogger}= require("../LoggerServices/loggerservices")
const  logger  = createModulerLogger("userServices");


class writetoken{
/**
     * @desc do transaction for unitoken to other adresses
     * @param {string} recipientAddr whom address we want to send some token.
     * @param {number} UNIBTAmountInWei manipulate with token amount
     */
 async createtoken(Credential) {
    try {

        if (!Credential.itemname){
        return response.error_Bad_request("Please don't leave any field empty");
        }

        const datasave = new nftSchema({
            itemname:Credential.itemname,
            supply:Credential.supply,
            blockchain:Credential.blockchain,
            collection:Credential.collection,
            description:Credential.description,
            imagehash:Credential.imagehash,
            thumbnailhash:Credential.thumbnailhash,
            amount:Credential.amount

        })
        await datasave.save();
        logger.info(datasave);
        // const value = amount;
        // const UNIBTAmountInWei = Web3.utils.toWei(`${value}`, "ether");
        let senderPrivateKey=Credential.senderPrivateKey;

        senderPrivateKey = senderPrivateKey.startsWith("0x")
            ? senderPrivateKey
            : "0x" + senderPrivateKey;
        if (senderPrivateKey.length !== 66) {
            logger.error(
                "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
            );
            return res
            .status(404)
            .json({
                Error:"owner is invalid, Please pass 40 or 42 bits long alpha-numeric string"
    });
        }

        const web3 = await new Web3(
            "https://testnet.ethrpc.pandoproject.org/rpc"
        );
        logger.info(
            `200 : Web3 connection with Blockchain has built successfully`
        );
        const account = await web3.eth.accounts.wallet.add(senderPrivateKey);
        logger.info(`200 : Account address : ${account.address}`);

        let abi = compileData.abi;
        const contract = await new web3.eth.Contract(
            abi,
            process.env.Contract_Adress
        );
        let dataFunction;
        if (process.env.recipientAddr && Credential.amount) {
            dataFunction = contract.methods
                .createToken("process.env.recipientAddr",Credential.amount)
                .encodeABI();
        }

        if (!dataFunction) {
            return res.status(404).json({Error:"please pass all feilds"});
        }
        const count = await web3.eth.getTransactionCount(account.address);

        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                from: account.address,
                nonce: web3.utils.toHex(count),
                gas: web3.utils.toHex(10000000),
                to: process.env.Contract_Adress,
                data: dataFunction,
                value:100000000000000
            },
            senderPrivateKey
        );

        // Deploy transaction
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
    

        logger.info(
            `Transaction successful with hash: ${createReceipt.transactionHash}`
        );
        logger.info(
            `Transaction details: ${JSON.stringify(createReceipt, null, "  ")}`
        );
        return response.Success("final",createReceipt);
    } catch (err) {
        console.log("ljaljs",err);
        logger.error(`404: error: ${err.message}`);
        return response.error_Bad_request("something went wrong", err);
    }
}


}

module.exports = new writetoken();
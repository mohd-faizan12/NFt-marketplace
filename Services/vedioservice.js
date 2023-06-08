var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs')
const Web3 = require("web3");
const compileData = require("../artifacts/contracts/openmarket.sol/NFTMarketplace.json");


const nftSchema = require("../db/createNftmodel");

// Require the package
const QRCode = require('qrcode')

const response = require("../Exception-handeling/Exceptionhandeling");
const {createModulerLogger}= require("../LoggerServices/loggerservices")
const  logger  = createModulerLogger("userServices");


class vedioservices {

  async UploadVedio(Credential) {

    try {

      const result = await axios({        // Deploy transaction

          method: 'post',
          url: process.env.VEDIO_UPLOAD,
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDVjNDhkOS1jZTRlLTQwZjktYjRhMS01NTg0YmY4Nzc3ZjAiLCJlbWFpbElkIjoicGFyZGVlcC5yYWdoYXZAdW5pYmxvay5pbyIsImlhdCI6MTY4MjkyNjkzMH0.glAAP4930heIAzekAYLvCQl4Yyje3Y7juFCkbjnNxGY',
          },
          data: {
            "purposeCode": "3",
            "securityKey": "public"
        },
        })
      //  axios(result)
        if (result && result.data && result.data.url) {
          let data1 = `https://${result.data.url}/fileupload`;          
            var formData = new FormData();
            formData.append('sessionKey', result.data.sessionKey);
            formData.append('files', Credential.video[0].buffer, Credential.video[0].originalname)     
            formData.append('files', Credential.video[1].buffer, Credential.video[1].originalname)     


            // formData.append('files', fs.createReadStream(`/home/dell/Desktop/NFT-Marketplace/uploads/${Credential.video.filename}`))     
              const result1 = await axios({
                method: 'post',
                url: data1,
                headers: {
                  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDVjNDhkOS1jZTRlLTQwZjktYjRhMS01NTg0YmY4Nzc3ZjAiLCJlbWFpbElkIjoicGFyZGVlcC5yYWdoYXZAdW5pYmxvay5pbyIsImlhdCI6MTY4MTE5ODUwMX0.yqgZVKHt1JhgtXFmVHNjRaOHCzeFKLHpBka22hcLj4A',
                  ...formData.getHeaders()
                },
                data: formData
              })
              // axios(result1)
              logger.info(result1,result1.data.responseArray,result.data.sessionKey);
            
            //   fs.unlink(`/home/dell/Desktop/NFT-Marketplace/uploads/${Credential.video.filename}`, (err) => {
            //     if (err) {
            //         return response.error_Bad_request("file not deleted internally", err);
            //     }
            
            //     logger.info("Delete File successfully.");
            // });          


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
       
       
        let data2 = `https://${result.data.url}/filedownload?fileId=${result1.data.responseArray[0].fileId}&sessionKey=${result.data.sessionKey}`;
        let data3 = `https://${result.data.url}/filedownload?fileId=${result1.data.responseArray[1].fileId}&sessionKey=${result.data.sessionKey}`;
        console.log(data2)
        console.log(data3)
        console.log("transactionHash",createReceipt.transactionHash)
        console.log(account.address)

            return response.Success("final",{...result1.data.responseArray,"sessionKey":result.data.sessionKey,"transactionHash":createReceipt.transactionHash});
          // result1.data.responseArray[0].fileId
  

        } else {
          return response.error_Bad_request("please pass valid file");
        }
    }
    catch (err) {
      console.log(err);
      logger.error("internal server error", err);
      return response.error_Bad_request("internal serveer error", err);
    }
  }





  async qrcodeCreate(Credential) {

    try {

      let data = {
        name:Credential.name,
        age:Credential.age,
        department:Credential.department,
        id:Credential.id
    }
     
    // Converting the data into String format
    let stringdata = JSON.stringify(data)
     let  temp;
    // Print the QR code to terminal
    QRCode.toString(stringdata,{type:'terminal'},
    function (err, QRcode) {
     
        if(err) return console.log("error occurred")
     
        // Printing the generated code
        temp = QRcode
        // return response.Success("final",QRcode);
    })
     console.log(temp)

     return response.Success("final",temp);
       
    // Converting the data into base64
    let codeqr ;
    QRCode.toDataURL(stringdata, function (err, code) {
        if(err) return console.log("error occurred")
     
        // Printing the code
        // console.log(code)
        codeqr = code
        return ;
        
    })
    // console.log(codeqr)
    // return response.Success("final",codeqr);

    }
    catch (err) {
      console.log(err);
      logger.error("something went wrong", err);
      return response.error_Bad_request("something went wrong", err);
    }
  }
  async userFollowing(){
    


  }
}

module.exports = new vedioservices();


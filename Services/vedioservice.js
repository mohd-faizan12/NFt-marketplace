var axios = require('axios');
var FormData = require('form-data');

const response = require("../Exception-handeling/Exceptionhandeling");
const {createModulerLogger}= require("../LoggerServices/loggerservices")
const  logger  = createModulerLogger("userServices");


class vedioservices {

  async UploadVedio(Credential, userData) {

    try {
      var data = new FormData();
      data.append('purposeCode', '3');
      data.append('securityKey', 'key');
      data.append('domain', 'key');
      if (data) {

        const result = await axios({
          method: 'post',
          url: process.env.PAYMENT_URL,
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDVjNDhkOS1jZTRlLTQwZjktYjRhMS01NTg0YmY4Nzc3ZjAiLCJlbWFpbElkIjoicGFyZGVlcC5yYWdoYXZAdW5pYmxvay5pbyIsImlhdCI6MTY4MTE5ODUwMX0.yqgZVKHt1JhgtXFmVHNjRaOHCzeFKLHpBka22hcLj4A',
            ...data.getHeaders()
          },
          data: data
        })

        axios(result)
          .then(function (response) {
            logger.info(JSON.stringify(response.data));
          })
          .catch(function (error) {
            logger.info(error);
          });


        if (result && result.data) {
          data["txHash"] = result.data.result.TxHash;
          let final = new testModel(data);
          await final.save();
          return response.Success(final);
        } else {
          return response.error_Bad_request("something went wrong");
        }

      }
    }
    catch (err) {
      logger.error("payment status could not be updated", err);
      return response.error_Bad_request("payment status could not be updated", err);
    }

  }
}
module.exports = new vedioservices();
var axios = require('axios');
var FormData = require('form-data');

const response = require("../Exception-handeling/response");



class vedioservices {

async UploadVedio(Credential, userData) {

  try {
    var data = new FormData();
      data.append('purposeCode', '3');
      data.append('securityKey', 'key');
      data.append('domain', 'key');
      if(data){
    
      const result = await axios({
          method: 'post',
          url: process.env.PAYMENT_URL,
          headers: { 
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDVjNDhkOS1jZTRlLTQwZjktYjRhMS01NTg0YmY4Nzc3ZjAiLCJlbWFpbElkIjoicGFyZGVlcC5yYWdoYXZAdW5pYmxvay5pbyIsImlhdCI6MTY4MTE5ODUwMX0.yqgZVKHt1JhgtXFmVHNjRaOHCzeFKLHpBka22hcLj4A', 
            ...data.getHeaders()
          },
          data : data
      })

      axios(result)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});


      if (result&&resul) {
          data["txHash"] = result.data.result.TxHash;
          let final = new testModel(data);
          await final.save();
          return response.sendSuccess(final);
      }else{
          return response.sendError("something went wrong");
      }

  }}
  catch (err) {
      console.debug("payment status could not be updated", err);
      return response.sendError("payment status could not be updated", err);
  }

}
}
module.exports = new vedioservices();
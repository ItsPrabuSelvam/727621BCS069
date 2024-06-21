const axios = require('axios');


async function createNewAccessToken()
{
    /* const clientId = "c8ed9795-4300-47b0-8550-3d2459be6a67";
    const clientSecret = "IXlSQXnBLVTXuZiI"; */

    try{
        const response = await axios.post('http://20.244.56.144/test/auth',{
            "companyName": "Prabu's Company",
            "clientID": "c8ed9795-4300-47b0-8550-3d2459be6a67",
            "clientSecret": "IXlSQXnBLVTXuZiI",
            "ownerName": "PrabuSelvam Natarajan",
            "ownerEmail": "727621BCS069@mcet.in",
            "rollNo": "727621BCS069"
        })

        return response.data.access_token? response.data.access_token: null;
    }
    catch(err)
    {
        console.log(`Error in Creating New Access Token : ${err}`);

    }



}

module.exports = createNewAccessToken;
const exp = require('express');
const axios = require('axios');
const createNewAccessToken = require('./newTokenGenerator.js');
const { v4: uuidv4 } = require('uuid');

const app = exp();
const port = 80;

app.listen(port, () => {
    console.log(`listening on port : ${port}`)
});


app.get('/categories/:categoryname/products', async (req, res) => {

    const Affor_URL = "http://20.244.56.144/test";
    const companyName = "FLP";

    const categoryname = req.params.categoryname;
    let n = parseInt(req.query.n);
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const sort = req.query.sort ? req.query.sort : null;

    if(n>10)
        {
            n = n%10;
        }

    n=page*10 + n;

    const minPrice = req.query.minPrice ? req.query.minPrice : "1";
    const maxPrice = req.query.maxPrice ? req.query.maxPrice : "10000";








    try {

        const AccessToken = await createNewAccessToken();
        console.log(`Access token : ${AccessToken}`);

        const parameter = {
            "top": n,
            "minPrice": minPrice,
            "maxPrice": maxPrice
        };

        console.log(parameter)
        const url = `${Affor_URL}/companies/${companyName}/categories/${categoryname}/products`;

        console.log(url)

        const result = await axios.get(url, {
            params : parameter,
            headers: {
                Authorization: `Bearer ${AccessToken}`
            }
        })
        //console.log('hiii');
        //console.log(result);
        let data = result.data;
        if(page >0)
            {
                data = data.slice((page) * 10,data.length);
            }

        


        const productsWithIds = data.map(product => ({
            ...product,
            id: uuidv4()
        }));

        console.log(productsWithIds);
        res.json({
            category: categoryname,
            products: productsWithIds
        });

    }
    catch (err) {
        console.log(`An Error Occured -- ${err}`);
        res.status(500).json({ err: `Error Occured in Fetching Products == ${err}` });
    }



    


    
})
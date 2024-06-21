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
    let page = 0;

    const categoryname = req.params.categoryname;
    let n = parseInt(req.query.n);
    const sort = req.query.sort ? req.query.sort : null;
    const ord = req.query.order ? req.query.order : "ASC";

    const order = (ord.toLowerCase()==="asc") ? true : (ord.toLowerCase() === "des" ? false : (res.status(400).send("Bad Request on Order. option ASC or DES")) )



    if (n > 10) {
        page = req.query.page ? parseInt(req.query.page) : 0;
        if (page == 0) {
            res.status(412).send("Error : If Number is Greater than 10.Then You Should Add a page param");
        }
    }


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
            params: parameter,
            headers: {
                Authorization: `Bearer ${AccessToken}`
            }
        })
        //console.log('hiii');
        //console.log(result);
        let data = result.data;

        if (sort !== null) {
            switch(sort.toLowerCase())
            {
                case "rating":
                    {
                        order ? data.sort((a,b)=> a.rating - b.rating) : data.sort((b,a)=> a.rating - b.rating)
                        break;
                    }
                case "price":
                    {
                        order ? data.sort((a,b)=> a.price - b.price) : data.sort((b,a)=> a.price - b.price)
                        break;
                    }
                case "company":
                    {
                        order ? data.sort((a,b)=> a.companyName - b.companyName) : data.sort((b,a)=> a.companyName - b.companyName)
                        break;
                    }
                case "discount":
                    {
                        order ? data.sort((a,b)=> a.discount - b.discount) : data.sort((b,a)=> a.discount - b.discount);
                        break;
                    }
                default:
                    {
                        res.status(400).send("The Sorting Order Should be Either - Rating,Company,Price,Discount")
                    }
            }
        }


        console.log(data.length);
        if (page > 0) {
            data = data.slice((page - 1) * 10, Math.min(data.length, page * 10));
            console.log(data.length)
        }




        const productsWithIds = data.map(product => ({
            ...product,
            id: uuidv4()
        }));



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




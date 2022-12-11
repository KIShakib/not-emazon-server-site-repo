const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());


//  URI & MongoDB Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mogodb-practice.uoisaxb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// API
function mongodbDatabase() {

    try {
        const productCollection = client.db("emajon-shopping-cart-app").collection("products");
        app.get("/", (req, res) => {
            res.send("Ema Jon Server API Is Connected")
        })
        app.get("/products", async (req, res) => {
            const perPageProduct = parseInt(req.query.perPageProduct);
            const currentPage = parseInt(req.query.currentPage);
            const skipProducts = currentPage * perPageProduct;
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(skipProducts).limit(perPageProduct).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products });
        })

        app.post("/productsByIds", async (req, res) => {
            const ids = req.body;
            const objetIds = ids?.map(id => ObjectId(id));
            const query = { _id: { $in: objetIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    catch (err) {
        console.log(err.message);
    }
}
mongodbDatabase()


// Listen
app.listen(port, () => (console.log(`Ema Jon Server Is Running on ${port}`)));
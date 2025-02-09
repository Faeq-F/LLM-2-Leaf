fetch('https://api.ipify.org?format=json').then(async (response) => {
  console.log(await response.json())
})

//Setup db connection
var Express = require('express')
const cors = require('cors')

var multer = require('multer')
var MongoClient = require('mongodb').MongoClient
const app = Express()
app.use(cors())
app.set('case sensitive routing', true) //required to pass the correct names of collections, etc.

/** reusable instance of db @type{any} */
var database

MongoClient.connect(
  'mongodb+srv://faeq:abcd@llm2leaf.asj1n.mongodb.net/?retryWrites=true&w=majority&appName=LLM2LEAF',
)
  .then((client) => {
    database = client.db('LLM2LEAF')
    console.log('Connected to mongo db')
    app.listen(5038, () => {
      console.log('App server is running on port 5038')
    })
  })
  .catch((err) => console.error(err))

//get documents from a collection
app.get(
  '/api/get/collection/:name',
  (/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
    let result = async (/** @type {string} */ collection) => {
      let dbCollection = database.collection(collection)
      let result = await dbCollection.find()
      return await result.toArray()
    }
    result(request.params.name.toString()).then((result) => response.send(result))
  },
)

//insert a document into a collection
app.post(
  '/api/insert/collection/:name',
  multer().none(),
  (/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
    let result = async (/** @type {string} */ collection) => {
      const formData = request.body
      const rec = await database.collection(collection).insertOne(JSON.parse(formData.newData))
      return rec.insertedId
    }
    result(request.params.name.toString())
      .then((result) => {
        response.send(result)
      })
      .catch((error) => {
        console.log(error)
        return error
      })
  },
)

app.post(
  '/api/pledge',
  multer().none(),
  (/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
    let result = async () => {
      const formData = request.body

      return await fetch('https://api.verdn.com/v2/pledge-transaction', {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer verdn_sk_test_2bziggekue9mp694xdzai11zn0sbviizvs9c536evn7vlionvl69u9vmpfc',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: 'order_123',
          recipient: {
            email: formData.email,
          },
          pledges: [
            {
              impact: {
                offeringId: 'io_01J4RSBX6KPQ4RYCRZ8C4QWRHF',
                amount: parseFloat(formData.amount),
              },
            },
          ],
        }),
      }).catch((err) => console.error(err))
    }

    result()
      .then(async (result) => {
        await response.send(result)
      })
      .catch((error) => {
        console.log(error)
        return error
      })
  },
)

const hfApp = Express()
const path = require('path')
hfApp.use(cors())

// Handles any requests that don't match the ones above
hfApp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

hfApp.listen(7860, () => {
  console.log('hfApp listening on 7860')
})

//Setup db connection
var Express = require('express')
var multer = require('multer')
const cors = require('cors')
const path = require('path')
const app = Express()
app.use(cors())

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

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(5038, () => {
  console.log('Listening on 5038')
})

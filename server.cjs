//Setup db connection
var Express = require('express');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;
const app = Express();
const cors = require('cors');
const multer = require('multer'); // used for accessing form data
app.use(cors());
app.set('case sensitive routing', true); //required to pass the correct names of collections, etc.

/** reusable instance of db @type{any} */
var database;

/**
 * Opens port 5038 for the api & creates a reusable instance of a database connection using the environment variables from the .env file.
 * .env file must have credentials placed in the DB_NAME and DB_API_URL keys
 */
app.listen(7860, () => {
	MongoClient.connect(
		"mongodb+srv://faeq:<db_password>@llm2leaf.asj1n.mongodb.net/?retryWrites=true&w=majority&appName=LLM2LEAF",
		async (/** @type {any} */ error, /** @type {{ db: (arg0: any) => any; }} */ client) => {
			database = client.db("LLM2LEAF");
			if (error) console.error(error);
			console.log(`server-side is running at port 5038\nConnected`);
		}
	);
});

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
//Define db routes
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

//get documents from a collection
app.get(
	'/api/get/collection/:name',
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection) => {
			let dbCollection = database.collection(collection);
			let result = await dbCollection.find();
			return await result.toArray();
		};
		result(request.params.name.toString()).then((result) => response.send(result));
	}
);

//▰▰▰▰▰▰▰▰▰

//insert a document into a collection
app.post(
	'/api/insert/collection/:name',
	multer().none(),
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection) => {
			const formData = request.body;
				const rec = await database.collection(collection).insertOne(JSON.parse(formData.newData));
				return rec.insertedId;

		};
		result(request.params.name.toString())
			.then((result) => {
				response.send(result);
			})
			.catch((error) => {
				console.log(error);
				return error;
			});
	}
);

//▰▰▰▰▰▰▰▰▰

// delete a document in a collection
app.delete(
	'/api/delete/collection/:name/document/:id',
	multer().none(),
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection, /** @type {string} */ documentID) => {
			const formData = request.body;



				database
					.collection(collection)
					.remove({ $expr: { $eq: ['$_id', { $toObjectId: documentID }] } });

		};

		result(request.params.name.toString(), request.params.id.toString())
			.then((result) => response.send(result))
			.catch((/** @type {any} */ error) => {
				console.log(error);
				return error;
			});
	}
);

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

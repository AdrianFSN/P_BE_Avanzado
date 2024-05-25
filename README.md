# Nodepop
## practicaFund_Node_Mongo
The task requests to build an API to serve advertisements. This content would be used in applications aimed to sell/buy second hand items.

Our data base is set in Mongo DB and we are going to use Nodejs to build our asset:


Install dependencies.

```sh
npm install
```

And install nodemon under dev depencies:

```sh
npm i nodemon –save-dev
```

Set environment variables under package.json > scripts:

```js
 "scripts": {
    "start": "cross-env NODEPOP_ENV=production node ./bin/www",
    "dev": "cross-env NODEPOP_ENV=development DEBUG=nodepop:* nodemon ./bin/www"
  }
  ```
  Hence run app in dev mode (port 3000) by:

  ```sh
  npm run dev
  ```

  Install Mongoose to make Mongo schemas:

  ```sh
  npm install mongoose
  ```
Check dependencies for the rest of installs needed.

  ## API
  ## Initializing the Data Base
  The data base can be preloaded with 21 ads before starting to use it and test it.
  
  This list of ads is in a JSON file under the folder "data", with name "adsList.json". So it is easy to modify if needed.

Example:

  ```json

[
     {
        "name": "Samsung Galaxy F4",
        "sale": true,
        "price": 600,
        "picture": "mobile.jpg",
        "tag": [
            "mobile",
            "work"
        ]
    },
    {
        "name": "Motorola Moto G23",
        "sale": true,
        "price": 130,
        "picture": "mobile.jpg",
        "tag": [
            "mobile",
            "work"
        ]
    }
]

  ```
  
  This file is managed by init-db.js to reset/restart the Data Base. Please, follow the instructions below to start it:

  ### Initialize the Data Base:

  The file "init-db.js" deletes the ads already in the Data Base and loads the 21 ads available in "adsList.json".

**WARNING: the next command deletes the whole database!!!**

```sh
npm run init-db
```

Answer 'yes' if you are sure of what you are doing.

### API routes and queries (CRUD)

  The access to the API is protected with user/password authentication for POST, PUT and DELETE queries.

  #### CREATE method (authentication needed)
You can use Postman to test this method. It allows to insert a single ad to the Data Base.

POST /api/insert

Result after insertion:

```json
{
    "result": {
        "name": "Nikon 3100",
        "onSale": false,
        "price": 75,
        "picture": "/ddd.png",
        "tag": [
            "lifestyle"
        ],
        "_id": "65ddb5c0c405c54ba9c3e9fb",
        "__v": 0
    }
}
```

  #### READ methods: the Ads List:
Use this method to return the whole list of ads and filter it. You can use your browser to do so.

  GET /api/adsNodepop
  Returns the whole list of ads.

Example of result:

  ```json
{
"results": [
{
"_id": "65ddaa5ce0297868048c7797",
"name": "IPhone 13",
"sale": true,
"price": 600,
"picture": "/mobile.jpg",
"tag": [
"mobile",
"work"
],
"__v": 0
}
]
}
```

This query can be filtered by name, sale, price and tag. Build your routes like this to retrieve the results you need:

```
Filtering by name:
http://127.0.0.1:3000/api/adsNodepop?name=IPhone 13

Filtering by name (just write the initial character(s)):
http://127.0.0.1:3000/api/adsNodepop?name=i

Filtering by type of sale (true: sells and false: buys):
http://127.0.0.1:3000/api/adsNodepop?sale=true

http://127.0.0.1:3000/api/adsNodepop?sale=false

Filtering by price:
http://127.0.0.1:3000/api/adsNodepop?price=100

Filtering by tag:
http://127.0.0.1:3000/api/adsNodepop?tag=work
```
You can also sort your queries by the same criterias:

```
Ascending 
http://127.0.0.1:3000/api/adsNodepop?sort=price

Descending:
http://127.0.0.1:3000/api/adsNodepop?sort=-price
```
And combine filters:

```
Combo name and sort:
http://127.0.0.1:3000/api/adsNodepop?name=c&sort=-price
```

And then you can also filter by fields:

```
http://127.0.0.1:3000/api/adsNodepop?fields=name
```
##### Tags route
As requested, there is one READ method to access to the list of allowed tags in the Data Base.

It is controlled by the file availableTags.js.

You can call this method under the following route (returns a JSON):

GET /api/tags

Result:
```json
{
"results": {
"results": [
"lifestyle",
"mobile",
"motor",
"work"
]
}
}
```

#### UPDATE (authentication needed)
You can use this method to modify the values of an existing ad. You can test it in Postman if needed. Find first the ID of the ad you want to update (from /api/adsNodepop, for example), then execute this method.

PUT /api/update/<_id> (body)

Result:

Returns a JSON with the keys of the ad modified.
```json
{
    "result": {
        "_id": "65ddaa80e0297868048c7799",
        "name": "Samsung Galaxy Flip 4",
        "sale": true,
        "price": 500,
        "picture": "/ccc.png",
        "tag": [
            "mobile",
            "work"
        ],
        "__v": 0
    }
}
```



#### DELETE (authentication needed)
Find first the ID of the ad you want to delete (from /api/adsNodepop, for example). Then use this method to remove it from the data base. 

DELETE /api/delete/<_id> (body)

Result:
```json
Empty (check status 200 OK in Postman)

```

## Validations
There are validators added for main DB queries and for the schema of the model made for ads.

Queries based in lists, like "tags" or "fields" are based on the JSON documents under "data" folder (keysList.json and tagsList.json).

Example of validation for queries based on tags:

```js
query('tag').optional().custom(value => {
            const valueToLowerCase = value.toLowerCase();
            const jsonTagsList = fs.readFileSync('./data/tagsList.json', 'utf-8');
            const tagsList = JSON.parse(jsonTagsList);
            const availableTags = tagsList.results;

            if (availableTags.includes(valueToLowerCase))
                return true;
        }
        ...

```

## Views
There are two views ready to use. They are done by ejs templates.

### Index.ejs
This view is controlled by the file index.js. It shows the root page of the web, under the route http://127.0.0.1:3000/

Once you navigate to that URL, you can execute all the READ methods of the API explained above.

### Tags.ejs
This view is controlled by tags.js. It shows a list of available tags used in the Data Base. You can check it here: http://127.0.0.1:3000/tags

## Models and modules
### Adnodepop
The schema to create ads is under AdNodepop file in the folder models. It is also the key module to serve the main controllers to run queries for the API and for the frontend.

### RetrieveTags
A bit of context: as you can see, the controllers ads.js (for the API) and index.js (for the frontend) do the same: they show the main list of available ads. The first one sends a JSON view and the second one renders a HTML view.

In order to avoid this duplication, I started to build some classes in charge of receive the info sent by Adnodepop schema and serve it to the controllers. Then ads.js would "jsonize" it and index.js would render it.

### Now yes, RetrieveTags
To test the type of class explained above, I made the module RetrieveTags.js under models folder. Hence you can see that the controllers tags.js and availableTags.js just have to render or "jsonize" what they get from their instances of RetrieveTags.

### Next built
Trying to do a similar class to serve the ads list methods for ads.js and index.js is on works. There is a first version, which looks good, but I could not add the validations on time for the deadline of the practice.
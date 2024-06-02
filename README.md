# Nodepop

## P_BE_Avanzado

This task request to improve the API we built some months ago for Nodepop, a second hand store. The basics are the same, but some new features have been added and documented accordingly.

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

The data base can be preloaded with 12 ads before starting to use it and test it. And new to the first version, there is also a mock up with a list of 6 users to populate the data base's users.

Both lists are JSON file under the folder "data", with name "data.json". So it is easy to modify if needed.

Example:

```json
{
  "ads": [
    {
      "_id": "66599fff71cf00bbe5b5c54f",
      "name": "Fancy Cabrio Car",
      "sale": true,
      "price": 17800,
      "owner": "665762f03ebdac6771ecdd56",
      "tag": ["motor", "lifestyle"],
      "image": "image-1717149695054-cabrio_car.jpg",
      "__v": 0
    },
    {
      "_id": "6659a05871cf00bbe5b5c552",
      "name": "Old Typewriter",
      "sale": true,
      "price": 23,
      "owner": "665762f03ebdac6771ecdd56",
      "tag": ["work"],
      "image": "image-1717149784023-typewriter.jpg",
      "__v": 0
    }
  ],

  "users": [
    {
      "nickname": "TheBoss",
      "email": "admin@example.com",
      "password": "1234"
    },
    {
      "nickname": "Angela",
      "email": "user@example.com",
      "password": "1234"
    }
  ]
}
```

This file is managed by init-db.js to reset/restart the Data Base. Please, follow the instructions below to start it:

### Initialize the Data Base:

The file "init-db.js" deletes the ads and users already in the Data Base and loads the 12 ads and 6 users available in "data.json".

**The owner of each ad is assigned randomly from the users available in the Data Base**

**WARNING: the next command deletes the whole database!!!**

```sh
npm run init-db
```

Answer 'yes' if you are sure of what you are doing.

### API routes and queries (CRUD)

#### JWT Authentication (NEW!)

Most of the features available when using the API routes are protected by Json Web Token to sign your authentication.

You will need to create and set your personal JWT_SECRET variable in a .env file:

```js
JWT_SECRET=YOUR PASSWORD HERE
```

Please, use a development tool for testing APIs like Postman to test the following methods.

#### Login method (NEW!)

POST /api/authenticate

Get the email and password of one of the mocked up users in data.json and get your token.

##### JWT session token

After login, you get a token that currently expires after 2 hours. You can modify this deadline in the file "LoginController.js", under the folder "controllers", changing this part:

```js
const tokenJWT = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: "2h",
});
```

Then you can send it in your requests using JWT Bearer format in "headers" and "query":

```
Headers:
Authorization: Bearer <your token>
```

```
Query Params:
jwt: <your token>
```

#### CREATE method (JWT protected)

This method allows to insert a single ad to the Data Base.

POST /api/insert

Result after insertion:

```json
{
  "result": {
    "name": "plane",
    "sale": false,
    "price": 175,
    "owner": "665b4bd7fd70b726f460e699",
    "tag": ["motor", "lifestyle", "work"],
    "_id": "665c3ca2305a7d4f5797a566",
    "image": "image-1717320866754-plane.jpg",
    "__v": 0
  }
}
```

**What's new for this feature?**

- Ads have now an owner, the one who created the ad.
- This method requests now to upload an image file for each article.
- This method sends a request for a queued task to a microservice.
- Mentioned task creates a thumbnail of the image (see below for more info).

#### READ methods: the Ads List (JWT protected):

Use this method to return the whole list of ads and filter it. You can use your browser to do so.

```
GET /api/adsNodepop OR /api/adsNodepop?jwt=<your token>
Returns the whole list of ads.
```

Example of result:

```json
{
  "results": [
    {
      "_id": "66599fff71cf00bbe5b5c54f",
      "name": "Fancy Cabrio Car",
      "sale": true,
      "price": 17800,
      "owner": "665c3cf0ead2e3202ec3b816",
      "image": "image-1717149695054-cabrio_car.jpg",
      "tag": ["motor", "lifestyle"],
      "__v": 0
    }
  ]
}
```

This query can be filtered by name, sale, price and tag. Build your routes like this to retrieve the results you need:

Filtering by name:

```
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?name=Fancy&Cabrio&Car

Or jwt in query params:
 http://localhost:3000/api/adsNodepop/?name=fancy&Cabrio&Car&jwt=<your token here>
```

Filtering by name (just write the initial character(s)):

```
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?name=f

Or use the jwt=<your token> format

http://localhost:3000/api/adsNodepop?name=f&jwt=<your token here>
```

Filtering by type of sale (true: sells and false: buys):

```
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?sale=true

http://localhost:3000/api/adsNodepop?sale=false

Or use the jwt=<your token> format
```

Filtering by price:

```
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?price=100

Or use the jwt=<your token> format
```

Filtering by tag:

```
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?tag=work

Or use the jwt=<your token> format
```

You can also sort your queries by the same criterias:

```
JWT Bearer in headers:
Ascending
http://localhost:3000/api/adsNodepop?sort=price

Descending:
http://localhost:3000/api/adsNodepop?sort=-price

Or use the jwt=<your token here> format
```

And combine filters:

```
Combo name and sort:
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?name=c&sort=-price

Or use the jwt=<your token here> format
```

And then you can also filter by fields:

```
JWT Bearer in headers:
http://localhost:3000/api/adsNodepop?fields=name

Or use the jwt=<your token here> format
```

#### Users route (JWT protected)

GET /api/users

Let's say you are a customer support agent of Nodepop store. You can check the mock up of the users list in DB. Passwords are encrypted.

Example of result:

```json
{
  "results": [
    {
      "_id": "665b4bd7fd70b726f460e699",
      "nickname": "TheBoss",
      "email": "admin@example.com",
      "password": "$2b$10$l0qKZkUblsMKTtR.Kjzq5.3e0i/MjrazPfBZ8/lzKLCvoMaQq9hhu",
      "__v": 0
    },
    {
      "_id": "665b4bd7fd70b726f460e69a",
      "nickname": "Angela",
      "email": "user@example.com",
      "password": "$2b$10$QLYY2Ux1mBXnP9YkKUNJyOIEH4FmPH98qKAQxQBVDia1nDnRBrhkW",
      "__v": 0
    }
  ]
}
```

##### Tags route (not protected)

There is one READ method to access to the list of allowed tags in the Data Base.

It is controlled by the file availableTags.js.

You can call this method under the following route (returns a JSON):

GET /api/tags

Result:

```json
{
  "results": {
    "results": ["lifestyle", "mobile", "motor", "work"]
  }
}
```

#### UPDATE (JWT protected)

You can use this method to modify the values of an existing ad. You can test it in Postman if needed. Find first the ID of the ad you want to update (from /api/adsNodepop, for example), then execute this method.

PUT /api/update/<\_id> (body)

Result:

Returns a JSON with the keys of the ad modified.

```json
{
  "result": {
    "_id": "665b2c114bdb21dceb7c404c",
    "name": "Bicycle",
    "sale": false,
    "price": 7,
    "owner": "665b2d29eff350d70b8834a7",
    "image": "image-1717259125490-NoImageAvailable.jpg",
    "tag": ["lifestyle"],
    "__v": 0
  }
}
```

This method sends a request for a queued task to a microservice.

Mentioned task creates a thumbnail of the image (see below for more info).

#### DELETE (JWT protected)

Find first the ID of the ad you want to delete (from /api/adsNodepop, for example). Then use this method to remove it from the data base.

DELETE /api/delete/<\_id> (body)

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

This view is controlled by the file index.js. It shows the root page of the web, under the route http://localhost:3000/

Once you navigate to that URL, you can execute all the READ methods of the API explained above, WITH NO NEED TO AUTHENTICATE.

<img src="RM-image-1.png" alt="Example Image" width="400">

### Tags.ejs

This view is controlled by tags.js. It shows a list of available tags used in the Data Base. You can check it here: http://localhost:3000/tags

## Uploading images / Micro-services (NEW!)

Advertisements in our Nodepop store requires to attach an image to our articles. These images have to be .jpg, .jpeg or .png.

Those will be saved under the folder "uploads/adImages". Then they are shown in the advertisements panel in http://localhost:3000, resized to 250px x 250px by CSS.

However, a new thumbnail version of each image will be made in the background, using a micro-service.

### Thumbnail creator (micro-service)

There is a new feature to run tasks in the background using [cote](https://github.com/dashersw/cote) library.

When uploading an image attached to an advertisement, an event will be emmited, with the result of a thumbnailed 100px x 100px version of the pic.

You can navigate to the requester and responder under the folder "services". They are separated under "requesters" and "responders" sub-folders.

The requester will go live with the app, after running:

```sh
npm run dev
```

However, you will need to execute the responder after navigating to its container folder. For example, running:

```sh
npx nodemon thumbnailResizerResponder.js
```

#### Using jimp to resize images

The thumbnail image is obtained using [jimp](https://github.com/jimp-dev/jimp) library.

I choosed the method "cover", to avoid distorting the pictures in case they are not squared.

#### Routes to images and thumbnails

Both versions of images are stored under "uploads/adImages". If you want to navigate to the path of an specific picture using your browser, try this:

```
http:localhost:3000/uploads/adImages/<image filename>
```

Please note that thumbnails have the same filename than its own bigger version, but adding "thumbnail\_" as a prefix.

Examples:

Full size image:
http://localhost:3000/uploads/adImages/image-1717149695054-cabrio_car.jpg

Thumbnail:
http://localhost:3000/uploads/adImages/thumbnail_image-1717149695054-cabrio_car.jpg

## Localization

Nodepop store is now published in 2 languages: English and Spanish.

You can use the language selector on the top right corner of your screen to switch from one to another:

<img src="RM-image.png" alt="alt text" width="200">

Localization feature is driven by [i18next](https://github.com/i18next/i18next) library. You can find the translation files under the folder "locales".

Example in English:
<img src="RM-image-3.png" alt="alt text" width="300">

Example in Spanish:
<img src="RM-image-4.png" alt="alt text" width="300">

const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const fs = require('fs');
const { parse } = require('csv-parse');
const bcrypt = require('bcrypt');

(async () => {
  await client.connect();
  const db = client.db('cse316');
  if ((await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name).includes('users')) {
    const dropResult = await db.collection('users').drop();
  }
  const users = [];
  await fs.createReadStream('data.csv')
  .pipe(parse({ delimiter: ',' }))
  .on('data', (csvrow) => {
    const password = '123';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    users.push({
      "username": csvrow[0],
      "firstName": csvrow[1],
      "lastName": csvrow[2],
      "email": csvrow[4],
      "lists": {
        "Animals to Eat": {list: csvrow[5].split(',').map(x => x.trim()), published: true, likes: 0, dislikes: 0, views: 0, publishedDate: new Date(2021, 0, 3), lastUpdated: new Date(2021, 1, 4), comments: []},
        "Books": {list: csvrow[6].split(',').map(x => x.trim()), published: true, likes: 0, dislikes: 0, views: 0, publishedDate: new Date(2021, 1, 5), lastUpdated: new Date(2021, 1, 9), comments: []},
        "Countries you'd like to Visit": {list: csvrow[7].split(',').map(x => x.trim()), published: true, likes: 0, dislikes: 0, views: 0, publishedDate: new Date(2021, 2, 5), lastUpdated: new Date(2021, 2, 5), comments: []},
        "Foods": {list: csvrow[8].split(',').map(x => x.trim()), published: true, likes: 0, dislikes: 0, views: 0, publishedDate: new Date(2021, 1, 7), lastUpdated: new Date(2021, 1, 7), comments: []},
        "Games": {list: csvrow[9].split(',').map(x => x.trim()), published: true, likes: 0, dislikes: 0, views: 0, publishedDate: new Date(2021, 8, 23), lastUpdated: new Date(2021, 8, 25), comments: []},
        "Movies": {list: csvrow[10].split(',').map(x => x.trim()), published: false, likes: 0, dislikes: 0, views: 0, publishedDate: null, lastUpdated: new Date(), comments: []},
        "Pink Floyd Songs": {list: csvrow[11].split(',').map(x => x.trim()), published: false, likes: 0, dislikes: 0, views: 0, publishedDate: null, lastUpdated: new Date(), comments: []},
        "Programming Languages": {list: csvrow[12].split(',').map(x => x.trim()), published: false, likes: 0, dislikes: 0, views: 0, publishedDate: null, lastUpdated: new Date(), comments: []},
        "Professional Sports Teams": {list: csvrow[13].split(',').map(x => x.trim()), published: false, likes: 0, dislikes: 0, views: 0, publishedDate: null, lastUpdated: new Date(), comments: []},
        "TV Shows": {list: csvrow[14].split(',').map(x => x.trim()), published: false, likes: 0, dislikes: 0, views: 0, publishedDate: null, lastUpdated: new Date(), comments: []},
      },
      "password": hash,
      "liked": [],
      "disliked": [],
    });
  }).on('end', async () => {
    await db.collection('users').insertMany(users);
    console.log('done');
  })

  const express = require('express');
  const cookieParser = require('cookie-parser');
  const jwt = require('jsonwebtoken');
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Create Account with unique User Name and unique Email
  app.post('/createAccount', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;
    const users = db.collection('users');
    const userExists = await users.findOne({ username });
    const emailExists = await users.findOne({ email });
    if (userExists || emailExists) {
      res.status(400).send({ error: 'Username or Email already exists' });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = {
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": hash,
        "lists": {}
      };
      users.insertOne(newUser).then(result => {
        res.status(200).send(result);
      }).catch(err => {
        res.status(400).send({ error: err });
      });
    }
  });

  // Login Account using User Name
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send({ error: 'Missing username or password' });
    }
    const users = db.collection('users');
    const user = await users.findOne({ username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      const result = bcrypt.compareSync(password, user.password);
      if (result) {
        const token = jwt.sign({ username: user.username }, 'secret');
        res.cookie('token', token);
        res.status(200).send({ token });
      } else {
        res.status(400).send({ error: 'Incorrect password' });
      }
    }
  });
  const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          res.status(401).send({ error: 'Unauthorized' });
        } else {
          req.username = decoded.username;
          next();
        }
      });
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  };

  // Multiple Accounts Creation and LIst ownership
  // Create and Save Top 5 List
  app.post('/createList', isLoggedIn, async (req, res) => {
    let { listName, list } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listExists = user.lists[listName];
      if (!listExists) {
        users.updateOne({ username: req.username }, { $set: { [`lists.${listName}`]: {list: list, published: false, likes: 0, dislikes: 0, views: 0, publishedDate: null, lastUpdated: new Date(), comments: []} } }).then(result => {
          res.status(200).send(result);
        }).catch(err => {
          res.status(400).send({ error: err });
        });
      } else {
        res.status(400).send({ error: 'List already exists' });
      }
    }
  });

  // Edit Previously Saved Top 5 List
  app.put('/renameList', isLoggedIn, async (req, res) => {
    let { listName, newListName } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listExists = user.lists[listName];
      if (listExists) {
        users.updateOne({ username: req.username }, { $rename: { [`lists.${listName}`]: `lists.${newListName}` } }).then(result => {
          users.updateOne({ username: req.username }, { $set: { [`lists.${newListName}.lastUpdated`]: new Date() } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          })
        }).catch(err => {
          res.status(400).send({ error: err });
        });
      } else {
        res.status(400).send({ error: 'List does not exist' });
      }
    }
  });
  app.put('/editList', isLoggedIn, async (req, res) => {
    let { listName, list } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listExists = user.lists[listName];
      if (listExists) {
        users.updateOne({ username: req.username }, { $set: { [`lists.${listName}.list`]: list, [`lists.${listName}.lastUpdated`]: new Date() } }).then(result => {
          res.status(200).send(result);
        }).catch(err => {
          res.status(400).send({ error: err });
        });
      } else {
        res.status(400).send({ error: 'List does not exist' });
      }
    }
  });

  // Publish Top 5 List
  app.put('/setListPublished', isLoggedIn, async (req, res) => {
    let { listName, listPublished } = req.body;
    if (!listName || !listPublished) {
      res.status(400).send({ error: 'Missing listName or listPublished' });
    }
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listExists = user.lists[listName];
      if (listExists) {
        users.updateOne({ username: req.username }, { $set: { [`lists.${listName}.published`]: listPublished, [`lists.${listName}.publishedDate`]: new Date() } }).then(result => {
          res.status(200).send(result);
        }).catch(err => {
          res.status(400).send({ error: err });
        });
      } else {
        res.status(400).send({ error: 'List does not exist' });
      }
    }
  });

  // Delete Top 5 List with Modal verification
  app.delete('/deleteList', isLoggedIn, async (req, res) => {
    let { listName } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listExists = user.lists[listName];
      if (listExists) {
        users.updateOne({ username: req.username }, { $unset: { [`lists.${listName}`]: "" } }).then(result => {
          res.status(200).send(result);
        }).catch(err => {
          res.status(400).send({ error: err });
        });
      } else {
        res.status(400).send({ error: 'List does not exist' });
      }
    }
  });

  // View and Search Your Lists (case insensitive starts with)
  app.get('/viewPersonalListsByName', isLoggedIn, async (req, res) => {
    const listNameStartsWith = req.query.listNameStartsWith;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listNames = Object.keys(user.lists);
      if (listNameStartsWith) {
        listNames = listNames.filter(listName => listName.toLowerCase().startsWith(listNameStartsWith.toLowerCase()));
      }
      let filteredLists = {};
      listNames.forEach(listName => {
        filteredLists[listName] = user.lists[listName];
      });
      res.status(200).send(filteredLists);
    }
  });

  app.get('/viewPublishedListsByName', isLoggedIn, async (req, res) => {
    // case insensitive contains
    const listNameContains = req.query.listNameContains;
    const users = await db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      // unauthorized
      res.status(400).send({ error: 'Unathorized' });
    } else {
      let allUsers = await users.find({}).toArray();
      let lists = {};
      allUsers.forEach(user => {
        let userLists = Object.keys(user.lists);
        userLists.forEach(listName => {
          if (user.lists[listName].published) {
            if (!listNameContains || listName.toLowerCase().includes(listNameContains.toLowerCase())) {
              if (!lists[user.username]) {
                lists[user.username] = {};
              }
              lists[user.username][listName] = user.lists[listName];
            }
          }
        });
      });
      res.status(200).send(lists);
    }
  });
  
  app.get('/viewPublishedListsByUsername', isLoggedIn, async (req, res) => {
    // case insensitive contains
    const usernameContains = req.query.usernameContains;
    const users = await db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      // unauthorized
      res.status(400).send({ error: 'Unathorized' });
    } else {
      let allUsers = await users.find({}).toArray();
      let lists = {};
      allUsers.forEach(user => {
        if (user.username.toLowerCase().includes(usernameContains.toLowerCase())) {
          let userLists = Object.keys(user.lists);
          userLists.forEach(listName => {
            if (user.lists[listName].published) {
              if (!lists[user.username]) {
                lists[user.username] = {};
              }
              lists[user.username][listName] = user.lists[listName];
            }
          });
        }
      });
      res.status(200).send(lists);
    }
  });
  
  app.post('/addComment', isLoggedIn, async (req, res) => {
    let { listUsername, listName, comment } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listUser = await users.findOne({ username: listUsername });
      if (!listUser) {
        res.status(400).send({ error: 'List user does not exist' });
      } else {
        let listExists = listUser.lists[listName];
        if (listExists) {
          users.updateOne({ username: listUsername }, { $push: { [`lists.${listName}.comments`]: { comment: comment, username: req.username, date: new Date() } } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          });
        } else {
          res.status(400).send({ error: 'List does not exist' });
        }
      }
    }
  });

  // Expand a Named List (shows items and comments, increments views)
  app.get('/incrementViews', isLoggedIn, async (req, res) => {
    let { listUsername, listName } = req.query;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listUser = await users.findOne({ username: listUsername });
      if (!listUser) {
        res.status(400).send({ error: 'List user does not exist' });
      } else {
        let listExists = listUser.lists[listName];
        if (listExists) {
          users.updateOne({ username: listUsername }, { $inc: { [`lists.${listName}.views`]: 1 } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          });
        } else {
          res.status(400).send({ error: 'List does not exist' });
        }
      }
    }
  });

  // Like/Dislike Named Lists with Proper Toggling
  app.post('/likeList', isLoggedIn, async (req, res) => {
    let { listUsername, listName } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listUser = await users.findOne({ username: listUsername });
      if (!listUser) {
        res.status(400).send({ error: 'List user does not exist' });
      } else {
        let listExists = listUser.lists[listName];
        let joinedName = `${listUsername}_${listName}`;
        if (listExists && !user.liked.includes(joinedName) && !user.disliked.includes(joinedName)) {
          users.updateOne({ username: user.username }, { $push: { liked: joinedName } }).catch(err => {
            res.status(400).send({ error: err });
          });
          users.updateOne({ username: listUsername }, { $inc: { [`lists.${listName}.likes`]: 1 } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          });
        } else if (listExists && user.liked.includes(joinedName)) {
          users.updateOne({ username: user.username }, { $pull: { liked: joinedName } }).catch(err => {
            res.status(400).send({ error: err });
          });
          users.updateOne({ username: listUsername }, { $inc: { [`lists.${listName}.likes`]: -1 } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          });
        } else {
          res.status(400).send({ error: 'Error' });
        }
      }
    }
  });

  app.post('/dislikeList', isLoggedIn, async (req, res) => {
    let { listUsername, listName } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username: req.username });
    if (!user) {
      res.status(400).send({ error: 'User does not exist' });
    } else {
      let listUser = await users.findOne({ username: listUsername });
      if (!listUser) {
        res.status(400).send({ error: 'List user does not exist' });
      } else {
        let listExists = listUser.lists[listName];
        let joinedName = `${listUsername}_${listName}`;
        if (listExists && !user.disliked.includes(joinedName && !user.liked.includes(joinedName))) {
          users.updateOne({ username: user.username }, { $push: { disliked: joinedName } }).catch(err => {
            res.status(400).send({ error: err });
          });
          users.updateOne({ username: listUsername }, { $inc: { [`lists.${listName}.likes`]: -1 } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          });
        } else if (listExists && user.disliked.includes(joinedName)) {
          users.updateOne({ username: user.username }, { $pull: { disliked: joinedName } }).catch(err => {
            res.status(400).send({ error: err });
          });
          users.updateOne({ username: listUsername }, { $inc: { [`lists.${listName}.likes`]: 1 } }).then(result => {
            res.status(200).send(result);
          }).catch(err => {
            res.status(400).send({ error: err });
          });
        } else {
          res.status(400).send({ error: 'Error' });
        }
      }
    }
  });

  // View and Search All User Lists (case-insensitive user name match)
  // User lists display all dynamic details
  // Expand a User List (shows items and comments, increments views)
  // View Comments with User and Add Comment to User List
  // Sort User Lists by all 5 criteria
  // Like/Dislike User Lists with Proper Toggling
  // View and Search Community Lists (case-insensitive list name match)
  // Community lists display all dynamic details
  // Expand a Community List (shows items and comments, increments views)
  // View Comments with User and Add Comment to Community List
  // Sort Community Lists by all 5 criteria
  // Like/Dislike Community Lists with Proper Toggling
  // Community List Scoring is Correct
  // Foolproof Design for Save and Publish buttons in List Editing
  // Foolproof Design for User Tab (only for logged in user)
  // User Interface Screens Design

  app.listen(3001, () => console.log('Server running on port 3001'));
})()
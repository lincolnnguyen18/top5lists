import { MongoClient } from 'mongodb';
import util from 'util';
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('cse316');
import fetch from 'node-fetch';

(async () => {
  await client.connect();

  // await fetch('http://localhost:3001/createAccount', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     username: 'lincnguyen',
  //     firstName: 'Lincoln',
  //     lastName: 'Nguyen',
  //     email: 'lincoln@email.com',
  //     password: 'Ln2121809',
  //   })
  // }).then(res => res.json()).then(res => console.log(res));

  let token = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'lincnguyen',
      password: '123',
    })
  }).then(res => res.json()).then(res => {
    return res.token;
  });
  console.log(token);

  // await fetch('http://localhost:3001/createList', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  //   body: JSON.stringify({
  //     listName: 'name1',
  //     list: [ 'test1', 'test2', 'test3', 'test4', 'test5' ]
  //   })
  // }).then(res => res.json()).then(res => console.log(res))

  // let users = await db.collection('users').find({}).toArray();
  // let raw = util.inspect(users, { depth: null });
  // console.log(raw);

  // await fetch('http://localhost:3001/renameList', {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  //   body: JSON.stringify({
  //     listName: 'name2',
  //     newListName: 'newName2',
  //   })
  // }).then(res => res.json()).then(res => console.log(res))

  // await fetch('http://localhost:3001/setListPublished', {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  //   body: JSON.stringify({
  //     listName: 'name1',
  //     listPublished: false,
  //   })
  // }).then(res => res.json()).then(res => console.log(res))

  // await fetch('http://localhost:3001/deleteList', {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  //   body: JSON.stringify({
  //     listName: 'name1',
  //   })
  // }).then(res => res.json()).then(res => console.log(res))

  // await fetch('http://localhost:3001/viewPersonalListsByName?listNameStartsWith=name', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  // }).then(res => res.json()).then(res => console.log(res))

  // await fetch('http://localhost:3001/addComment', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  //   body: JSON.stringify({
  //     listUsername: 'lincnguyen',
  //     listName: 'name1',
  //     comment: 'comment1',
  //   })
  // }).then(res => res.json()).then(res => console.log(res))

  // await fetch('http://localhost:3001/viewPublishedListsByName?listNameContains=A', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cookie': 'token=' + token,
  //   },
  // }).then(res => res.json()).then(res => console.log(res))

  await fetch('http://localhost:3001/viewPublishedListsByUsername?usernameContains=nguyen', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'token=' + token,
    },
  }).then(res => res.json()).then(res => console.log(util.inspect(res, { depth: null })))

  await fetch('http://localhost:3001/likeList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'token=' + token,
    },
    body: JSON.stringify({
      listUsername: 'lincnguyen',
      listName: 'Books',
    })
  }).then(res => res.json()).then(res => console.log(res))

  await fetch('http://localhost:3001/viewPublishedListsByUsername?usernameContains=nguyen', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'token=' + token,
    },
  }).then(res => res.json()).then(res => console.log(util.inspect(res, { depth: null })))

  // users = await db.collection('users').find({}).toArray();
  // raw = util.inspect(users, { depth: null });
  // console.log(raw);
  await client.close();
})();
import { MongoClient } from 'mongodb';
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

  let token = await fetch('http://localhost:3001/api/login', {
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

  // const users = db.collection('users').find({});
  // console.log(await users.toArray());
  await client.close();
})();
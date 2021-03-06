'use strict';
const server = require('../api-server/server');
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../api-server/src/middleware/bearer');
const permission = require('../api-server/src/middleware/acl');
const request = supergoose(server.server);
process.env.SECRET = 'toes';

//post patch put get delete
//get users
let users = [
  { username: 'admin', password: 'password', role: 'admin' },
  { username: 'writer', password: 'password', role: 'writer' },
  { username: 'editor', password: 'password', role: 'editor' },
  { username: 'user', password: 'password', role: 'user' },
];

describe('when the user role is admin', () => {
  let token;
  let id;
  it('should has access to post api/v2/food', async () => {
    const response = await request.post('/signup').send(users[0]);
    token = response.body.token;
    await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'pizza', calories: 100 });
    await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'burger', calories: 150 });
    await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'tomato', calories: 30 });
    const response2 = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'fish', calories: 50 });
    id = response2.body._id;
    expect(response2.status).toEqual(201);
    expect(response2.body.name).toEqual('fish');
  });
  it('should has access to get api/v2/food', async () => {
    const response2 = await request
      .get('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'chicken', calories: 100 });
    expect(response2.status).toEqual(200);
  });

  it('should has access to put api/v2/food', async () => {
    const response2 = await request
      .put(`/api/v2/food/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'beard', calories: 100 });
    expect(response2.status).toEqual(200);
    expect(response2.body.name).toEqual('beard');
    expect(response2.body.calories).toEqual(100);
  });
  it('should has access to get one item api/v2/food/id', async () => {
    const response2 = await request
      .get(`/api/v2/food/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response2.status).toEqual(200);
    expect(response2.body.name).toEqual('beard');
    expect(response2.body.calories).toEqual(100);
  });
  it('should has access to delete an item api/v2/food/id', async () => {
    const response2 = await request
      .delete(`/api/v2/food/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response2.status).toEqual(200);
    expect(response2.body.name).toEqual('beard');
    expect(response2.body.calories).toEqual(100);
  });
  it('should has access to get all users api/v2/users', async () => {
    const response2 = await request
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`);
    expect(response2.status).toEqual(200);
  });
});

// describe('when the user role is writer', () => {
//   let token;
//   let id;
//   it('should has access to post api/v2/food', async () => {
//     const response = await request.post('/signup').send(users[1]);
//     token = response.body.token;
//     await request
//       .post('/api/v2/food')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'pizza', calories: 100 });
//     await request
//       .post('/api/v2/food')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'burger', calories: 150 });
//     await request
//       .post('/api/v2/food')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'tomato', calories: 30 });
//     const response2 = await request
//       .post('/api/v2/food')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'fish', calories: 50 });
//     id = response2.body._id;
//     // expect(response2.status).toEqual(201);
//     expect(response2.body.name).toEqual('fish');
//   });
//   it('should has access to get api/v2/food', async () => {
//     const response2 = await request
//       .get('/api/v2/food')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'chicken', calories: 100 });
//     expect(response2.status).toEqual(200);
//   });

//   it('should has access to get one item api/v2/food/id', async () => {
//     const response2 = await request
//       .get(`/api/v2/food/${id}`)
//       .set('Authorization', `Bearer ${token}`);
//     expect(response2.status).toEqual(200);
//     expect(response2.body.name).toEqual('fish');
//     expect(response2.body.calories).toEqual(50);
//   });


let id;
describe('when the user role is editor', () => {
  let token;
  it('should has access to post api/v2/food', async () => {
    const response = await request.post('/signup').send(users[2]);
    token = response.body.token;
    await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'pizza', calories: 100 });
    await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'burger', calories: 150 });
    await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'tomato', calories: 30 });
    const response2 = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'fish', calories: 50 });
    id = response2.body._id;
    expect(response2.status).toEqual(201);
    expect(response2.body.name).toEqual('fish');
  });
  it('should has access to get api/v2/food', async () => {
    const response2 = await request
      .get('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'chicken', calories: 100 });
    expect(response2.status).toEqual(200);
  });

  it('should has  access to put api/v2/food', async () => {
    const response2 = await request
      .put(`/api/v2/food/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'beard', calories: 100 });
    expect(response2.status).toEqual(200);
    expect(response2.body.name).toEqual('beard');
    expect(response2.body.calories).toEqual(100);
  });
  it('should has access to get one item api/v2/food/id', async () => {
    const response2 = await request
      .get(`/api/v2/food/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response2.status).toEqual(200);
    expect(response2.body.name).toEqual('beard');
    expect(response2.body.calories).toEqual(100);
  });
});

describe('404 Not found response at bad rout or bad method', () => {
  it('at bad rout', async () => {
    const response = await request.get('/badRout');

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual(
      'Sorry, we could not find what you were looking for'
    );
  });
  it('at method', async () => {
    const response = await request.post('/users');

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual(
      'Sorry, we could not find what you were looking for'
    );
  });
});


describe('unauthenticated routes', () => {
    let id;
        test('post method', async () => {
            const response = await request.post('/api/v1/food').send({
                name:"tomato",
                calories:1500,
                type:"fruit"
            });
            id = response.body._id;
            expect(response.status).toBe(201);
            expect(response.body.name).toBeDefined();
            expect(response.body.name).toBe("tomato");
            expect(response.body.type).toEqual("FRUIT");
               
        })
        test('get no id method', async () => {
            const response = await request.get('/api/v1/food');
            expect(response.status).toBe(200);
            expect(response.body[0].name).toBeDefined();
            expect(response.body[0].name).toBe("pizza");
               
        })
        test('get with id method', async () => {
            const response = await request.get(`/api/v1/food/${id}`)
            expect(response.status).toBe(200);
            expect(response.body._id).toBe(id);
            expect(response.body.name).toBe("tomato");
            expect(response.body.type).toEqual("FRUIT");
               
        })
        test('put method', async () => {
            const response = await request.put(`/api/v1/food/${id}`).send({
                name:"updated",
                calories:2000,
                type:"vegetable"
            })
            expect(response.status).toBe(200);
            expect(response.body._id).toBe(id);
            expect(response.body.name).toBe("updated");
            expect(response.body.type).toEqual("VEGETABLE");
               
        })
        // test('delete method', async () => {
        //     const response = await request.delete(`/api/v1/food/${id}`);
        //     expect(response.status).toBe(200);
        //     expect(response.body).toBe(response);
        //     const response1 = await request.get(`/api/v1/food/${id}`);
        //     expect(response1.status).toBe(200);
        //     expect(response1.body).toBe(null);
     
               
        // })
  

})
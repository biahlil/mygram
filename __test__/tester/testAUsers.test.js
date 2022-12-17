const request = require('supertest');
const app = require('../../server');
// const session = require('supertest-session');
// var testSession = null;
let token;

describe('Test POST /users/register', () => {
  it('Created (Succes)', async ()  => { 
    const res = await request(app)
    .post('/users/register')
    .send({
      email: "nani.dion@gmail.com",
      full_name: "Nani Dion",
      username: "nani",
      password: "nani123",
      profile_image_url: 'http://image.com/nanidion.jpg',
      age: 12,
      phone_number: 2021
    })
    
  expect(res.statusCode).toEqual(201);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("User");
  expect(res.body.User).toHaveProperty("email");
  expect(res.body.User.username).toEqual("nani");
  
  });

  it('Tidak ada email (Failed)', async ()  => { 
    const res = await request(app)
    .post('/users/register')
    .send({
      full_name: "Nani Dion",
      username: "nani",
      password: "nani123",
      profile_image_url: 'http://image.com/nanidion.jpg',
      age: 12,
      phone_number: 2021
    })
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("path");
  expect(res.body.type).toEqual("notNull Violation");
  expect(res.body.message).toEqual("notNull Violation: User.email cannot be null");
  });

  it('Email Invalid (Faliled)', async ()  => { 
    const res = await request(app)
    .post('/users/register')
    .send({
      email: "nani.diongmail.com",
      full_name: "Nani Dion",
      username: "nani",
      password: "nani123",
      profile_image_url: 'http://image.com/nanidion.jpg',
      age: 12,
      phone_number: 2021
    })

    // .expect((res) => {
    //   console.log(res.body);
    //  })

  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("path");
  expect(res.body.type).toEqual("Validation error");
  expect(res.body.message).toEqual("Validation error: Validation isEmail on email failed");
  });

});

describe('Test POST /users/login', () => {

  it('Login (Succes)', async ()  => { 
    const res = await request(app)
    .post('/users/login')
    .send({
      email: "nani.dion@gmail.com",
      password: "nani123"
    })
  expect(res.statusCode).toEqual(200);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body).toHaveProperty("token");
  });

  it('Salah Password (Failed)', async ()  => { 
    const res = await request(app)
    .post('/users/login')
    .send({
      email: "nani.dion@gmail.com",
      password: "nani122"
    })
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers).toHaveProperty("date");
  expect(res.body).toHaveProperty("devMessage");
  expect(res.body.name).toEqual("User Login Failed");
  });

});



describe('Test PUT /users/:userId', () => {
  
  beforeEach(function (done) {
    const tokenize = request(app)
    .post('/users/login')
    .send({
      email: "nani.dion@gmail.com",
      password: "nani123"
    })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        token = tokenize.response.body.token;
        return done();
      });
  });

  it('Edited (Succes)', async ()  => { 
    const res = await request(app)
    .put('/users/1 ')
    .set('token', token)
    .send({
      email: "nani.dion@gmail.com",
      full_name: "Noni Dion",
      username: "noni",
      profile_image_url: 'http://image.com/nonidion.jpg',
      age: 19,
      phone_number: 20299
    })
    
  expect(res.statusCode).toEqual(200);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("User");
  expect(res.body.User).toHaveProperty("email");
  expect(res.body.User.username).toEqual("noni");
  });

  it('Id Invalid (Failed)', async ()  => { 
    const res = await request(app)
    .put('/users/10 ')
    .set('token', token)
    .send({
      email: "nani.dion@gmail.com",
      full_name: "Noni Dion",
      username: "noni",
      profile_image_url: 'http://image.com/nonidion.jpg',
      age: 19,
      phone_number: 20299
    })
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("You cannot edit other people's accounts");
  });

  it('Validasi Email (Failed)', async ()  => { 
    const res = await request(app)
    .put('/users/1 ')
    .set('token', token)
    .send({
      email: "nani.diongmail.com",
      full_name: "Noni Dion",
      username: "noni",
      profile_image_url: 'http://image.com/nonidion.jpg',
      age: 19,
      phone_number: 20299
    })
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("Validation error: Validation isEmail on email failed");
  });


});

describe('Test delete /users/:userId', () => {
  
  beforeEach(function (done) {
    const tokenize = request(app)
    .post('/users/login')
    .send({
      email: "nani.dion@gmail.com",
      password: "nani123"
    })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        token = tokenize.response.body.token;
        return done();
      });
  });
  
  it('Id Invalid (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/users/2 ')
    .set('token', token)
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("You cannot delete other people's accounts");
  });

  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/users/1 ')
        
  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt must be provided");
});
  
it('Invalid Token (Failed)', async ()  => { 
  const res = await request(app)
  .delete('/users/1 ')
  .set('token', "broken")

expect(res.statusCode).toEqual(401);
expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
expect(res.body).toHaveProperty("message");
expect(res.body.name).toEqual("JsonWebTokenError");
expect(res.body.message).toEqual("jwt malformed");
});


  it('deleted (Succes)', async ()  => { 
    const res = await request(app)
    .delete('/users/1 ')
    .set('token', token)

    expect(res.statusCode).toEqual(200);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual("Your account has been successfully deleted");
  });
  
});

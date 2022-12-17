const request = require('supertest');
const app = require('../../server');
const { getPayloadId} = require('../../helpers/jwt');

// const session = require('supertest-session');
// var testSession = null;
let token;
let tokenId;

beforeAll(function (done) {
    const res = request(app)
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
    .expect(201)
    .end(function (err) {
      if (err) return done(err);
      return done();
    });
});  

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
            tokenId = getPayloadId(token);
            return done();
          });
      });

describe('Test POST /comments', () => {
  
  beforeEach( async () => {
  const res = await request(app)
  .post('/photos')
  .set('token', token)
  .send({
      title: "Foto Jadul", 
      caption: "Foto ini udah jadul12", 
      poster_image_url: "https://fotokemenangan.com",
      UserId: tokenId
  })
  expect(res.statusCode).toEqual(201);
  });

    it('Created (Succes)', async ()  => { 
    const res = await request(app)
    .post('/comments')
    .set('token', token)
    .send({
        comment: "Yo whatsup Ori", 
        PhotoId: 2
    })
  expect(res.statusCode).toEqual(201);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("comment");
  expect(res.body.comment).toHaveProperty("comment");
  expect(res.body.comment.UserId).toEqual(tokenId);
  
  });

  it('Photo Id Photo Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .post('/comments')
    .set('token', token)
    .send({
        comment: "Yo whatsup Ori", 
        PhotoId: 10
    })

  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers).toHaveProperty("date");
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual("Photo not found");
  });

  it('Photo Id Mush Be an Integer (Failed)', async ()  => { 
    const res = await request(app)
    .post('/comments')
    .set('token', token)
    .send({
        comment: "Yo whatsup Ori", 
        PhotoId: "Loga"
    })
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers).toHaveProperty("date");
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual("Photo Id must be an integer");
  });

});

describe('Test GET /comments', () => {

    it('Get (Succes)', async ()  => { 
        const res = await request(app)
        .get('/comments')
        .set('token', token)
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
        expect(res.body).toHaveProperty("comments");
        expect(res.body.comments[0]).toHaveProperty("User");
        expect(res.body.comments[0]).toHaveProperty("Photo");
    });

  it('Token Invalid (Failed)', async ()  => { 
    const res = await request(app)
    .get('/comments')
    .set('token', "invalid token")
    expect(res.statusCode).toEqual(401);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toHaveProperty("message");
    expect(res.body.name).toEqual("JsonWebTokenError");
    expect(res.body.message).toEqual("jwt malformed");
});

});

describe('Test PUT /comments/:commentId', () => {
  
  it('Edited (Succes)', async ()  => { 
    const res = await request(app)
    .put('/comments/1 ')
    .set('token', token)
    .send({
      comment: "Yo whatsup Ori",
  })
  expect(res.statusCode).toEqual(200);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("comment");
  expect(res.body.comment).toHaveProperty("UserId");
  expect(res.body.comment.comment).toEqual("Yo whatsup Ori");
  });

  it('Id Comment Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .put('/comments/10 ')
    .set('token', token)
    .send({
      comment: "Yo whatsup Ori"
  })
        
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("Comment not found");    
});

it('Invalid Token (Failed)', async ()  => { 
    const res = await request(app)
    .put('/comments/1 ')
    .set('token', "broken")
    .send({
      comment: "Yo whatsup Ori"
  })

  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt malformed");
});

  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .put('/comments/1 ')
    .send({
      comment: "Yo whatsup Ori"
  })    
  
  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt must be provided");
});

});

describe('Test delete /comments/:commentId', () => {
   
  it('Id Comment Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/comments/2 ')
    .set('token', token)
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("Comment not found");
  });
  
  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/comments/1 ')
    
    expect(res.statusCode).toEqual(401);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toHaveProperty("message");
    expect(res.body.name).toEqual("JsonWebTokenError");
    expect(res.body.message).toEqual("jwt must be provided");
  });

  it('Invalid Token (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/comments/1 ')
    .set('token', "broken")

  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt malformed");
});


  it('Deleted (Succes)', async ()  => { 
    const res = await request(app)
    .delete('/comments/1 ')
    .set('token', token)
    
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.headers["x-powered-by"]).toEqual("Express");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Your comment has been successfully deleted");
  });
  
});

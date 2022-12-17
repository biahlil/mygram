const request = require('supertest');
const app = require('../../server');
const { getPayloadId} = require('../../helpers/jwt');

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

describe('Test POST /socialmedias', () => {
  
    it('Created (Succes)', async ()  => { 
    const res = await request(app)
    .post('/socialmedias')
    .set('token', token)
    .send({
      name: "Nani Dion",
      social_media_url: "http://mygram.com/nonidion"
    })
  expect(res.statusCode).toEqual(201);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("social_media");
  expect(res.body.social_media).toHaveProperty("UserId");
  expect(res.body.social_media.UserId).toEqual(tokenId);
  
  });

  it('Social Media Url Validasi (Failed)', async ()  => { 
    const res = await request(app)
    .post('/socialmedias')
    .set('token', token)
    .send({
      name: "Nani Dion",
      social_media_url: "http://///mygram.com/nonidion"
    })

  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body.path).toEqual("social_media_url");
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual("Validation error: Validation isUrl on social_media_url failed");
  });

  it('With Out Name (Failed)', async ()  => { 
    const res = await request(app)
    .post('/socialmedias')
    .set('token', token)
    .send({
      social_media_url: "http://mygram.com/nonidion"
    })

    expect(res.statusCode).toEqual(500);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body.path).toEqual("name");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("notNull Violation: SocialMedia.name cannot be null");
    });

});

describe('Test GET /socialmedias', () => {

    it('Get (Succes)', async ()  => { 
        const res = await request(app)
        .get('/socialmedias')
        .set('token', token)
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
        expect(res.body).toHaveProperty("social_medias");
        expect(res.body.social_medias[0]).toHaveProperty("User");
        expect(res.body.social_medias[0]).toHaveProperty("social_media_url");
    });

  it('Token Invalid (Failed)', async ()  => { 
    const res = await request(app)
    .get('/socialmedias')        
    .set('token', "invalid token")
    expect(res.statusCode).toEqual(401);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toHaveProperty("message");
    expect(res.body.name).toEqual("JsonWebTokenError");
    expect(res.body.message).toEqual("jwt malformed");
});

});

describe('Test PUT /socialmedias/:socialmediaId', () => {
  
  it('Edited (Succes)', async ()  => { 
    const res = await request(app)
    .put('/socialmedias/1')
    .set('token', token)
    .send({
      name: "Nani Dion2",
      social_media_url: "http://mygram.com/nonidion2"
    })
  expect(res.statusCode).toEqual(200);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("social_media");
  expect(res.body.social_media).toHaveProperty("UserId");
  expect(res.body.social_media.name).toEqual("Nani Dion2");
  });

  it('Social Media Id Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .put('/socialmedias/10')
    .set('token', token)
    .send({
      name: "Nani Dion2",
      social_media_url: "http://mygram.com/nonidion2"
    })
        
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers).toHaveProperty("date");
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual("Social Media not found");    
});

it('Social Media Url Validasi (Failed)', async ()  => { 
    const res = await request(app)
    .put('/socialmedias/1')
    .set('token', token)
    .send({
      name: "Nani Dion2",
      social_media_url: "http://////mygram.com/nonidion2"
    })

    expect(res.statusCode).toEqual(500);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body.path).toEqual("social_media_url");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Validation error: Validation isUrl on social_media_url failed");
    });

  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .put('/socialmedias/1')
    .send({
      name: "Nani Dion2",
      social_media_url: "http://mygram.com/nonidion2"
    })
    
  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt must be provided");
});

});

describe('Test delete /socialmedias/:socialmediasId', () => {
   
  it('Social Media Id Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/socialmedias/10')
    .set('token', token)
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers).toHaveProperty("date");
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual("Social Media not found");
  });
  
  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/socialmedias/1')
    
    expect(res.statusCode).toEqual(401);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toHaveProperty("message");
    expect(res.body.name).toEqual("JsonWebTokenError");
    expect(res.body.message).toEqual("jwt must be provided");
  });

  it('Invalid Token (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/socialmedias/1')
    .set('token', "broken")

  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt malformed");
});


  it('Deleted (Succes)', async ()  => { 
    const res = await request(app)
    .delete('/socialmedias/1')
    .set('token', token)
    
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.headers["x-powered-by"]).toEqual("Express");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Your social media has been successfully deleted");
  });
  
});

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


describe('Test POST /photos', () => {
  
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
  
    it('Created (Succes)', async ()  => { 
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
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("Photo");
  expect(res.body.Photo).toHaveProperty("title");
  expect(res.body.Photo.caption).toEqual("Foto ini udah jadul12");
  
  });

  it('Tidak ada judul (Failed)', async ()  => { 
    const res = await request(app)
    .post('/photos')
    .set('token', token)
    .send({
        caption: "Foto ini udah jadul12", 
        poster_image_url: "https://fotokemenangan.com",
        UserId: tokenId
    })
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("path");
  expect(res.body.type).toEqual("notNull Violation");
  expect(res.body.message).toEqual("notNull Violation: Photo.title cannot be null");
  });

  it('profile_image_url Invalid (Faliled)', async ()  => { 
    const res = await request(app)
    .post('/photos')
    .set('token', token)
    .send({
        title: "Foto Jadul", 
        caption: "Foto ini udah jadul12", 
        poster_image_url: "https://///fotokemenangan.com",
        UserId: tokenId
    })

    // .expect((res) => {
    //   console.log(res.body);
    //  })

  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("path");
  expect(res.body.type).toEqual("Validation error");
  expect(res.body.message).toEqual("Validation error: Validation isUrl on poster_image_url failed");
  });

});

describe('Test GET /photos', () => {

    it('Get (Succes)', async ()  => { 
        const res = await request(app)
        .get('/photos')
        .set('token', token)
        // console.log(res.body.photos[0]);
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
        expect(res.body).toHaveProperty("photos");
        expect(res.body.photos[0]).toHaveProperty("User");
        expect(res.body.photos[0]).toHaveProperty("Comments");
    });

  it('Token Invalid (Failed)', async ()  => { 
    const res = await request(app)
    .get('/photos')
    .set('token', "invalid token")
    expect(res.statusCode).toEqual(401);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toHaveProperty("message");
    expect(res.body.name).toEqual("JsonWebTokenError");
    expect(res.body.message).toEqual("jwt malformed");
});

});

describe('Test PUT /photos/:photoId', () => {
  
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
    .put('/photos/1 ')
    .set('token', token)
    .send({
        title: "Foto Jadul Edited", 
        caption: "Foto ini udah jadul12", 
        poster_image_url: "https://fotokemenangan.com"
    })
    
  expect(res.statusCode).toEqual(200);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("photo");
  expect(res.body.photo).toHaveProperty("caption");
  expect(res.body.photo.title).toEqual("Foto Jadul Edited");
  });

  it('Id Photo Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .put('/photos/10 ')
    .set('token', token)
    .send({
        title: "Foto Jadul Edited", 
        caption: "Foto ini udah jadul12", 
        poster_image_url: "https://fotokemenangan.com"
    })
        
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("Photo not found");    
});

it('poster_image_url Invalid (Failed)', async ()  => { 
    const res = await request(app)
    .put('/photos/1 ')
    .set('token', token)
    .send({
        title: "Foto Jadul Edited", 
        caption: "Foto ini udah jadul12", 
        poster_image_url: "https://////fotokemenangan.com"
    })
        
    expect(res.statusCode).toEqual(500);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toHaveProperty("path");
    expect(res.body.type).toEqual("Validation error");
    expect(res.body.message).toEqual("Validation error: Validation isUrl on poster_image_url failed");
  });

  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .put('/photos/1 ')
    .send({
        title: "Foto Jadul", 
        caption: "Foto ini udah jadul12", 
        poster_image_url: "https://fotokemenangan.com"
    })    
  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt must be provided");
});

});

describe('Test delete /photos/:photoId', () => {
  
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
  
  it('Id Photo Not Found (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/photos/2 ')
    .set('token', token)
    
  expect(res.statusCode).toEqual(500);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.headers["x-powered-by"]).toEqual("Express");
  expect(res.headers).toHaveProperty("date");
  expect(res.body.message).toEqual("Photo not found");
  });

  it('No Token (Failed)', async ()  => { 
    const res = await request(app)
    .delete('/photos/1 ')
        
  expect(res.statusCode).toEqual(401);
  expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
  expect(res.body).toHaveProperty("message");
  expect(res.body.name).toEqual("JsonWebTokenError");
  expect(res.body.message).toEqual("jwt must be provided");
});

it('Invalid Token (Failed)', async ()  => { 
  const res = await request(app)
  .delete('/photos/1 ')
  .set('token', "broken")

expect(res.statusCode).toEqual(401);
expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
expect(res.body).toHaveProperty("message");
expect(res.body.name).toEqual("JsonWebTokenError");
expect(res.body.message).toEqual("jwt malformed");
});

  it('Deleted (Succes)', async ()  => { 
    const res = await request(app)
    .delete('/photos/1 ')
    .set('token', token)
    
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.headers["x-powered-by"]).toEqual("Express");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Your photo has been successfully deleted");
  });
  
});

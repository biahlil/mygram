const app = require('./server.js');
const PORT = process.env.PORT|| 80;

app.listen(PORT, function(){
    // console.log(`listening on port ${PORT}`);
})
require('dotenv').config();

const express = require('express');
let bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

// database setup
mongoose = require('mongoose')
let Url = require('./url.js')
let Count = require('./count.js')

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

// run only when initilizing the database
function set_initial_count(){
    let count = new Count({
      id: "counter",
        index: 0
    })
    
    count.save(function(err, data) {       
        console.log('pushed') }) 
}
//set_initial_count();

function isValidURL(str) {
    var expression = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return expression.test(str)
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res){
    // check if url valid
    if (!isValidURL(req.body.url)){
        res.json({ error: 'invalid url' })
        return
    }
    
    let index = 0
    Count.findOne({id: "counter"}, function(err, result){
        if (err) return console.log(err);
        result['index'] += 1
        index = result['index']
        result.save()

        let d = {
         original_url : req.body.url,
        short_url : index
        }

        let url = new Url({
            index: index,
            url:  req.body.url
        })

        url.save(function(err, data) {}) 
        
        res.json(d)
    // post url
    })
})

app.get('/api/shorturl/:index', function(req, res){
    // redirect to url
    Url.findOne({ index: req.params.index }, function(err, result){
        res.redirect(result['url'])
    })
    
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

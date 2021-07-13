var express = require('express');
var app = express();
var port = 3000;
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');

//public 디렉토리에서 찾음
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

app.use(compression());

app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    // next -> 그다음에 실행되어야할 미들웨어가 담겨있음, 따라서 호출
    next();
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic 으로 시작하는 주소들에게 topicRouter 미들웨어 적용 

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
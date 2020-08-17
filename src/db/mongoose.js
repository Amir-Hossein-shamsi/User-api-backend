const mongoose = require('mongoose');
const mongoURL='mongodb://127.0.0.1:27017/imdb-backend-api';
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

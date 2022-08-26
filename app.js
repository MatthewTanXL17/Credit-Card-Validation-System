const app = require ('express')();
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// api routes
app.post('/', (req,res)=>{
    console.log("Hello There");
})



app.listen(5000,()=>{
    console.log('Server started at bla')
})
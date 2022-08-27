const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const moment = require ('moment');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// api routes
app.get('/', (req,res) => {
    res.render('index')
})

app.post('/', (req,res)=>{
    let month = req.body.expiry.slice(0,2);
    let year = req.body.expiry.slice(3,5);
    let num = req.body.number.slice(0,2);
    let len = req.body.number.length
    
    if(month == 0 || month > 12){
        req.flash('error', `Invalid Month Entered!`)
        res.redirect('/')
    }
    else if(year < moment().year().toString().substring(2) || (month < (moment().month() + 1) && year == (moment().year().toString().substring(2)))){
        req.flash('error', `credit card has expired!`)
        res.redirect('/')
    }
    else{
        if(len <15){
            req.flash('error', `Card number must be between 16 - 19 digits long!`)
            res.redirect('/')
        }
        else{
            const arr = (req.body.number + '').split('').reverse().map(x => parseInt(x));
            const lastDigit = arr.shift();
            let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val)),0);
            sum += lastDigit;
            if (sum % 10 !== 0){
                req.flash('error', `Invalid Credit Card Number!`)
                res.redirect('/')
            }
            else{
                if(num == 34 || num == 37){
                    if(req.body.cvv.length != 4){
                        req.flash('error', `CVV for American Express cards must have 4 digits!`)
                        res.redirect('/')
                    }
                    else{
                        req.flash('success', `Credit Card Validation Successful!`)
                        res.redirect('/')
                    }
                }
                else if(req.body.cvv.length != 3){
                    req.flash('error', `CVV for non-American Express cards must have 3 digits!`)
                    res.redirect('/')
                }
                else{
                    req.flash('success', `Credit Card Validation Successful!`)
                    res.redirect('/')
                }
            }
        }
    }
})



app.listen(5000,()=>{
    console.log('Server started at port 5000')
})
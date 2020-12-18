const { constant } = require('async');
const express = require('express');
const app = express();
const User = require('./models/user');
const budgetModel = require('./models/budget_schema.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const url = 'mongodb://localhost:27017/final_project';

mongoose.connect('mongodb://localhost:27017/final_project', { useNewUrlParser: true,
useUnifiedTopology: true,
useCreateIndex: true })
.then(() => {
    console.log("MONGO CONNECTION OPEN!!!")
})
.catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!")
    console.log(err)
})


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}))
app.use(session({ secret: 'notagoodsecret'}))
app.use(express.static("public"))

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

app.get('/', (req, res) => {
    res.redirect("/secret")
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const user = new User ({
        username, 
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/index")

})

app.get('/login', (req, res) => {
    res.render('login')
}) 

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password)
    if(validPassword){
        req.session.user_id = user._id;
        res.redirect("/index")
    }
    else {
        res.redirect("/login")
    }
})

app.post('/logout', (req,res) => {
    req.session.destroy(); 
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    
        res.render('secret')
    })

    app.get('/index', requireLogin, (req, res) => {
    
        res.render('index')
    })

    app.get('/budgetItem', (req, res) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
          .then(()=> {
            budgetModel.find({})
              .then((data)=> {
                res.json(data)
                mongoose.connection.close();
              })
              .catch((connectionError)=> {
                console.log(connectionError);
              });
          });
      });
      
      app.post('/budgetItemsAdd', (req, res) => {
         //console.log(req.body);
         mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
         .then(()=> {
             var budgetItem = new budgetModel({
             title: req.body.title,
             budget: req.body.budget,
             color: req.body.color
           });
           budgetModel.insertMany(budgetItem)
            .then((data)=> {
            res.json(data);
            mongoose.connection.close();
            })
            .catch((connectionError)=> {
              console.log(connectionError)
            });
         })
            .catch((connectionError)=>{
              console.log(connectionError)
            });
      });

app.listen(4000, () => {
    console.log("SERVING YOUR APP!")
})
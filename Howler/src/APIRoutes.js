const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const {TokenMiddleware, generateToken, removeToken} = require('./middleware/TokenMiddleware');

let follows = require('./data/follows.json');
let howls = require('./data/howls.json');
let users = require('./data/users.json');

let getFilteredUser = function(user) {
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "avatar": user.avatar
    }
}

apiRouter.post('/users/login', (req, res) => {
    console.log('HW5 Request: ' + req.body);
    if (req.body.username && req.body.password) {
        let user = users.find(user => user.username == req.body.username);
        console.log(user);
        if (user) {
            crypto.pbkdf2(req.body.password, user.salt, 40000, 64, 'sha256', (err, derivedKey) => {
                if (err) { 
                    res.status(400).json({error: "Error: " + err});
                }
                console.log(derivedKey);
                const digest = derivedKey.toString('hex');
                console.log(digest);
                if (user.password == digest) {
                    getFilteredUser(user);
                    generateToken(req, res, user);
                    res.json(user);
                }
                else {
                    res.status(401).json({error: 'Invalid username or password'});
                }
            });
        }
        else {
            res.status(401).json({error: 'Username not in database'});
        }
    }
    else {
        res.status(401).json({error: 'Not authenticated'});
    }
});

apiRouter.post('/users/logout', (req, res) => {
    removeToken(req, res);
    res.json({success: true});
});

apiRouter.post('/users/register', (req, res) => {
    if (req.body.first_name && req.body.last_name && req.body.username && req.body.password) {
        let newid = users.length + 1;
        let salt = crypto.randomBytes(10).toString('hex');
        crypto.pbkdf2(req.body.password, salt, 40000, 64, 'sha256', (err, derivedKey) => {
            if (err) {
                res.status(400).json({error: 'An error occurred'})
            }
            else {
                let password = derivedKey.toString('hex');
                let newuser = {
                    id: newid,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    avatar: "https://robohash.org/" + req.body.username + ".png?size=64x64&set=set1",
                    salt: salt,
                    password: password
                }
                users.push(newuser);
                let newfollowlist = {
                    userid: newuser.id,
                    following: []
                }
                follows[newuser.id] = newfollowlist;
                // console.log('Does follows add? ' + follows[newuser.id]);
                generateToken(req, res, newuser);
                res.json(newuser);
            }
        })
    }
    else {
        res.status(401).json({error: 'Error during registration'});
    }
});

apiRouter.get('/users/current', TokenMiddleware, (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.status(401).json({error: 'Not authenticated'});
    }
});

apiRouter.get('/follows/:userid', TokenMiddleware, (req, res) => {
    console.log('Current follows object: ' + follows.toString());
    let id = req.params.userid;
    let followed = follows[id].following;
    console.log(followed);
    let usersFollowed = users.filter(user => followed.find(id => id == user.id));
    if (usersFollowed) {
        res.json(usersFollowed);
    }
    else {
        res.status(404).json({error: 'No users followed'});
    }
});

apiRouter.get('/howls/followed', TokenMiddleware, (req, res) => {
    let followed = follows[req.user.id].following;
    let howlsFollowed = howls.filter(howl => followed.find(id => id == howl.userId) || howl.userId == req.user.id);
    if (howlsFollowed) {
        res.json(howlsFollowed);
    }
    else {
        res.status(404).json({error: 'User doesn\'t have any howls on their feed'});
    }
});

apiRouter.get('/howls/:userid', TokenMiddleware, (req, res) => {
    let id = req.params.userid;
    let howlsbyuser = howls.filter(howl => howl.userId == id);
    if (howlsbyuser) {
        res.json(howlsbyuser);
    }
    else {
        res.status(404).json({error: 'There are no howls in your feed'});
    }
});

apiRouter.get('/users/:userid', TokenMiddleware, (req, res) => {
    let id = req.params.userid;
    let thisuser = users.find(user => user.id == id);
    if (thisuser) {
        res.json(thisuser);
    }
    else {
        res.status(404).json({error: 'User not found'});
    }
});

apiRouter.post('/follows', TokenMiddleware, (req, res) => {
    let id = parseInt(req.body.id);
    console.log(id);
    let followed = follows[req.user.id].following;
    console.log(followed);
    let isFollowing = followed.find(index => followed[index] == id);
    console.log(isFollowing);
    if (!isFollowing) {
        follows[req.user.id].following.push(id);
        console.log(follows[req.user.id].following);
        res.json(follows);
    }
    else {
        res.status(400).json({error: 'User is already being followed'});
    }
});

apiRouter.delete('/follows/:userid', TokenMiddleware, (req, res) => {
    let id = parseInt(req.params.userid);
    console.log(id);
    let followed = follows[req.user.id].following;
    console.log(followed);
    console.log(followed[0]);
    console.log(followed[0] == id);
    let isFollowing = followed.find(anid => anid == id);
    console.log(isFollowing);
    if (isFollowing) {
        let index = followed.indexOf(isFollowing);
        follows[req.user.id].following.splice(index, 1);
        console.log(follows[req.user.id].following );
        res.json(follows);
    }
    else {
        res.status(400).json({error: 'User is not being followed by current user'});
    }
});

apiRouter.post('/howls', TokenMiddleware, (req, res) => {
    let newid = howls.length + 1;
    let newhowl = {
        id: newid,
        userId: req.body.userId,
        datetime: req.body.datetime,
        text: req.body.text
    }
    howls.push(newhowl);
    res.json(howls);
})

module.exports = apiRouter;
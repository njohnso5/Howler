const crypto = require('crypto');
const base64url = require('base64url');
const API_SECRET = process.env.API_SECRET_KEY;

const TOKEN_COOKIE_NAME = "HowlerToken";

exports.TokenMiddleware = (req, res, next) => {
    // console.log(req);
    let token = null;
    token = req.cookies[TOKEN_COOKIE_NAME];
    if(!token) {
      res.status(401).json({error: 'Not authenticated'});
      return;
    }
    // console.log(token);
    try {
      const splitToken = token.split('.');
      const encodeheader = splitToken[0];
      const header = base64url.decode(encodeheader);
      const encodepayload = splitToken[1];
      const payload = base64url.decode(encodepayload);
      const hmac = crypto.createHmac('sha256', API_SECRET);
      hmac.update(encodeheader + '.' + encodepayload);
      const signature = hmac.digest('hex');      
      if (signature == splitToken[2]) {
        const userpayload = JSON.parse(payload);
        const currdate = Date.now() / 1000;
        console.log('Current time: ' + currdate);
        console.log('Expiration time: ' + userpayload.exp);
        if (currdate > userpayload.exp) {
          res.status(401).json({error: 'Token has expired. Please log in again'});
        }
        else {
          req.user = userpayload.user;
          next(); //Make sure we call the next middleware
        }
      }
    }
    catch(err) { //Token is invalid
      res.status(401).json({error: 'Not authenticated'});
      return;
    }
}


exports.generateToken = (req, res, user) => {
  let header = {
    "alg": "HS256",
    "typ": "JWT"
  }
  let payload = {
    "exp": Math.floor(Date.now() / 1000) + (60 * 60),
    "user": {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "avatar": user.avatar
    }
  }

  console.log('Expiration: ' + payload.exp);
  const encodeheader = base64url.encode(JSON.stringify(header));
  const encodepayload = base64url.encode(JSON.stringify(payload));
  const hmac = crypto.createHmac('sha256', API_SECRET);
  hmac.update(encodeheader + '.' + encodepayload);
  const signature = hmac.digest('hex');

  const token = encodeheader + '.' + encodepayload + '.' + signature;
  // console.log(token);

  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1000 //This session expires in 2 minutes.. but token expires in 1 hour!
  });
  hmac.end();
};


exports.removeToken = (req, res) => {
  //send session ID in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000 //A date in the past
  });

}


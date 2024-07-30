import queryString from "query-string";
import googleConfig from "../constants.js";
import jwt from "jsonwebtoken";
import axios from "axios";
// import { dummyUsers } from '../sockets/users.js';
import connection from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
const loggedIn = (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(JSON.stringify(req.cookies.token), "token")
    if (!token) {
      res.json({ loggedIn: false });
      return;
    }
    const { user } = jwt.verify(token, googleConfig.tokenSecret);
    console.log(user, "user 17");
    const newToken = jwt.sign({ user }, googleConfig.tokenSecret, {
      expiresIn: googleConfig.tokenExpiration,
    });
    res.cookie("token", newToken, {
      maxAge: googleConfig.tokenExpiration,
      // encode: String,
      // path: '/',
      httpOnly: true,
      // secure: true
    });
    console.log(user, "user 26");
    return res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
};

const url = (req, res) => {
  const params = queryString.stringify({
    client_id: googleConfig.clientId,
    redirect_uri: googleConfig.redirectUrl,
    response_type: "code",
    scope: "email profile openid",
    state: "oauth_google",
  });
  // console.log(googleConfig, "googleConfig")
  // console.log(params, "params")
  res.json({ url: googleConfig.authUrl + "?" + params });
};

const token = async (req, res) => {
  const code = req.query.code;
  console.log(req.query, "exchange params");
  if (!code)
    return res
      .status(400)
      .json({ message: "Authorization code must be provided" });
  const params = queryString.stringify({
    client_id: googleConfig.clientId,
    client_secret: googleConfig.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: googleConfig.redirectUrl,
  });
  // console.log(params, "exchange params")
  try {
    // console.log(`${googleConfig.tokenUrl}?${params}`, "tokenUrl")
    const {
      data: { id_token },
    } = await axios.post(`${googleConfig.tokenUrl}?${params}`);
    // console.log(id_token, "id_token");
    const { email, name, picture } = jwt.decode(id_token);
    // const password = ;
    console.log(jwt.decode(id_token), "id from google");
    const user = { email, name, picture, user_id: null };
    const userid = uuidv4();

    connection.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.log("Error fetching user");
          return res
            .status(400)
            .json({ message: "Failed to fetch user", error: err });
        }
        if (result.length > 0) {
          console.log("User already exists, so not adding to db");
          console.log(result, "###)000000");
          user.user_id = result[0].user_id;
          const token = jwt.sign({ user }, googleConfig.tokenSecret, {
            expiresIn: googleConfig.tokenExpiration,
          });
          return res
            .cookie("token", token, {
              maxAge: googleConfig.tokenExpiration,
              httpOnly: true,
            })
            .json({ token: token, user });
        }
        const query =
          "INSERT INTO user (user_id, username, password_hash, email, picture) VALUES (?, ?, ?, ?, ?)";
        connection.query(
          query,
          [userid, name, userid, email, picture], // Assuming you have a passwordHash variable
          (err, result) => {
            if (err) {
              console.log("Error inserting user", err);
              return res.status(400).json({
                message: "Failed to insert user",
                error: err,
              });
            }
            console.log("User inserted successfully!", result.insertId);
            user.user_id = result.insertId;
            const token = jwt.sign({ user }, googleConfig.tokenSecret, {
              expiresIn: googleConfig.tokenExpiration,
            });
            return res
              .cookie("token", token, {
                maxAge: googleConfig.tokenExpiration,
                httpOnly: true,
              })
              .json({ token: token, user });
          }
        );
      }
    );
    // connection.query(query, [userId, email, userId, email, picture], (err, result) => {
    //     if (err) {
    //         console.log('user already exists, so not adding to db');
    //         // throw err;
    //     }
    //     console.log('User inserted successfully!');
    // });

    // const user = { email, name, picture, id: userId };
    // const newUser = {
    //     id: user.id,
    //     name,
    //     email,
    //     subject: "Meeting Tomorrow",
    //     text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    //     date: "2023-10-22T09:00:00",
    //     read: true,
    //     labels: ["meeting", "work", "important"],
    // };
    // const users = dummyUsers.filter(user => user.email === user.email);
    // if (users.length === 0) dummyUsers.push(newUser);
    // dummyUsers.push(newUser);
    // console.log(newUser, "dummyUsers");
    // console.log(user, "user");
    // const token = jwt.sign({ user }, googleConfig.tokenSecret, { expiresIn: googleConfig.tokenExpiration });
    // // console.log((token), "token client side");
    // res.cookie('token', token
    //     , {
    //         maxAge: googleConfig.tokenExpiration,
    //         httpOnly: true,
    //         // encode: String,
    //         // path: '/',
    //         // secure: true
    //     }
    // ).json({ token: token, user });
    // res.json({token:token, user });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to exchange code for token", error: err });
  }
};

const logout = (req, res) => {
  res
    .clearCookie("token", {
      // maxAge: googleConfig.tokenExpiration,
      httpOnly: true,
      // path: '/',
      // encode: String,
      // secure: true
    })
    .json({ message: "Logged out" });
};

export { loggedIn, url, token, logout };

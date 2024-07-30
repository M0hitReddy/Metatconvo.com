import mysql from 'mysql';
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

export default connection;
// ...

// const { email, name, picture } = jwt.decode(id_token);

// const user = { email, name, picture, id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a"+ (email.substring(0,1) === 'm' ? '1' : '2')};

// const query = `INSERT INTO Users (UserID, Username, Email, ProfilePicture) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.picture}')`;

// connection.query(query, (err, result) => {
//   if (err) throw err;
//   console.log('User inserted successfully!');
// });

// ...
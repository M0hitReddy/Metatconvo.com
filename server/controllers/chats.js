import { dummyUsers } from "../sockets/users.js";
import connection from "../db/db.js";
// only when clicked on start chat with xyz, conversation is created, from then on, we get the created conversations data
export const createConversation = async (req, res) => {
  // if already exists, return
  // else create
  const { members } = req.body;
  console.log(req.body, "members");
  let convoName = "";
  const sortedMembers = members.sort();
  sortedMembers.forEach((member) => {
    convoName += member + ",";
  });
  convoName = convoName.slice(0, -1);
  console.log(convoName, "convoName");
  connection.query(
    "SELECT * FROM conversations WHERE name = ?",
    [convoName],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error fetching conversations" });
      }
      if (result.length > 0) {
        console.log("Conversation already exists");
        return res.status(200).json({
          success: true,
          message: "conversation already exists",
          conversation_id: result[0].conversation_id,
        });
      }
      connection.query(
        "INSERT INTO conversations (name) VALUES (?)",
        [convoName],
        async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Error creating conversation" });
          }
          const conversationId = result.insertId;
          let query =
            "INSERT INTO user_conversation (conversation_id, user_id) VALUES ";
          let queryValues = [];
          members.forEach((memberId) => {
            query += "(?, ?),";
            queryValues.push(conversationId, memberId);
          });
          query = query.slice(0, -1);
          connection.query(query, queryValues, (err, result) => {
            if (err) {
              console.log("Error inserting conversation users:", err.message);
              return res.status(500).json({
                success: false,
                message: "Error creating conversation",
              });
            }
            console.log("Conversation_Users inserted successfully!");
            return res.json({
              success: true,
              message: "Conversation created",
              conversation_id: conversationId,
            });
          });
        }
      );
    }
  );
};

export const getConversations = async (req, res) => {
  const { userId } = req.query;
  const query =
    // with all
    `SELECT 
    u.user_id, 
    u.username, 
    u.picture, 
    uc.conversation_id,
(SELECT m1.content 
     FROM message m1 
     WHERE m1.conversation_id = uc.conversation_id 
     ORDER BY m1.message_id DESC 
     LIMIT 1) AS last_message_content,
     (SELECT m1.sender_id 
     FROM message m1 
     WHERE m1.conversation_id = uc.conversation_id 
     ORDER BY m1.message_id DESC 
     LIMIT 1) AS last_message_sender_id,
    (SELECT CASE 
                WHEN m1.sender_id = ? THEN m1.sent_at 
                ELSE m1.received_at
            END
     FROM message m1 
     WHERE m1.conversation_id = uc.conversation_id 
     ORDER BY m1.message_id ASC 
     LIMIT 1) AS first_message_time,
    (SELECT CASE 
                WHEN m2.sender_id = ? THEN m2.sent_at 
                ELSE m2.received_at 
            END
     FROM message m2 
     WHERE m2.conversation_id = uc.conversation_id 
     ORDER BY m2.message_id DESC 
     LIMIT 1) AS last_message_time
FROM 
    user u
JOIN 
    user_conversation uc ON u.user_id = uc.user_id
JOIN 
    (SELECT conversation_id
     FROM user_conversation
     WHERE user_id = ?) AS conv_ids 
ON 
    uc.conversation_id = conv_ids.conversation_id 
WHERE 
    u.user_id != ? ORDER BY last_message_time DESC;
`;
  // without last message and time
  // `SELECT u.user_id, u.username, u.picture, uc.conversation_id
  //               FROM user u
  //               JOIN user_conversation uc ON u.user_id = uc.user_id
  //               JOIN (
  //                   SELECT conversation_id
  //                   FROM user_conversation
  //                   WHERE user_id = ?
  //               ) AS conv_ids ON uc.conversation_id = conv_ids.conversation_id where u.user_id != ?`;
  connection.query(query, [userId, userId, userId, userId], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching conversations" });
    }
    console.log("fetched successfully!");
    console.log(result);
    return res.status(200).json({
      success: true,
      message: "fetched successfully",
      conversations: result,
    });
  });
};

export const getConversation = async (req, res) => {
  const { p1, p2 } = req.query;
  const query = `SELECT p1.conversation_id
FROM 
    (SELECT uc.conversation_id 
     FROM user_conversation uc 
     WHERE user_id = ?) p1
JOIN
    (SELECT uc.conversation_id 
     FROM user_conversation uc 
     WHERE user_id = ?) p2
ON
    p1.conversation_id = p2.conversation_id`;

  connection.query(
    "SELECT * FROM user where user_id = ?",
    [p2],
    (p2err, p2result) => {
      if (p2err) {
        console.log(p2err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching conversation" });
      }
      console.log("fetched successfully!");
      console.log(p2result);
      connection.query(query, [p1, p2], (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Error fetching conversation" });
        }
        console.log("fetched convID successfully!", result);
        console.log({
          ...p2result[0],
          conversation_id: result[0].conversation_id,
        });
        return res.status(200).json({
          success: true,
          message: "fetched successfully",
          conversation: {
            ...p2result[0],
            conversation_id: result[0].conversation_id,
          },
        });
      });
    }
  );
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.query;
  const query = "SELECT * FROM message WHERE conversation_id = ?";
  connection.query(query, [conversationId], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching messages" });
    }
    console.log("fetched successfully!");
    console.log(result);
    return res.status(200).json({
      success: true,
      message: "fetched successfully",
      messages: result,
    });
  });
};

export const postMessage = async (reqBody) => {
  const { sender_id, conversation_id, content, sent_at } = reqBody;
  const query =
    "INSERT INTO message (sender_id, conversation_id, content, sent_at) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [sender_id, conversation_id, content, sent_at],
    (err, res) => {
      if (err) {
        console.log(err);
        return;
        // return res
        //   .status(500)
        //   .json({ success: false, message: "Error sending message" });
      }
      console.log("Message inserted successfully!");
      // return res.status(200).json({ success: true, message: "Message sent" });
    }
  );
};

// export const getMessages = (req, res) => {
//   // console.log("id", req.query)
//   const { conversationID } = req.query;
//   console.log(conversationID, "conversationId");
//   const query = "SELECT * FROM Messages WHERE conversationID = ?";
//   connection.query(query, [conversationID], (err, result) => {
//     if (err) {
//       console.log(err);
//       // throw err;
//     } else {
//       console.log("fetched successfully!");
//       console.log(result);
//       return res.json(result);
//     }
//   });
//   // const messages = dummyMessages.filter(message => (message.senderId === s_id && message.receiverId === r_id) || (message.senderId === r_id && message.receiverId === s_id));
//   // console.log(messages, "current chat messages");
//   // return res.json(messages);
// };

// export const postMessage = (req, res) => {
//   const { SenderID, conversationID, content, timestamp } = req.body;
//   // dummyMessages.push(req.body);
//   // console.log(dummyMessages, "dummyMessages");
//   // console.log(dummyMessages, "dummyMessages");
//   const query =
//     "INSERT INTO Messages (senderID, conversationID, content, timestamp) VALUES (?, ?, ?, ?)";
//   connection.query(
//     query,
//     [SenderID, conversationID, content, timestamp],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         // throw err;
//       } else {
//         console.log(result, "Message inserted successfully!");
//         res.status(200).json({ message: result });
//       }
//     }
//   );
//   // return res.json({ message: 'Message sent' });
// };

// export const createConversation = async (req, res) => {
//   // const { senderId, receiverId, message } = req.body;
//   const { members, creator, isGroup } = req.body;
//   let f = 0;
//   console.log(req.body, "members");
//   members.push(creator);
//   members.sort();
//   console.log(members, "members");
//   let name = "";
//   for (let i = 0; i < members.length; i++) {
//     name += members[i] + ",";
//   }
//   name = name.slice(0, -1);
//   if (!isGroup)
//     connection.query(
//       "SELECT * FROM conversations WHERE name = ? and is_group = ? ",
//       [name, isGroup],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           return res
//             .status(500)
//             .json({ error: "Error fetching conversations" });
//         }
//         if (result.length > 0) {
//           console.log("Conversation already exists");
//           f = 1;
//         //   console.log(result[0].user_id);
//           return res.json({ conversationId: result[0].conversation_id });
//         }
//         connection.query(
//           "INSERT INTO conversations (name) VALUES (?)",
//           [name],
//           async (err, result) => {
//             if (err) {
//               console.log(err);
//               return res
//                 .status(500)
//                 .json({ error: "Error creating conversation" });
//               // throw err;
//             }
//             const conversationId = result.insertId;
//             // Prepare the base of the INSERT statement
//             let conversations_usersQuery =
//               "INSERT INTO user_conversation (conversation_id, user_id) VALUES ";
//             // Array to hold the values to be inserted
//             let queryValues = [];
//             // Add placeholders and values for each member
//             // queryValues.push(conversationId, creator);
//             members.forEach((memberId) => {
//               conversations_usersQuery += "(?, ?),";
//               queryValues.push(conversationId, memberId);
//             });
//             // Remove the trailing comma
//             conversations_usersQuery = conversations_usersQuery.slice(0, -1);
//             // Execute the query
//             connection.query(
//               conversations_usersQuery,
//               queryValues,
//               (err, result) => {
//                 if (err) {
//                   console.log(
//                     "Error inserting conversation users:",
//                     err.message
//                   );
//                   return res.status(500).json({
//                     error: "Error adding members to conversation",
//                   });
//                 }
//                 console.log("Conversation_Users inserted successfully!");
//                 return res.json({
//                   message: "Conversation created",
//                   conversationId: conversationId,
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   // if (f === 0)

//   // const query = 'INSERT INTO Conversations (name) VALUES (?)';
//   // connection.query(query, [senderId + "," + receiverId], (err, result) => {
//   //     if (err) {
//   //         console.log('conversation already exists, so not adding to db');
//   //         // throw err;
//   //     }
//   //     else {
//   //         const conversationId = result.insertId;
//   //         const messageQuery = 'INSERT INTO Messages (senderId, receiverId, content, conversationID) VALUES (?, ?, ?, ?)';
//   //         connection.query(messageQuery, [senderId, receiverId, message, conversationId], (err, result) => {
//   //             if (err) {
//   //                 console.log('message already exists, so not adding to db');
//   //                 // throw err;
//   //             }
//   //             else {
//   //                 const newMessageId = result.insertId;
//   //                 const conversations_usersQuery = 'INSERT INTO Conversations_Users (conversationID, userID, lastmessageID) VALUES (?, ?) , (?, ?)';
//   //                 connection.query(conversations_usersQuery, [conversationId, senderId, conversationId, receiverId], (err, result) => {
//   //                     if (err) {
//   //                         console.log('conversation already exists, so not adding to db');
//   //                         // throw err;
//   //                     }
//   //                     else
//   //                         console.log('Conversation_Users inserted successfully!');
//   //                 });
//   //                 console.log('Message inserted successfully!');
//   //             }
//   //         });
//   //         console.log('Conversation inserted successfully!');
//   //     }
//   // });
//   // return res.json({ message: 'Conversation created' });
// };

// export const getConversation = async (req, res) => {
//   const { conversationId, userId } = req.query;
//   console.log(req.query, "userId");
//   const query = `
// SELECT
//     user.username,
//     user_conversation.user_id AS userID,
//     user_conversation.joined_at,
//     user_conversation.conversation_id AS conversationID,
//     messages.content,
//     messages.sent_at,
// FROM
//    ( SELECT * from user_conversation where conversation_id = ?) as user_conversation
// JOIN user ON user.user_id = user_conversation.user_id
// LEFT JOIN message
// ON messages.message_id = user_conversation.lastmessageID
// WHERE conversations_users.userid != ?`;

//   // SELECT
//   //     users.username,
//   //     conversations_users.userid AS userID,
//   //     conversations_users.JoinedTime,
//   //     conversations_users.lefttime,
//   //     conversations_users.lastmessageID,
//   //     conversations_users.conversationid AS conversationID,
//   //     messages.content,
//   //     messages.timestamp,
//   //     messages.readstatus
//   // FROM
//   //    ( SELECT * from conversations_users where conversationid = 2) as conversations_users
//   // JOIN users ON users.id = conversations_users.userid
//   // LEFT JOIN messages
//   // ON messages.id = conversations_users.lastmessageID
//   // WHERE conversations_users.userid != 'd4ecc029-a88a-40ac-acc8-4b380955225a'

//   // SELECT
//   //     users.username,
//   //     conversations_users.userid AS userID,
//   //     conversations_users.JoinedTime,
//   //     conversations_users.lefttime,
//   //     conversations_users.lastmessageID,
//   //     conversations_users.conversationid AS conversationID

//   // FROM
//   //    ( SELECT * from conversations_users where conversationid = 2) as conversations_users
//   // JOIN users ON users.id = conversations_users.userid
//   // WHERE conversations_users.userid != 'd4ecc029-a88a-40ac-acc8-4b380955225a'

//   connection.query(query, [conversationId, userId], (err, result) => {
//     if (err) {
//       console.log(err);
//       // throw err;
//     } else {
//       console.log("fetched successfully!");
//       console.log(result);
//       return res.json(result);
//     }
//   });
// };

// export const getConversations = async (req, res) => {
//   const { userId } = req.query;
//   console.log(req.query, "userId");
//   const query = `
// SELECT
//     users.username,
//     conversations_users.userid AS userID,
//     conversations_users.JoinedTime,
//     conversations_users.lefttime,
//     conversations_users.lastmessageID,
//     convos.conversationid AS conversationID,
//     messages.content,
//     messages.timestamp,
//     messages.readstatus
// FROM
//     conversations_users
// JOIN (
//     SELECT conversationid
//     FROM conversations_users
//     WHERE userid = ?
// ) AS convos
// ON convos.conversationid = conversations_users.conversationid
// JOIN users
// ON users.id = conversations_users.userid
// JOIN messages
// ON messages.id = conversations_users.lastmessageID
// WHERE conversations_users.userid != ?
// `;

//   // SELECT
//   //     users.username,
//   //     conversations_users.userid AS userID,
//   //     conversations_users.JoinedTime,
//   //     conversations_users.lefttime,
//   //     conversations_users.lastmessageID,
//   //     convos.conversationid AS conversationID
//   // FROM
//   //     conversations_users
//   // JOIN (
//   //     SELECT conversationid
//   //     FROM conversations_users
//   //     WHERE userid = 'd4ecc029-a88a-40ac-acc8-4b380955225a'
//   // ) AS convos
//   // ON convos.conversationid = conversations_users.conversationid
//   // JOIN users
//   // ON users.id = conversations_users.userid where userid ='fa48516e-6179-4647-962d-3a82eaeb7b41'
//   // JOIN messages
//   // ON messages.id = conversations_users.lastmessageID
//   // WHERE conversations_users.userid != 'd4ecc029-a88a-40ac-acc8-4b380955225a';

//   // const query = 'SELECT * FROM Conversations';
//   connection.query(query, [userId, userId], (err, result) => {
//     if (err) {
//       console.log(err);
//       // throw err;
//     } else {
//       console.log("Conversation inserted successfully!");
//       console.log("fetched successfully!");
//       console.log(result);
//       return res.json(result);
//     }
//   });
//   // return res.json({ message: 'Conversation created' });
// };

export const getUsers = async (req, res) => {
  const { search } = req.query;
  const query = "SELECT * FROM user WHERE username like ?";
  connection.query(query, [`%${search}%`], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error fetching users" });
    }
    console.log("fetched successfully!");
    console.log(result);
    return res.json(result);
  });

  // return res.json({ message: 'Conversation created' });
};

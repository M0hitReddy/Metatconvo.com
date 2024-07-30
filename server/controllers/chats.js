// import { dummyUsers } from "../sockets/users.js";
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

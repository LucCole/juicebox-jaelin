const { Client } = require('pg') // imports the pg module

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function createUser({ username, password, name, location }) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);

    return user;
//     const { rows: [ createUser ] } = await client.query(`

// `, []);

//   return createUser;

  } catch (error) {
    throw error;
  }
}



async function getAllUsers() {
  const { rows } = await client.query(`SELECT id, username, name, location, active FROM users;`);
  //columns in the table you want data from 
  return rows;

}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [user] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return user;
    // we can use advanced destructuring here
// const { rows: [ user ] } = await client.query(`

// `, []);

// // ...

// return user;
  } catch (error) {
    throw error;
  }
}

// SET ${ setString }
// WHERE id=${ id }




async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const { rows: [ post ] } = await client.query(`
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `, [authorId, title, content]);

    return post;
  } catch (error) {
    throw error;
  }
}
//mimic createUser few changes

async function updatePost(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ post ] } = await client.query(`
      UPDATE posts
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return post;
  } catch (error) {
    throw error;
  }
}
//mimic updateUser

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM posts;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}
//mimic getAllUsers

async function getUserById(userId) {
  try {
    const {rows: [user]} = await client.query(`
    Select id, username, location, name, active FROM users
    WHERE id=${ userId };
    `);
    if (!user) {
      return null;
    } else {
      user.posts = await getPostsByUser(userID)}
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  
  // first get the user (NOTE: Remember the query returns 
    // (1) an object that contains 
    // (2) a `rows` array that (in this case) will contain 
    // (3) one object, which is our user.
  // if it doesn't exist (if there are no `rows` or `rows.length`), return null

  // if it does:
  // delete the 'password' key from the returned object
  // get their posts (use getPostsByUser)
  // then add the posts to the user object with key 'posts'
  // return the user object




  async function getPostsByUser(userId) {
    try {
      const { rows } = await client.query(`
        SELECT * 
        FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }




//exporting them
module.exports = {  
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser
}
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
  content,
  tags = [] //this is new
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

async function updatePost(postId, fields = {}) {
  // read off the tags & remove that field 
  const { tags } = fields; // might be undefined
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ postId }
        RETURNING *;
      `, Object.values(fields));
    }

    // return early if there's no tags to update
    if (tags === undefined) {
      return await getPostById(postId);
    }

    // make any new tags that need to be made
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map(
      tag => `${ tag.id }`
    ).join(', ');

    // delete any post_tags from the database which aren't in that tagList
    await client.query(`
      DELETE FROM post_tags
      WHERE "tagId"
      NOT IN (${ tagListIdString })
      AND "postId"=$1;
    `, [postId]);

    // and create post_tags as necessary
    await addTagsToPost(postId, tagList);

    return await getPostById(postId);
  } catch (error) {
    throw error;
  }
}
//mimic updateUser

// async function getAllPosts() {
//   try {
//     const { rows } = await client.query(`
//       SELECT *
//       FROM posts;
//     `);

//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }
//mimic getAllUsers

//newwaybelow

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




  // async function getPostsByUser(userId) {
  //   try {
  //     const { rows } = await client.query(`
  //       SELECT * 
  //       FROM posts
  //       WHERE "authorId"=${ userId };
  //     `);
  
  //     return rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

//new way below
  async function getPostsByUser(userId) {
    try {
      const { rows: postIds } = await client.query(`
        SELECT id 
        FROM posts 
        WHERE "authorId"=${ userId };
      `);
  
      const posts = await Promise.all(postIds.map(
        post => getPostById( post.id )
      ));
  
      return posts;
    } catch (error) {
      throw error;
    }
  }


  async function getAllPosts() {
    try {
      const { rows: postIds } = await client.query(`
        SELECT id
        FROM posts;
      `);
  
      const posts = await Promise.all(postIds.map(
        post => getPostById( post.id )
      ));
  
      return posts;
    } catch (error) {
      throw error;
    }
  }
  


  const createTags = async(tagList) => {
    if (tagList.length === 0) {
      return;
    }
  const insertValues = tagList.map(
    (_, index) => `$${index + 1}`).join('),(');
  const selectValues = tagList.map(
    (_, index) => `$${index + 1}`).join(', ');
  try {
    await client.query(`
      INSERT INTO tags(name)
      VALUES (${insertValues})
      ON CONFLICT (name) DO NOTHING;
      `, tagList)
    const { rows } = await client.query(`
      SELECT *
      FROM tags
      WHERE name
      IN (${selectValues});
      `, tagList);
      return rows;
    } catch(err) {
      throw err
    }
  }


  async function createPostTag(postId, tagId) {
    try {
      await client.query(`
        INSERT INTO post_tags("postId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("postId", "tagId") DO NOTHING;
      `, [postId, tagId]);
    } catch (error) {
      throw error;
    }
  }

  const addTagsToPost = async(postId, tagList) => {
    try {
      const createPostTagPromises = tagList.map(
        tag => createPostTag(postId, tag.id)
      );
      await Promise.all(createPostTagPromises);
      return await getPostById(postId);
    } catch(err) {
      throw err;
    }
  }

  async function getPostById(postId) {
    try {
      const { rows: [ post ]  } = await client.query(`
        SELECT *
        FROM posts
        WHERE id=$1;
      `, [postId]);
  
      const { rows: tags } = await client.query(`
        SELECT tags.*
        FROM tags
        JOIN post_tags ON tags.id=post_tags."tagId"
        WHERE post_tags."postId"=$1;
      `, [postId])
  
      const { rows: [author] } = await client.query(`
        SELECT id, username, name, location
        FROM users
        WHERE id=$1;
      `, [post.authorId])
  
      post.tags = tags;
      post.author = author;
  
      delete post.authorId;
  
      return post;
    } catch (error) {
      throw error;
    }
  }




  async function getPostsByTagName(tagName) {
    try {
      const { rows: postIds } = await client.query(`
        SELECT posts.id
        FROM posts
        JOIN post_tags ON posts.id=post_tags."postId"
        JOIN tags ON tags.id=post_tags."tagId"
        WHERE tags.name=$1;
      `, [tagName]);
  
      return await Promise.all(postIds.map(
        post => getPostById(post.id)
      ));
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
  getPostsByUser,
  getPostsByTagName,
  createTags,
  createPostTag,
  addTagsToPost,
 

}
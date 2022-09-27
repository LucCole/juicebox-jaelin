const {  
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  addTagsToPost,
  createTags,
  getPostsByTagName,

  

} = require('./index');

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
  
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      

    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
     "authorId" INTEGER REFERENCES users(id) NOT NULL,
     title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
     active BOOLEAN DEFAULT true
      );

    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(225) UNIQUE NOT NULL
    );

    CREATE TABLE post_tags (
      "postId" INTEGER REFERENCES posts(id),
      "tagId" INTEGER REFERENCES tags(id),
      UNIQUE ("postId", "tagId")
    );
    `);
  


    // postId, VARCHAR(225) UNIQUE NOT NULL,
    // tagId, VARCHAR(225) UNIQUE NOT NULL

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

//new function that should be able to create a new user

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({ username: 'albert', password: 'bertie99', name: 'Al', location: 'LA' });
    await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sand', location: 'NV' });
    await createUser({ username: 'glamgal', password: 'soglam', name: 'Tricia', location: 'FL' });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");
    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      tags: ["#happy", "#youcandoanything"]
    });

    await createPost({
      authorId: sandra.id,
      title: "How does this work?",
      content: "Seriously, does this even do anything?",
      tags: ["#happy", "#worst-day-ever"]
    });

    await createPost({
      authorId: glamgal.id,
      title: "Living the Glam Life",
      content: "Do you even? I swear that half of you are posing.",
      tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}

// async function createPostTag(postId, tagId) {
//   try {
//     await client.query(`
//       INSERT INTO post_tags("postId", "tagId")
//       VALUES ($1, $2)
//       ON CONFLICT ("postId", "tagId") DO NOTHING;
//     `, [postId, tagId]);
//   } catch (error) {
//     throw error;
//   }
// }
  //part 3 adding tags to post



  //directions say to removeCreateInitialTags
  // const createInitialTags = async() => {
  //   try {
  //     console.log('...starting to create tags...');
  //     const [happy, sad, inspo, catman] = await createTags([
  //       '#happy',
  //       '#worst-day-ever',
  //       '#youcandoanything',
  //       '#catmandoeverything'
  //     ]);
  //     const [postOne, postTwo, postThree] = await getAllPosts();
  //     await addTagsToPost(postOne.id, [happy, inspo]);
  //     await addTagsToPost(postTwo.id, [sad]);
  //     await addTagsToPost(postThree.id, [happy, catman, inspo]);
  //     console.log('...finished creating tags...')
  //   } catch (err) {
  //     console.log('...error creating tags...')
  //     throw err;
  //   }
  // }





async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);


    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
    });
    console.log("Result:", updatePostTagsResult);


    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}


async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
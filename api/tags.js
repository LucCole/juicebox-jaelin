//part 3 section 3

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    try {
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
      // forward the name and message to the error handler
    }
  });
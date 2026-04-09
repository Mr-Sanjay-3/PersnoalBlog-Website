import Post from '../models/Post.js';

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    let posts = await Post.find({}).populate('author', 'username email').sort({ createdAt: -1 });

    // Scrub private posts (remove content and mediaUrl for list view)
    // Even admins shouldn't download full content here, but we could if we wanted.
    // For bandwidth, we just scrub it.
    posts = posts.map(post => {
      if (post.isPrivate) {
        return {
          ...post.toObject(),
          title: post.hideTitle ? 'CLASSIFIED DOCUMENT' : post.title,
          content: 'LOCKED',
          mediaUrl: '',
          accessCode: undefined // NEVER SEND ACCESS CODE
        };
      }
      return {
        ...post.toObject(),
        accessCode: undefined
      };
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');

    if (post) {
      const isAdmin = req.user && req.user.role === 'admin';

      // If private and not admin, scrub it
      if (post.isPrivate && !isAdmin) {
        return res.json({
          ...post.toObject(),
          title: post.hideTitle ? 'CLASSIFIED DOCUMENT' : post.title,
          content: 'LOCKED',
          mediaUrl: '',
          accessCode: undefined
        });
      }

      const safePost = post.toObject();
      delete safePost.accessCode;

      res.json(safePost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, mediaUrl, isPrivate, hideTitle, accessCode } = req.body;

    const post = new Post({
      title,
      content,
      mediaUrl,
      isPrivate: isPrivate || false,
      hideTitle: hideTitle || false,
      accessCode: accessCode || '',
      author: req.user._id,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const { title, content, mediaUrl, isPrivate, hideTitle, accessCode } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
      const isAdmin = req.user && req.user.role === 'admin';
      if (post.author.toString() !== req.user._id.toString() && !isAdmin) {
        return res.status(401).json({ message: 'Not authorized to edit this post' });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      post.mediaUrl = mediaUrl !== undefined ? mediaUrl : post.mediaUrl;
      post.isPrivate = isPrivate !== undefined ? isPrivate : post.isPrivate;
      post.hideTitle = hideTitle !== undefined ? hideTitle : post.hideTitle;
     
      if (accessCode !== undefined) {
        post.accessCode = accessCode;
      }

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      const isAdmin = req.user && req.user.role === 'admin';
      if (post.author.toString() !== req.user._id.toString() && !isAdmin) {
        return res.status(401).json({ message: 'Not authorized to delete this post' });
      }

      await post.deleteOne();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle save post
// @route   POST /api/posts/:id/save
// @access  Private
export const toggleSavePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await req.user.model('User').findById(req.user._id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSaved = user.savedPosts.includes(post._id);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter((id) => id.toString() !== post._id.toString());
    } else {
      user.savedPosts.push(post._id);
    }

    await user.save();

    res.json({ message: isSaved ? 'Post unsaved' : 'Post saved', savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unlock a private post
// @route   POST /api/posts/:id/unlock
// @access  Public
export const unlockPost = async (req, res) => {
  try {
    const { accessCode } = req.body;
    const post = await Post.findById(req.params.id).populate('author', 'username email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.isPrivate) {
      return res.status(400).json({ message: 'This post is not private' });
    }

    const isMatch = await post.matchAccessCode(accessCode);

    if (isMatch) {
      const unscrubbedPost = post.toObject();
      delete unscrubbedPost.accessCode; // NEVER send it back
      res.json(unscrubbedPost);
    } else {
      res.status(403).json({ message: 'Invalid access code' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

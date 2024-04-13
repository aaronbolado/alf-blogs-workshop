const Post = require('../models/postModel')
const deleteFile = require('../utils/deleteFile')

// CREATE
// @desc    Create a Post
// @route   POST /posts
// access   Public
const createPost = async (req, res) => {
    // Validate if req.body exists (body contains the data from schema)
    if (!req.body) {
        req.status(400).json( {error: 'No request body'})
    }

    const { title, author, content } = req.body

    // const { path } = req.file
    const path = req.file?.path ?? null; //if file exists, check path, if not, null

    try {
        const post = new Post({
            title,
            author,
            content,
            cover_photo: path
        })         

        const newPost = await post.save() // Using save to run the 'required' validation

        if (newPost) {
            res.status(201).json(newPost)
        }
    } catch (error) {
        console.log(error)
        res.status(422).json(error)
    }
}

// READ
// @desc    Get All Posts
// @route   GET /posts
// access   Public
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find() // returns everything 

        res.json(posts)
    } catch (error) {
        console.log(error)
    }
}

// @desc    Show Specified Post
// @route   GET /posts/:id
// access   Public
const showPost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id) // returns specific id 

        if (!post) {
            res.status(404).json({ error: 'Post not Found'})
        }

        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: 'Post not Found'})
    }
}

// UPDATE
// @desc    Update a Post
// @route   PUT/PATCH /posts/:id  (:id is a dynamic parameter)
// access   Public
const updatePost = async (req, res) => {
    const { id } = req.params // we can get the id from the params, not the body
    
    // Validate if req.body exists (body contains the data from schema)
    if (!req.body) {
        req.status(400).json( {error: 'No request body'})
    }

    // We can get id from url and body is in the request body
    const { title, author, content } = req.body 

    const path = req.file?.path ?? null; // if file exists, check path, if not, null

    try {
        // Find the Post
        const originalPost = await Post.findById(id);

        // If there is no post, return
        if (!originalPost) {
            return res.status(404).json({ error: 'Original Post Not Found' })
        }
        
        // ? Handle Deleting of the Previous Photo
        // Only Delete the Previous Photo if there's a newly UPLOADED File
        if (originalPost.cover_photo && path) {
            console.log(originalPost)
            deleteFile(originalPost.cover_photo)
        }

        // Update the Fields of the Original Post
        originalPost.title = title;
        originalPost.author = author;
        originalPost.content = content;
        originalPost.cover_photo = path;

        // Save post
        const updatePost = await originalPost.save();

        // Return
        res.status(200).json(updatePost)

    } catch (error) {
        console.log(error)
        res.status(422).json(error)
    }
}

// DELETE
// @desc    Delete specified post
// @route   DEL /posts/:id  
// access   Public
const deletePost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findByIdAndDelete(id) // returns specific id 

        if (!post) {
            res.status(404).json({ error: 'Post not Found'})
        }

        if (post.cover_photo) {
            deleteFile(post.cover_photo)
        }

        res.status(200).json({ message: 'Sucessfully deleted post'})
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: 'Post not Found'})
    }
}

module.exports = {
    getAllPosts,
    createPost,
    updatePost,
    showPost,
    deletePost
}
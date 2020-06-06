const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');

module.exports = {
	createUser: async function ({ userInput }, req) {
		const email = userInput.email;

		const errors = [];

		if (!validator.isEmail(userInput.email)) {
			errors.push({ message: 'Invalid Email' })
		}

		if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
			errors.push({ message: 'Invalid Password' })
		}

		if (errors.length > 0) {
			const error = new Error('Invalid Input');
			error.data = errors;
			error.code = 422;
			throw error;
		}

		const existingUser = await User.findOne({ email: email })
		if (existingUser) {
			const error = new Error("User alreay Exists");
			throw error;
		}

		const hashedPassword = await bcrypt.hash(userInput.password, 12);

		const user = new User({
			name: userInput.name,
			password: hashedPassword,
			email: email
		})

		const createdUser = await user.save();

		return { ...createdUser._doc, _id: createdUser._id.toString() }
	},

	login: async function ({ email, password }, req) {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error("User not found.");
			error.code = 402;
			throw error;
		}

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			const error = new Error("Password is incorrect.");
			error.code = 402;
			throw error;
		}

		const token = jwt.sign({
			userId: user._id.toString(),
			email: user.email
		}, 'somesupersecretkey', { expiresIn: '1h' });

		return { token: token, userId: user._id.toString() };
	},
	createPost: async function ({ postInput }, req) {
		if (!req.isAuth) {
			const error = new Error("User is not Authenticated!!!");
			error.code = 401;
			throw error;
		}
		const errors = [];
		if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
			errors.push({ message: 'Invalid Title' })
		}

		if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5 })) {
			errors.push({ message: 'Invalid Content' })
		}

		if (errors.length > 0) {
			const error = new Error('Invalid Input');
			error.data = errors;
			error.code = 422;
			throw error;
		}

		const user = await User.findById(req.userId);

		if (!user) {
			const error = new Error("User is not Registered!!!");
			error.code = 401;
			throw error;
		}

		const post = new Post({
			content: postInput.content,
			title: postInput.title,
			imageUrl: postInput.imageUrl,
			creator: user
		})

		const createdPost = await post.save();

		user.posts.push(createdPost);

		await user.save();

		return { ...createdPost._doc, _id: createdPost._id.toString(), createdAt: createdPost.createdAt.toISOString(), updatedAt: createdPost.updatedAt.toISOString() }
	},

	posts: async function (args, req) {
		// if (!req.isAuth) {
		// 	const error = new Error("User is not Authenticated!!!");
		// 	error.code = 401;
		// 	throw error;
		// }

		const totalPosts = await Post.find().countDocuments();
		const posts = await Post.find().sort({ createdAt: -1 }).populate('creator');

		return {
			posts: posts.map((p) => {
				return { ...p._doc, _id: p._id.toString(), createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
			}), totalPosts: totalPosts
		};
	}
}
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const config = require('../configs/config');

// this will be our database's user data structure
const UserSchema = new Schema(
	{
		id: false,
		userId: {
			type: Schema.Types.ObjectId,
			required: [true, "{PATH} cannot be empty"]
		},
		fullname: {
			type: String,
			required: [true, "{PATH} cannot be empty"]
		},
		email: {
			type: String,
			required: [true, "{PATH} cannot be empty"]
		},
		password: {
			type: String,
			required: [true, "{PATH} is required"]
		},
		organiserinfo: {
			name: {
				type: String,
				required: [true, "{PATH} is required"]
			},
			country: {
				type: String,
				required: [true, "{PATH} is required"]
			},
			city: {
				type: String,
				required: [true, "{PATH} is required"]
			},
			street: {
				type: String,
				required: [true, "{PATH} is required"]
			},
			zipcode: {
				type: Number,
				required: [true, "{PATH} is required"]
			}
		},
		inactivatedDateTime: {
			type: Number,
			default: 0
		},
		deletedDateTime: {
			type: Number,
			default: 0
		},
		tokens: [{
			token: {
				type: String,
				required: true
			}
		}]
	},
	{ timestamps: true }
);

// method to generate token and save the user
UserSchema.methods.generateAuthToken = async function () {
	const user = this;
	const payload = {
		_id: user._id.toString()
	};

	const token = jwt.sign(payload, config.JWT_SECRET);
	if (!token)
		throw new Error('Token not generated');

	user.tokens = user.tokens.concat({ token });
	await user.save()
		.then((updateduser) => {
			return updateduser;
		})
		.catch(err => {
			throw new Error('User not updated with new token!' + err);
		});

	return token;
};

// method to authenticate user using credentials
UserSchema.statics.findByCredentials = async function (email, password) {
	let conditions = { email: email };
	const user = await User.findOne(conditions)
		.orFail(new Error('email or password wrong!'));

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('email or password wrong!');
	}
	return user;
};

// hash the plain text password
UserSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

// export the new Schema so we could modify it using Node.js
export default model(
	"users",
	UserSchema,
);

const bcrypt = require('bcrypt');
const UserModel = require('../models/UsersModel.js');

class UserService {
    static async registerUser(userData) {
        const { firstName, lastName, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        return await UserModel.createUser(firstName, lastName, email, hashedPassword);
    }

    static async loginUser(userData) {
        const { email, password } = userData;
        const user = await UserModel.findUserByEmail(email);
        if (!user) {
            throw new Error('email not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        if (user.status === 'blocked') {
            throw new Error('user is blocked');
        }

        await UserModel.updateLastLogin(user.id);
        return user;
    }

    static async logoutUser(session) {
            return new Promise((resolve, reject) => {
                if (!session.userId) {
                    return resolve({ success: false, message: 'No active session', status: 400 });
                }

                session.destroy(err => {
                    if (err) {
                        console.error('Error:', err);
                        return reject({ success: false, message: 'Logout failed', status: 500 });
                    }
                    resolve({ success: true, message: 'User logged out successfully', status: 200 });
                });
            });
    }

static async getAllUsers() {
        return await UserModel.getAllUsers();
    }

    static async deleteUsers(userIds) {
        return await UserModel.deleteUserByIds(userIds);
    }

    static async blockUsers(userIds, status) {
        return await UserModel.updateUserStatus(userIds, status);
    }

    static async unBlockUsers(userIds, status) {
        return await UserModel.updateUserStatus(userIds, status);
    }
}

module.exports = UserService;

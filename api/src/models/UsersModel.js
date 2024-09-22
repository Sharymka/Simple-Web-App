const db = require('../../../database.js');

class UserModel {
    static async createUser(firstName, lastName, email, password) {
        const [result] = await db.execute(
            'INSERT INTO users (firstName, lastName, email, password, last_login) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, password, new Date()],
        );
        return result;
    }

    static async findUserByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async updateLastLogin(userId) {
        const [result] = await db.execute('UPDATE users SET last_login = ? WHERE id = ?', [new Date(), userId]);
        return result;
    }

    static async getAllUsers() {
        const [users] = await db.execute('SELECT id, firstName, lastName, email, status, registration_date, last_login FROM users');
        return users;
    }

    static async deleteUserByIds(userIds) {
        const placeholders = userIds.map(() => '?').join(', ');
        const [result] = await db.execute(`DELETE FROM users WHERE id IN (${placeholders})`, [...userIds]);
        return result;
    }

    static async updateUserStatus(userIds, status) {
        const placeholders = userIds.map(() => '?').join(', ');
        const [result] = await db.execute(`UPDATE users SET status = ? WHERE id IN (${placeholders})`, [status, ...userIds]);
        return result;
    }
}

module.exports = UserModel;

import { IUser } from '../../interfaces/user.interface';
import getConnection from '../base/getConnection';

export class User {
  id: number;
  email: string;
  username?: string;
  password?: string;

  constructor(id: number, email: string, username?: string, password?: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static async create(email: string, name?: string, password?: string) {
    const connection = await getConnection();
    try {
      if (!name || !email) {
        throw new Error('Invalid input');
      }
      const [response] = await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        password ?? '',
      ]);
      return response;
    } catch (err) {
      console.error(err);
      throw new Error('Error creating user');
    } finally {
      connection.release();
    }
  }

  static async findById(id: number): Promise<User | null> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
      const users = rows as IUser[];
      if (users.length > 0) {
        const user = users[0];
        return new User(user.id, user.name, user.email);
      }
      return null;
    } finally {
      connection.release();
    }
  }

  // Otros métodos estáticos o de instancia...
}

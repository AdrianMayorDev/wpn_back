import { ResultSetHeader } from 'mysql2/promise';
import getConnection from './getConnection';

export abstract class BaseQuery<T> {
  protected abstract table: string;
  protected abstract id: number | null;

  async insert(data: Partial<T>): Promise<T> {
    const connection = await getConnection();
    try {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');

      const query = `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders})`;
      const [result] = await connection.execute<ResultSetHeader>(query, values);

      return { id: result.insertId, ...data } as T;
    } finally {
      connection.release();
    }
  }

  async update(data: Partial<T>): Promise<T> {
    const connection = await getConnection();
    try {
      const keys = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(data), this.id];

      const query = `UPDATE ${this.table} SET ${keys} WHERE id = ?`;
      const [result] = await connection.execute<ResultSetHeader>(query, values);

      return { id: result.insertId, ...data } as T;
    } finally {
      connection.release();
    }
  }

  async delete(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM ${this.table} WHERE id = ?`, [this.id]);
    } finally {
      connection.release();
    }
  }

  async getById(selectKeys: string[]): Promise<T | null> {
    const connection = await getConnection();
    const select = Object.keys(selectKeys).join(', ');

    try {
      const [rows] = await connection.execute(`SELECT ${select} FROM ${this.table} WHERE id = ?`, [this.id]);
      const data = rows as T[];
      if (data.length > 0) {
        return data[0];
      }
      return null;
    } finally {
      connection.release();
    }
  }

  async getByField(selectFields: string[], field: string, value: string): Promise<T | null> {
    const connection = await getConnection();
    const select = selectFields.join(', ');
    try {
      const [rows] = await connection.execute(`SELECT ${select} FROM ${this.table} WHERE ${field} = ?`, [value]);
      const data = rows as T[];
      if (data.length > 0) {
        return data[0];
      }
      return null;
    } finally {
      connection.release();
    }
  }
}

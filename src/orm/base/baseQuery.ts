import { ResultSetHeader } from 'mysql2/promise';
import getConnection from './getConnection';
import { logger } from '@/utils/logger';
import { CustomError } from '@/utils/CustomError';

export abstract class BaseQuery<T> {
  protected abstract table: string;
  protected abstract id: number | null;

  protected async insert(data: Partial<T>): Promise<T> {
    const connection = await getConnection();
    const keys = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const query = `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders})`;
    try {
      const [result] = await connection.execute<ResultSetHeader>(query, values);

      return { id: result.insertId, ...data } as T;
    } catch (err) {
      throw new CustomError('Error inserting data', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  protected async update(data: Partial<T>): Promise<T> {
    const connection = await getConnection();
    try {
      const keys = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(data), this.id];

      const query = `UPDATE ${this.table} SET ${keys} WHERE id = ?`;
      const [result] = await connection.execute<ResultSetHeader>(query, values);
      console.info(`Result: `, result);
      return { id: result.insertId, ...data } as T;
    } catch (err) {
      throw new CustomError('Error updating data', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  protected async delete(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM ${this.table} WHERE id = ?`, [this.id]);
    } catch (err) {
      throw new CustomError('Error deleting data', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  protected async getById(selectKeys: string[]): Promise<T | null> {
    const connection = await getConnection();
    try {
      const select = selectKeys.join(', ');
      logger.info(`Select keys: ${select} ${this.id}`);
      const [rows] = await connection.execute(`SELECT ${select} FROM ${this.table} WHERE id = ?`, [this.id]);
      const data = rows as T[];

      if (data.length > 0) {
        return data[0];
      }
      return null;
    } catch (err) {
      throw new CustomError('Error fetching data by ID', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  protected async getByField(selectFields: string[], field: string, value: string): Promise<T | null> {
    const connection = await getConnection();
    try {
      const select = selectFields.join(', ');
      const [rows] = await connection.execute(`SELECT ${select} FROM ${this.table} WHERE ${field} = ?`, [value]);
      const data = rows as T[];
      if (data.length > 0) {
        return data[0];
      }
      return null;
    } catch (err) {
      throw new CustomError('Error fetching data by field', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  async deleteRow(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM ${this.table} WHERE id = ?`, [this.id]);
    } catch (err) {
      throw new CustomError('Error deleting fields', 500, err as Error);
    } finally {
      connection.release();
    }
  }
}

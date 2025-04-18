import { ResultSetHeader } from 'mysql2/promise';
import getConnection from './getConnection';
import { logger } from '@/utils/logger';
import { CustomError } from '@/utils/CustomError';
import { mapKeys, toCamelCase, toSnakeCase } from '@/utils/mapKeys';

abstract class BaseQuery<T extends Record<string, any>, DBType extends Record<string, any>> {
  protected abstract table: string;

  protected mapToDbFields(data: T): DBType {
    return mapKeys(data, toSnakeCase);
  }

  protected mapToModel(data: DBType): T {
    return mapKeys(data as Record<string, any>, toCamelCase);
  }

  // Create
  async insert(data: Partial<T>) {
    const connection = await getConnection();
    const mappedData = this.mapToDbFields(data as T);
    logger.debug(`Data to insert: `, data);
    logger.debug(`Mapped data: `, mappedData);

    const keys = Object.keys(mappedData).join(', ');
    const values = Object.values(mappedData);
    const placeholders = values.map(() => '?').join(', ');
    const query = `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders})`;

    try {
      const [result] = await connection.execute<ResultSetHeader>(query, values);

      logger.info(`Inserted ${result.affectedRows} rows`);
      console.info(`Result: `, result);

      return this.mapToModel(mappedData) as T;
    } catch (err) {
      throw new CustomError('Error inserting data', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  async insertMany(data: Array<Partial<T>>) {
    const connection = await getConnection();
    const mappedData = data.map((item) => this.mapToDbFields(item as T));
    const keys = Object.keys(mappedData[0]).join(', ');
    const values = data.map((item) => Object.values(item));
    const placeholders = values
      .map(() => '(' + '?'.repeat(Object.values(data[0]).length).split('').join(', ') + ')')
      .join(', ');
    const query = `INSERT INTO ${this.table} (${keys}) VALUES ${placeholders}`;
    try {
      const [result] = await connection.execute<ResultSetHeader>(query, values.flat());

      logger.info(`Inserted ${result.affectedRows} rows`);
      console.info(`Result: `, result);

      return mappedData.map((item) => this.mapToModel(item)) as T[];
    } catch (err) {
      throw new CustomError('Error inserting data', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  // Update
  async update({ keyField, data, value }: { keyField: string; data: Partial<T>; value: string | number }) {
    const connection = await getConnection();
    const mappedData = this.mapToDbFields(data as T);
    try {
      const keys = Object.keys(mappedData)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(mappedData), value];

      const query = `UPDATE ${this.table} SET ${keys} WHERE ${keyField} = ?`;

      logger.debug(`Query to update: `, query);
      logger.debug(`Values to update: `, values);

      const [result] = await connection.execute<ResultSetHeader>(query, values);

      console.info(`Result: `, result);

      return this.mapToModel(mappedData) as T;
    } catch (err) {
      throw new CustomError('Error updating data', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  // Read
  // async getById({ fieldsToSelect, keyField }: { fieldsToSelect: string[], keyField: string }) {
  //   const connection = await getConnection();
  //   try {
  //     const select = fieldsToSelect.join(', ');
  //     logger.info(`Select keys: ${select} ${this.id}`);
  //     const [rows] = await connection.execute(`SELECT ${select} FROM ${this.table} WHERE ${} = ?`, [this.id]);
  //     const data = rows as DBType[];

  //     if (data.length > 0) {
  //       return this.mapToModel(data[0]);
  //     }
  //     return null;
  //   } catch (err) {
  //     throw new CustomError('Error fetching data by ID', 500, err as Error);
  //   } finally {
  //     connection.release();
  //   }
  // }

  async getByField({
    fieldsToSelect,
    keyField,
    values,
  }: {
    fieldsToSelect: string[];
    keyField: string;
    values: Array<string | number>;
  }) {
    const connection = await getConnection();
    try {
      const select = fieldsToSelect.join(', ');
      console.log(values.length, 'values', values);
      const whereClause = values.map(() => `${keyField} = ?`).join(' OR ');

      const query = `SELECT ${select} FROM ${this.table} WHERE ${whereClause}`;
      logger.info(`Query to get by field: ${query}`, values);
      const [rows] = await connection.execute(query, values);
      const data = rows as DBType[];

      if (data.length > 0) {
        return data.map((item) => this.mapToModel(item)) as T[];
      }

      return null;
    } catch (err) {
      throw new CustomError('Error fetching data by field', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  async getByManyFields({
    fieldsToSelect,
    keyFields,
    values,
  }: {
    fieldsToSelect: string[];
    keyFields: string[];
    values: Array<string | number>;
  }) {
    const connection = await getConnection();
    try {
      const select = fieldsToSelect.join(', ');
      const where = keyFields.map((field) => `${field} = ?`).join(' AND ');
      const [rows] = await connection.execute(`SELECT ${select} FROM ${this.table} WHERE ${where}`, values);
      const data = rows as DBType[];
      if (data.length > 0) {
        return this.mapToModel(data[0]);
      }
      return null;
    } catch (err) {
      throw new CustomError('Error fetching data by many fields', 500, err as Error);
    } finally {
      connection.release();
    }
  }

  // Delete
  async delete({ keyField, value }: { keyField: string; value: string }): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM ${this.table} WHERE ${keyField} = ?`, [value]);
    } catch (err) {
      throw new CustomError('Error deleting data', 500, err as Error);
    } finally {
      connection.release();
    }
  }
}

export default BaseQuery;

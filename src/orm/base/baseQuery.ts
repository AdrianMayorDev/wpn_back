// import { Pool } from 'mysql2/promise';

// type Fields = Record<string, any>;

// class BaseQuery<T extends Fields> {
//   protected table: string = '';
//   protected fields: Partial<T> = {};
//   protected primaryKey: string = 'id';
//   private connection: Pool;
//   private logger;

//   constructor(connectFn = getConnection) {
//     this.connection = connectFn();
//     this.logger = Logger();
//   }

//   getFields() {
//     return this.fields;
//   }

//   async insert(values: T) {
//     const tableName = this.table;

//     const newPair = this.buildNewPair(values);
//     const insertQuery2 = `INSERT INTO ${tableName} (${Object.keys(newPair).join(', ')}) VALUES (${Object.keys(newPair)
//       .map(() => '?')
//       .join(', ')})`;
//     // this.logger.debug('Generated query', { generatedQuery: insertQuery, keepLevel: true });
//     return await this.connection.query(insertQuery2, Object.values(newPair));
//   }

//   // Lets make sure the developer wants to erase by asking for all fields
//   async delete(values: T) {
//     const tableName = this.table;

//     const newPair = this.buildNewPair(values);
//     const whereTemplate = Object.keys(newPair)
//       .map((field) => `${field} = ${newPair[field]}`)
//       .join(' AND ');
//     const deleteQuery = `DELETE FROM ${tableName} WHERE ${whereTemplate}`;
//     this.logger.debug('Generated query', { generatedQuery: deleteQuery });

//     return await this.connection.query(deleteQuery);
//   }

//   async query<T>(query: string) {
//     return await this.connection.query<ResultSetHeader & T>(query);
//   }

//   async getByPk(pkValue: number | string): Promise<T | undefined> {
//     const [primaryValue] = await this.query<T[]>(
//       `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = ${String(pkValue)}`
//     );

//     return primaryValue[0];
//   }

//   private cleanValue(value: unknown) {
//     return typeof value === 'string' || value === 0 ? `'${value}'` : value;
//   }

//   async getAllByField(field: keyof T, value: string | number, orderBy?: unknown) {
//     const [rows] = await this.query<T[]>(
//       `SELECT * FROM ${this.table} WHERE ${String(field)} = ${this.cleanValue(value)} ${this.getOrderBy(orderBy)}`
//     );

//     return rows;
//   }

//   getOrderBy(_sortBy: unknown) {
//     return '';
//   }

//   async getAll() {
//     const [data] = await this.query<T[]>(`SELECT * FROM ${this.table}`);

//     return data;
//   }

//   private buildNewPair(values: T): Fields {
//     return Object.keys(this.getFields()).reduce((acc, field) => {
//       const value = this.cleanValue(values[field]);

//       if (!value) {
//         throw new Error(`Field ${field} is required in ${this.table} table`);
//       }

//       return {
//         ...acc,
//         [field]: value,
//       };
//     }, {});
//   }

//   async getLastId(): Promise<number> {
//     const [lastId] = await this.query<T[]>(`SELECT MAX(${this.primaryKey}) as id FROM ${this.table}`);

//     return lastId[0].id;
//   }

//   async update(values: T, where: T) {
//     const tableName = this.table;

//     const newPair = this.buildNewPair(values);
//     const wherePair = this.buildNewPair(where);
//     const setTemplate = Object.keys(newPair)
//       .map((field) => `${field} = ${newPair[field]}`)
//       .join(', ');
//     const whereTemplate = Object.keys(wherePair)
//       .map((field) => `${field} = ${wherePair[field]}`)
//       .join(' AND ');
//     const updateQuery = `UPDATE ${tableName} SET ${setTemplate} WHERE ${whereTemplate}`;
//     this.logger.debug('Generated query', { generatedQuery: updateQuery });

//     return await this.connection.query(updateQuery);
//   }

//   async getPaginated(offset: number, limit: number) {
//     const [rows] = await this.query<T[]>(`SELECT * FROM ${this.table} LIMIT ${offset}, ${limit}`);

//     return rows;
//   }
// }

// export default BaseQuery;

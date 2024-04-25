import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  database: "yara-app"
});
pool.on("error", (err, client) => {
  console.error("something bad has happened!", err);
  process.exit(-1);
});

const schema = "public";

const initPool = async () => {
  await pool.connect();
};

const insertTransaction = async (tableName: string, item: unknown) => {
  try {
    const keys = Object.keys(item).join(',');
    const values = `'${Object.values(item).join("','")}'`;

    await pool.query("BEGIN");
    const res = await pool.query(`INSERT INTO ${schema}.${tableName}(${keys}) VALUES(${values}) RETURNING *`);
    await pool.query("COMMIT");

    return res;
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
};

const updateTransaction = async (tableName: string, id: string | number, item: unknown) => {
  try {
    const updateStatement = Object.keys(item).map((key: string) => {
      return `${key} = '${item[key]}'`;
    });

    await pool.query("BEGIN");
    const res = await pool.query(`UPDATE ${schema}.${tableName} SET ${updateStatement} WHERE id = ${id} RETURNING *`);
    await pool.query("COMMIT");

    return res;
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
};

const deleteTransaction = async (tableName: string, id: string | number) => {
  try {
    await pool.query("BEGIN");
    const res = await pool.query(`DELETE FROM ${schema}.${tableName} WHERE id = ${id} RETURNING id`);
    await pool.query("COMMIT");

    return res;
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
};

export { pool as client, schema, initPool as initPGClient, insertTransaction, updateTransaction, deleteTransaction };

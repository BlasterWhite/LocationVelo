import db from "../config/db.js";

// Fields to select from the account table, to avoid selecting all columns (password, etc.)
const fieldsToSelect = [
  "account_id",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "account_role",
  "subscribe",
];

/**
 * Get all accounts
 * @returns {Array} array of accounts
 */
export const getAccounts = async () => {
  const result = await db.query(
    `SELECT ${fieldsToSelect.join(",")} FROM account`
  );
  return result.rows;
};

/**
 * Get a account by its id
 * @param {Number} id id of the account
 * @returns {Object|null} the account object or null if not found
 */
export const getAccountById = async (id) => {
  const result = await db.query(
    `SELECT ${fieldsToSelect.join(",")} FROM account WHERE account_id = $1`,
    [id]
  );
  return result?.rows?.[0] || null; // Return the first row or null if not found
};

/**
 * Create a new account
 * @param {Object} accountData object containing the account data
 * @returns {Object} the created account
 */
export const createAccount = async (accountData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    account_role,
    subscribe,
    hashedPassword,
  } = accountData;

  const result = await db.query(
    `INSERT INTO account (
            first_name, last_name, email, phone, address, 
            account_role, subscribe, hashed_password
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING ${fieldsToSelect.join(",")}`,
    [
      first_name,
      last_name,
      email,
      phone,
      address,
      account_role,
      subscribe,
      hashedPassword,
    ]
  );
  return result.rows[0];
};

/**
 *  Update an account by its id (Merge with existing data)
 * @param {Number} id id of the account to update
 * @param {Object} accountData object containing the updated account data
 * @returns {Object} the updated account
 */
export const updateAccount = async (id, accountData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    account_role,
    subscribe,
  } = accountData;

  const result = await db.query(
    `UPDATE account SET 
                first_name = $1,
                last_name = $2,
                email = $3,
                phone = $4,
                address = $5,
                account_role = $6,
                subscribe = $7
            WHERE account_id = $8
            RETURNING ${fieldsToSelect.join(",")}`,
    [first_name, last_name, email, phone, address, account_role, subscribe, id]
  );
  return result.rows[0];
};

/**
 * Delete an account by its id
 * @param {Number} id id of the account to delete
 * @returns {Boolean} true if deleted, false if not found
 */
export const deleteAccount = async (id) => {
  const result = await db.query(
    `DELETE FROM account WHERE account_id = $1 RETURNING ${fieldsToSelect.join(",")}`,
    [id]
  );
  return result.rowCount > 0; // Return true if at least one row was deleted
};

/**
 * Get an account by its email
 * @param {String} email email of the account
 * @returns {Object|null} the account object or null if not found
 */
export const getAccountByEmail = async (email) => {
  const result = await db.query(
    `SELECT ${fieldsToSelect.join(",")} FROM account WHERE email = $1`,
    [email]
  );
  return result?.rows?.[0] || null; // Return the first row or null if not found
};

/**
 * Private function to get an account by its email
 * @param {String} email email of the account
 * @returns {Object|null} the account object or null if not found
 */
export const _getAccountByEmailPrivate = async (email) => {
  const result = await db.query(`SELECT * FROM account WHERE email = $1`, [
    email,
  ]);
  return result?.rows?.[0] || null; // Return the first row or null if not found
};

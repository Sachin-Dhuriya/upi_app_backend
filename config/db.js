import knex from "knex";
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

const knexConfig = require('../knexfile.cjs') 

const db = knex(knexConfig.development)

export default db;
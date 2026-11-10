import { resolve } from 'node:path';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import type { Database } from 'emdash';
import { loadLocalConfig } from './local-config.mjs';
import { backupLocal } from './local-backup.mjs';
import { installServicePages } from '../src/cms/service-import';

const [flag,destination,...extra]=process.argv.slice(2);
if(flag!=='--backup'||!destination||extra.length)throw new Error('Stop the application, then run: npm run cms:services -- --backup NEW_SNAPSHOT_DIR');
process.umask(0o077);
const config=loadLocalConfig();
await backupLocal({...config,destination:resolve(destination)});
console.log(`Pre-import backup: ${resolve(destination)}`);
const db=new Kysely<Database>({dialect:createDialect({url:`file:${config.database}`})});
try{console.log(await installServicePages(db,{publishNew:true}));}finally{await db.destroy();}

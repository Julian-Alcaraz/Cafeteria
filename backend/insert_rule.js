import pg from 'pg';
const { Client } = pg;

async function run() {
  const client = new Client('postgresql://admin:adminpassword@localhost:5432/cafeteria_dev?schema=public');
  await client.connect();
  try {
    await client.query(`
      INSERT INTO menus (label, url, parent_id, permission_id, deshabilitado) 
      VALUES ('Reglas Auditoría', '/app/configuraciones/auditoria-config', 1, 1, false) 
      ON CONFLICT DO NOTHING
    `);
    console.log('Inserted menu');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();

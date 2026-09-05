import fs from 'fs';
import path from 'path';

function fixRelations(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixRelations(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/relations:\s*\['permissions'\]/g, "relations: { permissions: true }");
      content = content.replace(/relations:\s*\['requiredPermission'\]/g, "relations: { requiredPermission: true }");
      content = content.replace(/relations:\s*\['children',\s*'requiredPermission',\s*'parent'\]/g, "relations: { children: true, requiredPermission: true, parent: true }");
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixRelations(path.join(process.cwd(), 'src/modules'));
console.log('Fixed relations');

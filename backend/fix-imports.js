import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix imports missing .js
      content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
        if (p1.endsWith('.js') || p1.endsWith('.ts')) return match;
        return `from '${p1}.js'`;
      });
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixImports(path.join(process.cwd(), 'src/modules/users'));
fixImports(path.join(process.cwd(), 'src/modules/menus'));
fixImports(path.join(process.cwd(), 'src/modules/permissions'));

console.log('Fixed imports');

const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Eliminar comentarios JSX: {/* ... */}
      content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
      
      // Eliminar comentarios multilínea: /* ... */
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Eliminar comentarios de una línea, ignorando los de URLs (http://)
      content = content.replace(/(?<!:)\/\/.*$/gm, '');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Comentarios eliminados con éxito.');

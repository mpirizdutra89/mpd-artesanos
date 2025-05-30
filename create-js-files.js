#!/usr/bin/env node

/**
 * Script de línea de comandos para crear archivos JavaScript (.js)
 * en un directorio específico a partir de una lista de nombres.
 *
 * Uso:
 * node create-js-files.js <nombres-separados-por-comas> [directorio-destino]
 *
 * Ejemplo:
 * node create-js-files.js modulo1,modulo2,utilidades
 * node create-js-files.js componenteA,componenteB ./src/components
 */

const fs = require('fs');
const path = require('path');

// Contenido base para los archivos .js
const baseFileContent = (name) => `
/**
 * Módulo: ${name}.js
 * Descripción: Este es un módulo JavaScript generado automáticamente.
 */

// Ejemplo de función exportada
export function init${capitalizeFirstLetter(name)}() {
  console.log('Inicializando ${name}...');
  // Agrega tu lógica aquí
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Puedes exportar otras funciones o variables aquí
// export const ${name}Constant = 'valor';
`;

/**
 * Capitaliza la primera letra de una cadena.
 * @param {string} string - La cadena a capitalizar.
 * @returns {string} La cadena con la primera letra capitalizada.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Función principal para ejecutar la lógica de creación de archivos.
 */
function main() {
  // Obtener los argumentos de la línea de comandos
  // process.argv[0] es 'node'
  // process.argv[1] es la ruta al script 'create-js-files.js'
  // process.argv[2] es el primer argumento (nombres)
  // process.argv[3] es el segundo argumento (directorio destino opcional)
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Uso: node create-js-files.js <nombres-separados-por-comas> [directorio-destino]');
    console.log('Ejemplo: node create-js-files.js modulo1,modulo2,utilidades');
    console.log('Ejemplo: node create-js-files.js componenteA,componenteB ./src/components');
    return;
  }

  const namesInput = args[0];
  const targetDirectory = args[1] || './'; // Por defecto, el directorio actual

  const names = namesInput.split(',').map(name => name.trim()).filter(name => name.length > 0);

  if (names.length === 0) {
    console.error('Error: No se proporcionaron nombres válidos.');
    console.log('Uso: node create-js-files.js <nombres-separados-por-comas> [directorio-destino]');
    return;
  }

  // Crear el directorio de destino si no existe
  try {
    fs.mkdirSync(targetDirectory, { recursive: true });
    console.log(`Directorio de destino: '${targetDirectory}' (creado si no existía).`);
  } catch (error) {
    console.error(`Error al crear el directorio '${targetDirectory}':`, error.message);
    return;
  }

  // Crear cada archivo .js
  names.forEach(name => {
    const fileName = `${name}.js`;
    const filePath = path.join(targetDirectory, fileName);
    const content = baseFileContent(name);

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(`Error al crear '${filePath}':`, err.message);
      } else {
        console.log(`Archivo '${filePath}' creado exitosamente.`);
      }
    });
  });
}

// Ejecutar la función principal
main();
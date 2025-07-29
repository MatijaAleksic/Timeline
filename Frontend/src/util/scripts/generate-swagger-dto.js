import os from "os";
import path from "path";
import cp from "child_process";
import fs from "fs-extra";
import axios from "axios";

(async () => {
  // Hardcoded swagger URL and output folder
  const swaggerUrl = "http://localhost:5015/swagger/v1/swagger.json";
  const tempDir = path.join(os.tmpdir(), "my-swagger-codegen");
  const swaggerFile = path.join(tempDir, "swagger.json");
  const outputDir = path.resolve("./src/api/DTO");
  const indexFilePath = path.join(outputDir, "index.ts");

  // 🧼 Clean out old files to prevent stale DTOs
  await fs.remove(tempDir);           // Remove temp swagger + generated files
  await fs.emptyDir(outputDir);       // Remove previously generated DTO files

  // Recreate the necessary directories
  await fs.ensureDir(outputDir);
  await fs.ensureDir(tempDir); // Not strictly necessary but safe

  console.log(`Fetching Swagger spec from ${swaggerUrl}...`);
  const json = (await axios.get(swaggerUrl)).data;

  // Optional: process allOf schemas if needed (keep or remove if not relevant)
  for (const type in json.components?.schemas || {}) {
    if ("allOf" in json.components.schemas[type]) {
      const { allOf } = json.components.schemas[type];

      if ("properties" in json.components.schemas[type]) {
        const { properties } = json.components.schemas[type];
        allOf.push({
          required: json.components.schemas[type].required,
          type: json.components.schemas[type].type,
          properties,
        });
      }

      allOf.forEach((schema, index) => {
        if (!("$ref" in schema)) {
          const additionalTypeName = `${type}Additional`;
          json.components.schemas[additionalTypeName] = schema;
          json.components.schemas[type].allOf[index] = {
            $ref: `#/components/schemas/${additionalTypeName}`,
          };
        }
      });
    }
  }

  // Save patched swagger JSON locally for generator input
  await fs.outputFile(swaggerFile, JSON.stringify(json, null, 2));

  // Output temp folder for openapi-generator output
  const clientDir = path.join(tempDir, "openapi-generated");

  console.log("Generating TypeScript DTOs with openapi-generator-cli...");


  //If you want to see logs from libary use this execSync instead of down configured one
  //=============================================================================================
  // cp.execSync(
  //   `npx openapi-generator-cli generate -i ${swaggerFile} -g typescript-fetch -o ${clientDir} --skip-validate-spec`,
  //   { stdio: "inherit" }
  // );
  //=============================================================================================
  const isWin = process.platform === "win32";
  const nullDevice = isWin ? "NUL" : "/dev/null";
  cp.execSync(
    `npx openapi-generator-cli generate -i ${swaggerFile} -g typescript-fetch -o ${clientDir} --skip-validate-spec > ${nullDevice} 2>&1`
  );
  //=============================================================================================



  console.log("Copying generated models (DTOs) to your DTO folder...");
  // <-- Fix here: copy from 'models' (plural) folder, not 'model'
  await fs.copy(path.join(clientDir, "models"), outputDir, { overwrite: true });


  // Delete all.ts and ObjectSerializer.ts if exists
  const allTsFile = path.join(outputDir, "all.ts");
  const objectSerializer = path.join(outputDir, "ObjectSerializer.ts");
  if (await fs.pathExists(allTsFile)) {
    await fs.remove(allTsFile);
  }
  if (await fs.pathExists(objectSerializer)) {
    await fs.remove(objectSerializer);
  }
  
  // Generate an index.ts file exporting all DTOs
  const dtoFiles = await fs.readdir(outputDir);
  const tsFiles = dtoFiles.filter(
    (f) => f.endsWith(".ts") && !fs.statSync(path.join(outputDir, f)).isDirectory()
  );

  for (const file of tsFiles) {
    const filePath = path.join(outputDir, file);
    let content = await fs.readFile(filePath, "utf-8");

    // Remove unused imports including ToJSONTyped, FromJSONTyped, etc.
    content = content.replace(/^import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?/gm, (importStatement) => {
      // Extract the imported items from the import statement
      const matches = importStatement.match(/import\s+{([^}]+)}/);
      if (!matches) return importStatement;

      const importedItems = matches[1]
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

      // Filter out unused imports
      const usedItems = importedItems.filter(name => {
        // RegExp to detect usage in the rest of the file (excluding the import line itself)
        const usageRegex = new RegExp(`\\b${name}\\b`, 'g');
        const fileWithoutImport = content.replace(importStatement, '');
        return usageRegex.test(fileWithoutImport);
      });

      if (usedItems.length === 0) {
        return ''; // Remove the entire import line
      }

      // Rebuild the cleaned import statement
      const moduleMatch = importStatement.match(/from\s+(['"][^'"]+['"])/);
      const modulePath = moduleMatch ? moduleMatch[1] : '';
      return `import { ${usedItems.join(', ')} } from ${modulePath};`;
    });
    // Remove all top consecutive block comments (like tslint:disable, eslint-disable, and JSDoc)
    content = content.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/m, "");

    await fs.writeFile(filePath, content);
  }

  let indexContent = "// Auto-generated DTO exports\n\n";
  tsFiles.forEach((file) => {
    indexContent += `export * from './${file.replace(".ts", "")}';\n`;
  });
  await fs.outputFile(indexFilePath, indexContent);

  console.log("DTO generation complete!");
})();

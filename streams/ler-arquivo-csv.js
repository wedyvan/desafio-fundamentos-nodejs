import fs from "fs";
import { parse } from "csv-parse";
import fetch from 'node-fetch';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("🚀 ~ file: ler-arquivo-csv.js:7 ~ __dirname:", __dirname);

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/listaTarefas.csv`).pipe(
    parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

// Percorrendo a lista criada na leitura do arquivo CSV
(async () => {
  const records = await processFile();
  const dataBody = {"title" :"", "description": ""}
  // Percorrendo a lista e pulando a primeira linha do arquivo CSV, após isso realizando um requisição POST para a API de criar tarefas.
  for (let idx = 0; idx < records.length; idx++) {
    if (idx > 0) {
        dataBody.title = records[idx][0]
        dataBody.description = records[idx][1]

      fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(dataBody)
      })
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          console.log(data);
        });
    }
  }
})();

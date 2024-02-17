import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// grab env files
dotenv.config();

const OUTPUT_FOLDER_PATH = path.join(__dirname, "./output");
const COMPANIES = ["Facebook", "Google", "Netflix", "Twitter"];

const openai = new OpenAI();

function generateTemplate(companyName) {
  return `Write a poem about the company ${companyName}. Make it funny as hell.`;
}

async function main() {
  // Create images directory if not exists
  if (!existsSync(OUTPUT_FOLDER_PATH)) {
    mkdirSync(OUTPUT_FOLDER_PATH);
  }

  // Run queries concurrently
  await Promise.all(
    COMPANIES.map(async (companyName) => {
      // Generate with OpenAI API
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: generateTemplate(companyName) }],
        model: "gpt-3.5-turbo",
      });

      const responseText = completion.choices[0].message.content;

      console.log(`[SUCCESS] Generated for ${companyName}:`);
      // Extra \n at the end
      console.log(responseText + "\n");

      // Write to file
      await writeFile(
        // Replace spaces with _
        // e.g. "My Company" => "My_Company.txt"
        path.join(OUTPUT_FOLDER_PATH, `${companyName.replace(/ /g, "_")}.txt`),
        responseText
      );
    })
  );

  // Ending message bc we're done
  console.log("\n\n[DONE]");
}

main();

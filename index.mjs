import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const COMPANIES = ["Facebook", "Google", "Netflix", "Twitter"];

const openai = new OpenAI();

function generateTemplate(companyName) {
  return `Write a poem about the company ${companyName}. Make it funny as hell.`;
}

function main() {
  Promise.all(
    COMPANIES.map(async (company) => {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: generateTemplate(company) }],
        model: "gpt-3.5-turbo",
      });

      console.log(`Poem for ${company}:`);
      // Extra \n at the end
      console.log(completion.choices[0].message.content + "\n");
    })
  );
}

main();

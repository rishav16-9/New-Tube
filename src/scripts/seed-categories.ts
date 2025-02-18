import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLocaleLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    await Promise.all(
      categoryNames.map((name) =>
        db
          .update(categories)
          .set({
            description: `Videos related to ${name.toLocaleLowerCase()}`,
          })
          .where(eq(categories.name, name))
      )
    );
    process.exit(1);
  } catch (error) {
    console.log("sedding error: ", error);
  }
}

main();

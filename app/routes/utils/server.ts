import forge from "forge/client";

export async function getResource(resource1: string, resource2: string) {
  try {
    const res = await forge.craft.query(
      `What do you get when you combine ${resource1} and ${resource2}?`
      //updates cache
      //   {
      //     cache: "Bust",
      //   }
    );

    return res;
  } catch (error) {
    console.error("Error querying Forge:", error);
    throw new Error("Error processing the image");
  }
}

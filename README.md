# Infinite Craft built with Forge

## What is Infinite Craft?

Infinite Craft is a unique sandbox game that allows players to explore, create, and manipulate an endless world. The complexity of building such a game lies in the need for dynamic world generation, real-time interactions, and a robust system to manage resources and player actions. This requires careful planning and implementation of various game mechanics, making it a challenging yet rewarding project.

## Why Use Forge?

Forge is a powerful AI dev tool that allows a developer to get structured data from an LLM. In this case, we use forge to generate a resource from two other resources. This is done in the `app/routes/utils/server.ts` file:

```typescript
export async function getResource(resource1: string, resource2: string) {
  const res = await forge.craft.query(
    `What do you get when you combine ${resource1} and ${resource2}?`
  );
  return res;
}
```

Just like that our entire backend is generated from a single function. Traditionally this would be an tedious process where a server would have to reach out to a database and find a valid combination of resources, but with forge we can do it in a single line of code.

When making Infinite craft you would normally stored created resources into a database to speed up the process of finding valid combinations. However, since forge allows for caching it'll take care of this step for us. This means if one user combines earth and fire to make magma the next user who combines fire and eartch will hit the cached response magma and won't have to wait for the LLM to generate a response.

## Getting Started

To check out the project for yourself, you can clone the repository and run the following commands:

```bash
npm i
npm run dev
```

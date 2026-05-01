export function getTechIcon(tech: string): string | undefined {
    if (!tech) return undefined;

    const normalized = tech.toLowerCase().trim();

    // Mapping of common names to folder filenames
    const mapping: Record<string, string> = {
        "next.js": "Next.js.png",
        "nextjs": "Next.js.png",
        "react": "React.png",
        "typescript": "TypeScript.png",
        "ts": "TypeScript.png",
        "tailwind css": "Tailwind-CSS.png",
        "tailwind": "Tailwind-CSS.png",
        "node.js": "Node.js.png",
        "nodejs": "Node.js.png",
        "postgresql": "PostgresSQL.png",
        "postgres": "PostgresSQL.png",
        "python": "Python.png",
        "scikit-learn": "scikit-learn.png",
        "openai api": "OpenAPI.png",
        "openai": "OpenAPI.png",
        "vercel": "Vercel.png",
        "git": "Git.png",
        "aws": "AWS.png",
        "firebase": "Firebase.png",
        "react native": "React.png",
        "mongodb": "MongoDB.png",
        "express": "Express.png",
        "docker": "Docker.png",
        "graphql": "GraphQL.png",
        "figma": "Figma.png",
        "numpy": "NumPy.png",
        "pandas": "Pandas.png",
        "prisma": "Prisma.png",
        "expo": "Expo.png"
    };

    const fileName = mapping[normalized];
    if (fileName) {
        return `/tech-stack/${fileName}`;
    }

    return undefined;
}

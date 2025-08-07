# Optimeleon

## Prerequisites

- Ensure you have docker installed and running on your machine. (Confirm by running `docker ps` without errors)  
The script [`setup_docker.sh`](scripts/bash/setup_docker.sh) in scripts/bash directory can help you set up docker if it's not already installed. (Experimental)
- Ensure you have node.js installed on your machine. (Confirm by running `node -v` without errors)
Along with node.js, you will also need corepack enabled & pnpm installed
  - To enable corepack, run `corepack enable`
  - To install pnpm, run `corepack prepare pnpm@latest --activate`  


## Setup

- clone the repository
- Install dependencies
- Start the development server 

Easy Peasy:

```bash
git clone https://github.com/theGobindSingh/optimeleon
cd optimeleon
pnpm install
pnpm dev
```

That's it! You can now access the dashboard at `http://localhost:3000` in your web browser. Also, the prisma studio is available at `http://localhost:5555` for database management.
Although, backend is available at `http://localhost:6969` but you don't need to (moreover you can't easily) access it directly as the frontend will handle all the API calls (as it is authenticated).
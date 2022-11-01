# How to execute the project

- First, you need to install the dependencies with `npm install`
- Then, you need to run the database with `docker-comopse up -d`
- After that, you need to run the migrations with `npx prisma migrate dev --name init`
- Finally, you can run the project with `npm run dev`
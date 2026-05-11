FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Using tsx to run TypeScript directly in production for simplicity, 
# or you can add a build step if preferred.
CMD ["npm", "start"]

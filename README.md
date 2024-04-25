# Yara Code Challenge - Product Warehouse

Three-layered application for completing the code chalenge of Product stock management & Warehouse management application.

Build as a monorepo for easier management of each stand-alone layer/service.

Tech stack used:

- Typescript
- Node.js
- React
- GrapthQL - Apollo Server & Client
- PostgreSQL

## 1. API (Node.js + Express + PostgreSQL)

Folder: `api`

Small API server for endpoints and request to the database (PostgreSQL) - basic validations, grouping, etc.

- Start command: `npm start`
- Default port: `3000`

## 2. Apollo Server (GraphQL)

Folder: `server`

All of the GraphQL configuration - resolvers, schema, filters, inputs, etc.

- Start command: `npm start`
- Default port: `4000`

## 2. Client (Vite + React + Typescript + Apollo Client + TailwindCSS)

Folder: `client`

Front-end UI components for user presentation & interaction - layouts, components, tables, forms, etc.

- Start command: `npm start`
- Default port: `5173`

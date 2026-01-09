# AI Learning Platform

This is a MERN stack application with AI capabilities for learning.

## Project Structure

- **server/**: Node.js Express backend
- **client/**: React Vite frontend

## Setup Instructions

### 1. Start Backend

```bash
cd server
npm install
npm start
```
Runs on http://localhost:5000

Note: The `.env` file is pre-configured with the keys from the implementation plan.

### 2. Start Frontend

```bash
cd client
npm install --legacy-peer-deps
npm run dev
```
Runs on http://localhost:5173

## Features

- **Reference**: Generates academic references using Gemini.
- **Animated Video**: Generates Manim Python scripts for animations.
- **Audio Explanation**: Generates audio using ElevenLabs.
- **Mind Map**: Visualizes topics as mind maps using React Flow.

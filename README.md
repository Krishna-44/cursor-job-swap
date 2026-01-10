# Job Swap - AI-Powered Job Exchange Platform

A modern web application that helps employees find perfect job swap matches to reduce commute time and improve work-life balance.

## Features

- 🔐 **Secure Authentication** - Login with LinkedIn, Google, Email, or Demo mode
- 🎯 **AI-Powered Matching** - Intelligent matching based on skills, location, and compatibility
- 📍 **Location-Based Matching** - Find swaps that significantly reduce commute time
- 📄 **Resume Parsing** - Automatic skill extraction from uploaded resumes
- 👥 **Peer-to-Peer Requests** - Send and receive swap requests
- 🏢 **HR Portal** - Complete HR workflow for approving swaps
- 📊 **Dashboard Analytics** - Track time saved, cost savings, and environmental impact

## Project Structure

- `/src/pages` - Main application pages (Landing, Login, Dashboard, etc.)
- `/src/components/ui` - Reusable UI components (shadcn/ui)
- `/src/state` - Global state management with React Context
- `/src/mock` - Mock data for development
- `/src/hooks` - Custom React hooks

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
npm run build
npm run preview
```

## How can I edit this code?

There are several ways of editing your application.

**Use Krishna**

Simply visit the [Krishna Project](https://krishna.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Krishna will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Krishna.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Krishna](https://krishna.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Krishna project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.krishna.dev/features/custom-domain#custom-domain)

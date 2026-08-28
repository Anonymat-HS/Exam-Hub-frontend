# Exam Hub Frontend

Frontend application for Exam Hub built with React 19, Vite 8, and TailwindCSS 4.

## Prerequisites

- **Node.js 24.x** (LTS recommended)
- **npm 10.x** or **yarn 4.x** or **pnpm 9.x**

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Exam-Hub-frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Development

```bash
# Start development server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

## Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

## Tech Stack

- **React 19** - UI library
- **Vite 8** - Build tool & dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── assets/        # Static assets
├── App.jsx        # Root component
└── main.jsx       # Entry point
```

## Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000/api
```

## Linting

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private project - All rights reserved.
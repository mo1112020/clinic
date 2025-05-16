# Pet Manager Clinic Application

A modern, full-stack web application for managing veterinary clinics, built with React, TypeScript, and Supabase.

## Features

- 🐾 **Animal Management**

  - Track patient information
  - Manage medical history
  - Document handling
  - Owner information management

- 💉 **Vaccination Management**

  - Schedule vaccinations
  - Track vaccination history
  - Set up vaccination reminders
  - Generate vaccination reports

- 📦 **Inventory Management**

  - Track medical supplies
  - Manage stock levels
  - Generate inventory reports
  - Low stock alerts

- 🔐 **Authentication & Authorization**

  - Secure login system
  - Role-based access control
  - Protected routes

- 🌐 **Multi-language Support**
  - Language switching capability
  - Internationalization ready

## Tech Stack

- **Frontend:**

  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn UI Components
  - React Router DOM
  - React Query
  - React Hook Form
  - Zod (Schema Validation)

- **Backend:**
  - Supabase
  - PostgreSQL Database

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mo1112020/clinic.git
   cd clinic
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```


3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/         # React components
│   ├── animal-details/ # Animal management components
│   ├── animals/        # Animal list and form components
│   ├── auth/          # Authentication components
│   ├── inventory/     # Inventory management components
│   ├── layout/        # Layout components
│   ├── ui/            # Reusable UI components
│   └── vaccinations/  # Vaccination management components
├── contexts/          # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.



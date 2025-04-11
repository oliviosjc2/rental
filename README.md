# EquipRent - Construction Equipment Rental Management System

EquipRent is a comprehensive web application for managing civil construction equipment rentals. It provides a complete solution for tracking customers, equipment inventory, maintenance schedules, and rental operations.

![EquipRent Dashboard](https://github.com/your-repo/equiprent/raw/main/screenshots/dashboard.png)

## Features

### Customer Management
- Company profiles with contact details
- Multiple contacts per customer
- Activity history and relationship tracking

### Equipment Inventory
- Comprehensive equipment catalog
- Brand and category organization
- Serial number and specification tracking
- Availability status monitoring

### Maintenance Tracking
- Scheduled maintenance planning
- Maintenance history logging
- Alert system for upcoming maintenance
- Service record documentation

### Rental Operations
- Equipment checkout and return processing
- Rental agreement generation
- Overdue tracking and notifications
- Rental history and analytics

### Reporting & Analytics
- Equipment utilization reports
- Customer activity analysis
- Financial performance metrics
- Maintenance effectiveness tracking

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Database**: In-memory storage (can be connected to PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/equiprent.git
   cd equiprent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
equiprent/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
│   └── index.html        # HTML entry point
├── server/               # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite server configuration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Data schemas and types
└── package.json          # Project configuration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All equipment and customer data provided is fictional and for demonstration purposes only.
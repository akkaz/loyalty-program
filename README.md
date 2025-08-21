# Hotel Loyalty Program Dashboard

A comprehensive hotel loyalty program management dashboard built with modern web technologies. This application enables hotel staff to manage customer loyalty programs, track guest stays, handle consent management, and provide a seamless dashboard experience.

## 🏨 Features

### Customer Management
- **Guest Profiles**: Complete customer information management
- **Loyalty Tracking**: Monitor guest stays and loyalty program status
- **Search & Filter**: Quick customer lookup by email and other criteria

### Dashboard & Analytics
- **Interactive Calendar**: Visual representation of bookings and stays
- **Policy Management**: Handle privacy policies and consent tracking
- **Real-time Data**: Live updates on customer activities and stays

### Authentication & Security
- **Secure Login**: Protected dashboard access for hotel staff
- **Session Management**: Secure authentication flow
- **Role-based Access**: Controlled access to sensitive customer data

### Consent & Privacy
- **GDPR Compliance**: Track and manage customer consent preferences
- **Privacy Policy**: Integrated policy management system
- **Data Protection**: Secure handling of customer personal information

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety and better development experience
- **Supabase** - Backend-as-a-Service for database and authentication
- **shadcn/ui** - Modern, accessible UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Low-level accessible component primitives

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── customers/    # Customer management API
│   │   ├── stays/        # Guest stays tracking API
│   │   └── consents/     # Consent management API
│   ├── dashboard/        # Main dashboard pages
│   │   ├── calendar/     # Calendar view for bookings
│   │   └── policy/       # Privacy policy management
│   └── login/            # Authentication pages
├── components/ui/        # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts      # Database client configuration
│   └── utils.ts         # Common utility functions
└── hooks/               # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/akkaz/loyalty-program.git
   cd loyalty-program
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🔐 Authentication

The application uses a secure authentication system:
- Staff login required to access the dashboard
- Session-based authentication
- Protected routes for sensitive operations

## 📊 API Endpoints

### Customers
- `GET /api/customers` - Retrieve customer information
- Query parameters: `email` for customer lookup

### Stays
- `GET /api/stays` - Get customer stay history
- Query parameters: `customer_id` for filtering stays

### Consents
- `GET /api/consents` - Manage customer consent preferences
- Handle GDPR compliance and privacy settings

### Authentication
- `POST /api/auth/login` - Staff authentication endpoint

## 🗄️ Database Schema

The application uses Supabase with the following main entities:
- **Customers**: Guest profiles and contact information
- **Stays**: Hotel stay records and booking history  
- **Consents**: Privacy preferences and GDPR compliance data
- **Users**: Staff authentication and role management

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible design:
- Modern card-based layouts
- Interactive calendars for booking visualization
- Responsive tables for data management
- Form components with validation
- Modal dialogs for detailed actions

## 📱 Responsive Design

- Mobile-first approach
- Optimized for tablet and desktop use
- Accessible interface following WCAG guidelines
- Dark mode support

## 🔧 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup
Make sure to configure your Supabase project with the appropriate tables and RLS policies for secure data access.

## 📄 License

This project is proprietary software for hotel loyalty program management.

## 🤝 Contributing

This is a private hotel management system. Contact the development team for contribution guidelines.

---

Built with ❤️ for modern hotel loyalty program management
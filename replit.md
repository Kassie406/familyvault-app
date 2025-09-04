# Overview

FamilyVault is a React-based web application designed to help families organize, secure, and manage their important documents and household information. The application features a marketing landing page with sections for hero content, feature demonstrations, security information, testimonials, and frequently asked questions. It's built as a full-stack application with a React frontend, Express backend, and PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

## Current Project Phase (January 29, 2025)
- **Share Link Generation**: ✓ Completed - Fixed stuck "Generating..." button with robust timeout handling
- **Database Integration**: ✓ Completed - Real API endpoints with database persistence for share links
- **Error Handling**: ✓ Completed - Safe abort controller logic prevents double-abort errors
- **UI Improvements**: ✓ Completed - Spinner animation and proper retry functionality
- **Child Information Redesign**: ✓ Completed - Upgraded to luxury dark theme with professional section cards, always-visible add menu, search functionality, and consistent routing structure matching the polished experience of Passwords, Family IDs, and Business modules
- **Elderly Parents Redesign**: ✓ Completed - Upgraded to luxury dark theme with 6 professional care category sections, always-visible add menu, search functionality, and full routing setup for comprehensive elder care management
- **Getting Married Redesign**: ✓ Completed - Upgraded to luxury dark theme with 6 professional wedding planning category sections, always-visible add menu, search functionality, and full routing setup for comprehensive wedding planning management

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS for utility-first styling with shadcn/ui component library
- **UI Components**: Comprehensive component system using Radix UI primitives for accessibility
- **Routing**: Client-side routing with Wouter for lightweight navigation
- **State Management**: TanStack Query (React Query) for server state management
- **Design System**: Custom design tokens and CSS variables for consistent theming

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Build System**: ESBuild for production bundling

## Development Environment
- **Hot Reload**: Vite development server with HMR support
- **Build Process**: Separate client and server build pipelines
- **TypeScript**: Shared type definitions between client and server
- **Code Organization**: Monorepo structure with shared schema definitions

## Database Schema
- **User Management**: Basic user table with username/password authentication
- **Schema Validation**: Zod integration with Drizzle for runtime type checking
- **Migrations**: Drizzle Kit for database schema migrations

## Component Architecture
- **Landing Page Sections**: Modular components for hero, features, testimonials, FAQ, security
- **Reusable UI**: shadcn/ui components for consistent interface elements
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Interactive Elements**: Accordion FAQ, mobile navigation, hover effects

# External Dependencies

## Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Connection**: Environment-based DATABASE_URL configuration

## UI Framework
- **Radix UI**: Comprehensive set of accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **PostCSS**: CSS processing with Autoprefixer

## Third-Party Services
- **Replit Integration**: Development environment optimizations and error overlay
- **Google Fonts**: Inter font family for typography
- **Unsplash**: Image placeholders for demonstration content

## Authentication & Security
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Password Handling**: Prepared for secure authentication implementation
- **Environment Variables**: Secure configuration management

## Build & Deployment
- **Production Build**: Optimized client bundle with static asset generation
- **Server Bundle**: ESBuild compilation for Node.js deployment
- **Asset Management**: Vite-based asset optimization and bundling
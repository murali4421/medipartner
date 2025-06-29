# MedSupply Pro - Medicine Supply Chain Management System

## Overview

MedSupply Pro is a comprehensive medicine supply chain management system designed to streamline the procurement process between hospitals and suppliers. The application provides separate portals for hospitals to manage their inventory and place orders, and for suppliers to manage their catalog and fulfill orders.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Real-time Communication**: WebSocket server for live updates
- **Session Management**: Express sessions with PostgreSQL storage

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Authentication System
- **Dual Portal Authentication**: Separate login systems for hospitals and suppliers
- **Password Security**: bcrypt for password hashing
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Role-based Access**: Different user roles within each portal (admin, procurement_manager, pharmacist, etc.)

### Hospital Portal Features
- **Dashboard**: Overview of inventory, orders, and key metrics
- **Inventory Management**: Track medicine stock levels with low-stock alerts
- **Order Creation**: Submit requests for quotations and purchase orders
- **Supplier Management**: Maintain relationships with approved suppliers
- **Quotation Management**: Review and compare supplier quotations

### Supplier Portal Features
- **Medicine Catalog**: Manage available medicines with pricing
- **Quotation Responses**: Respond to hospital requests for quotations
- **Order Fulfillment**: Process and track purchase orders
- **Hospital Relationships**: Manage business relationships with hospitals
- **Inventory Management**: Track supplier stock levels

### Real-time Features
- **WebSocket Integration**: Live updates for order status, inventory changes
- **Notification System**: Real-time alerts for low stock, new orders, etc.
- **Connection Management**: Automatic reconnection with exponential backoff

## Data Flow

### Order Processing Flow
1. Hospital creates order request with required medicines
2. System broadcasts request to relevant suppliers via WebSocket
3. Suppliers receive notifications and can submit quotations
4. Hospital reviews quotations and selects preferred supplier
5. Purchase order is generated and sent to supplier
6. Supplier confirms order and updates delivery status
7. Hospital receives delivery confirmation and updates inventory

### Inventory Management Flow
1. Hospitals maintain minimum stock levels for each medicine
2. System monitors inventory levels and generates low-stock alerts
3. Automated reorder suggestions based on usage patterns
4. Integration with order system for seamless procurement

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: react, react-dom, @tanstack/react-query
- **UI Components**: @radix-ui/* components, shadcn/ui
- **Routing**: wouter for lightweight routing
- **Styling**: tailwindcss, class-variance-authority, clsx
- **Form Handling**: react-hook-form, @hookform/resolvers

### Backend Dependencies
- **Server Framework**: express, ws (WebSocket)
- **Database**: @neondatabase/serverless, drizzle-orm
- **Authentication**: bcrypt, connect-pg-simple
- **Development**: tsx, esbuild, typescript

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Replit Integration**: Runtime error overlay and cartographer for development

## Deployment Strategy

### Production Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend builds to `dist` using esbuild with ESM format
3. Static assets served by Express in production
4. Database migrations applied via Drizzle Kit

### Environment Configuration
- **Development**: Vite dev server with HMR, tsx for backend
- **Production**: Express serves static files, compiled backend
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Scaling Considerations
- **Database**: Neon serverless PostgreSQL with connection pooling
- **WebSocket**: Single server instance, can be scaled with Redis adapter
- **Static Assets**: Served by Express, can be moved to CDN

## Changelog

- June 29, 2025. Fixed quotation acceptance functionality with proper date handling in purchase order creation, eliminating toISOString errors and ensuring seamless order-to-quotation-to-purchase order workflow completion
- June 29, 2025. Complete order-to-quotation workflow implementation with hospital order creation, supplier quotation management, accept/reject/ignore functionality, and real-time WebSocket notifications
- June 29, 2025. Supplier medicine availability display in hospital portal with stock levels, pricing, and supplier details
- June 29, 2025. Settlement management system with payment tracking, multiple payment methods, and comprehensive settlement records
- June 29, 2025. Complete mobile responsiveness implementation with collapsible sidebars, responsive grid layouts, mobile-optimized navigation, and touch-friendly interface elements
- June 29, 2025. Major UI optimization with modern design system, gradient backgrounds, enhanced animations, and improved visual hierarchy
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
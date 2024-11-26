# Canva Clone: A Feature-Rich Graphic Design SaaS Platform

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Usage](#usage)
7. [Roadmap](#roadmap)

## Overview

The Canva Clone is a graphic design SaaS platform inspired by Canva, offering an intuitive and interactive editor for creating stunning designs. Built with **Next.js** and **TypeScript**, this project leverages modern web technologies to deliver a seamless user experience. It features robust design tools, authentication, billing, and integrations with external APIs for enhanced functionality.

## Features

- **Intuitive Editor**: User-friendly interface with drag-and-drop capabilities
- **Authentication**: Secure user accounts powered by **Next-Auth v5 (Auth.js)**
- **Subscription Management**: Stripe integration for payments and billing
- **Design Tools**:
  - Background manipulation
  - Image uploads and layering
  - Object resizing, rotation, and grouping
- **API Integrations**:
  - Unsplash for stock images
  - Uploadthing for file management
- **Responsive Design**: Optimized for devices of all sizes

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Hono.js for APIs
- NeonDB (PostgreSQL)
- DrizzleORM

### Additional Technologies
- **Authentication**: Next-Auth v5 (Auth.js)
- **Payments**: Stripe
- **File Handling**: Uploadthing for asset management

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hyperactive-panda111/canva-clone.git
cd canva-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_APP_URL=<your_app_url>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
NEXTAUTH_SECRET=<your_nextauth_secret>
UNSPLASH_ACCESS_KEY=<your_unsplash_access_key>
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open the Application

Open http://localhost:3000 to view the app.

## API Endpoints

- **GET /api/images**: Fetch stock images from Unsplash
- **POST /api/upload**: Upload files via Uploadthing
- **POST /api/checkout**: Handle Stripe checkout sessions

## Usage

1. Sign up or log in using your credentials
2. Choose a template or start from scratch
3. Use the design tools to add elements, adjust layouts, and apply effects
4. Save your design or export it as a file

## Roadmap

- Add collaborative editing features
- Implement advanced design elements like gradients and shadows
- Expand template and asset library
- Introduce multi-language support

# Ration (self-hostable)

An encrypted cloud platform for securely storing, syncing, and managing environment variables across all your projects and teams.

## Some Previews

- Landing Page
![Screenshot](/public/preview.png)

- Personal Dashboard
![Screenshot](/public/personal-dashboard.png)

- Teams Dashboard
![Screenshot](/public/teams-dashboard.png)

- Projects Details Page
![Screenshot](/public/personal-project-view.png)

- Team Members
![Screenshot](/public/teams-members.png)


## ✨ Features

- **👥 Collaboration** - Collaborate with team members on environment variables
- **🔒 Secure Storage** - Enterprise-grade encryption for your sensitive data
- **🔑 Easy Access** - Simple and intuitive interface for managing environment variables
- **🛡️ Encrypted** - End-to-end encryption ensures your data stays private
- **⚡ Fast Sync** - Quick synchronization across all your projects and environments
- **🌐 Multi-Environment** - Manage environment variables for different environments (e.g., development, staging, production)

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Runtime**: Bun
- **TypeScript**: Full type safety throughout

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/r2hu1/ration.git
cd ration
```

2. Install dependencies:
```bash
bun install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Configure your database connection in `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ration"
```

5. Push the database schema:
```bash
bun run db:push
```

6. Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## 🛠️ Development

### Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run Biome linting
- `bun run format` - Format code with Biome
- `bun run db:push` - Push database schema changes
- `bun run db:studio` - Open Drizzle Studio
- `bun run schema:generate` - Generate database migrations

### Project Structure

```
ration/
├── app/
│   ├── (main)/
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # Dashboard pages
│   ├── (root)/            # Landing page
│   └── api/               # API routes
├── components/            # Reusable UI components
├── db/                    # Database schema and configuration
├── drizzle/              # Database migrations
├── lib/                  # Utility functions and configurations
├── modules/              # Feature modules
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="your-postgresql-connection-string"
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GMAIL_USER=
GMAIL_PASS=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Database Setup

This project uses PostgreSQL with Drizzle ORM. Make sure you have PostgreSQL running and create a database for the application.

## 🚀 Deployment

1. Build the application:
```bash
bun run build
```

2. Set up your production environment variables

3. Push the database schema to production:
```bash
bun run db:push
```

4. Start the production server:
```bash
bun run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/r2hu1/ration)
- [Issues](https://github.com/r2hu1/ration/issues)

## 💡 Why Ration?

Managing environment variables across multiple projects, environments, and team members can be challenging. Ration solves this by providing a secure, centralized platform where you can:

- Store sensitive configuration data with enterprise-grade encryption
- Easily share environment variables with team members
- Sync configurations across development, staging, and production environments
- Maintain version history and audit trails
- Access your variables from anywhere with a simple, intuitive interface

Built with modern web technologies and security best practices, Ration ensures your sensitive data remains protected while being easily accessible to authorized users.

# Dia-Assist

A comprehensive health and diet management platform designed to help users track their dietary habits, predict health outcomes, and manage their wellness journey.

## 📋 Project Overview

Dia-Assist is a full-stack application that combines a modern React frontend with a Java backend and Python analytics to provide users with:
- **Dashboard**: Real-time health metrics and statistics
- **Diet Planning**: Personalized meal plans and nutritional tracking
- **Health Prediction**: AI-powered predictions for health outcomes
- **Chat Assistant**: Interactive chatbot for health guidance
- **History Tracking**: Historical data visualization and analysis

## 🏗️ Project Structure

```
Dia-Assist/
├── React/                 # Frontend Application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── api/          # API integration
│   │   ├── auth/         # Authentication
│   │   └── routes/       # Route configuration
│   ├── vite.config.ts    # Vite configuration
│   ├── tsconfig.json     # TypeScript configuration
│   └── package.json      # Dependencies
├── java/Backend/         # Backend API Server
├── python/               # Analytics & ML Models
│   ├── main.py          # Main entry point
│   └── demo/            # Demo scripts
└── README.md            # Project documentation
```

## 🎨 Frontend Features (React + TypeScript + Vite)

### Pages Implemented:
- **Home Page** - Landing page with overview and CTA
- **Dashboard** - Health metrics, statistics, and weekly charts
- **Diet Plan** - Personalized meal plans with card-based UI
- **Predict** - Health prediction form with analytics
- **History** - Historical data tracking and visualization
- **Chat Bot** - Interactive health assistant

### Key Technologies:
- **React 18** with TypeScript
- **Vite** for fast development
- **Axios** for API calls
- **Context API** for state management
- **CSS Modules** for styling

## 🔐 Authentication

- JWT-based authentication
- Protected routes for authenticated users
- Login and Registration pages
- Secure API endpoints

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/Dia-Assist-Frontend.git
cd Dia-Assist-Frontend/React
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the React folder:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📁 Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/pages` | Main page components |
| `src/global/components` | Shared components (Modal, Header, Chatbot) |
| `src/api` | API configuration and services |
| `src/auth` | Authentication context and protected routes |
| `src/routes` | Route definitions |
| `src/util` | Utility functions |
| `src/lib` | Mock data and libraries |

## 👥 Team & Contributions

**Vicky** - Full Stack Developer
- Dashboard Page & Components
- Predict Page & Form
- Chatbot Implementation
- Project Coordination

**Sahithi** - Frontend Developer
- Home Page & Hero Section
- Diet Plan Page & Cards
- History Page & Components

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Get health statistics
- `GET /api/dashboard/weekly-data` - Get weekly chart data

### Diet Plans
- `GET /api/diet-plans` - Fetch all diet plans
- `GET /api/diet-plans/:id` - Get specific diet plan
- `POST /api/diet-plans` - Create new diet plan

### Predictions
- `POST /api/predict` - Make health prediction
- `GET /api/predict/history` - Get prediction history

### History
- `GET /api/history` - Get user history
- `GET /api/history/:id` - Get specific history entry

## 🛠️ Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 File Structure Details

### Components
- `Header.tsx` - Navigation header
- `Modal.tsx` - Reusable modal component
- `Chatbot.tsx` - Chat interface
- `StatsCard.tsx` - Statistics display
- `WeeklyChart.tsx` - Chart visualization
- `DietPlanCard.tsx` - Diet plan display card

### Pages
- `pages/home/` - Home page with hero section
- `pages/dashboard/` - Dashboard with statistics
- `pages/diet/` - Diet plan management
- `pages/predict/` - Prediction form
- `pages/history/` - Historical data view
- `pages/auth/` - Login and registration

## 🔒 Security

- JWT token-based authentication
- Protected API endpoints
- Secure credential storage
- CORS enabled for trusted domains

## 📊 Features Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Integration with wearable devices
- [ ] Nutritionist recommendations
- [ ] Social sharing features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please contact:
- Vicky - [Email]
- Sahithi - [Email]

## 🙏 Acknowledgments

- React community for excellent documentation
- Vite for blazing fast development
- All contributors and testers

---

**Last Updated:** December 2025
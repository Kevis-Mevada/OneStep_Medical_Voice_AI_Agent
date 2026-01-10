# Onestep Medical Voice AI

A secure, voice-based health guidance assistant providing calm, non-diagnostic medical information using advanced AI technology.

## 🌟 Features

- **Voice-Based Interaction**: Natural voice conversations with AI medical assistant
- **Real-time Speech Processing**: 
  - Speech-to-text using Groq's Whisper API
  - Text-to-speech using ElevenLabs API
- **Medical Guidance**: Non-diagnostic health information and wellness advice
- **User Authentication**: Secure Firebase authentication system
- **Consultation History**: Detailed medical consultation records
- **Emergency Detection**: Automatic detection and alerts for emergency symptoms
- **Admin Dashboard**: Comprehensive monitoring and user management
- **Report Generation**: Structured medical guidance reports

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Static type checking
- **Tailwind CSS** - Styling and responsive design

### AI & Machine Learning
- **Groq API** - Llama 3.3-70b model for medical consultations
- **ElevenLabs API** - Advanced text-to-speech synthesis
- **Whisper Large V3** - State-of-the-art speech recognition

### Backend Services
- **Firebase Authentication** - Secure user authentication
- **Cloud Firestore** - Real-time database for user data and consultations
- **Firebase Admin SDK** - Server-side database operations

### Audio Processing
- **Web Audio API** - Browser-native audio recording
- **MediaRecorder API** - Audio capture and processing

## 🔐 Security Features

### Authentication & Authorization
- **Firebase Authentication** with Google and email/password sign-in
- **JWT Token Validation** for secure API access
- **Role-based Access Control** (RBAC) for admin features
- **Session Management** with automatic token refresh

### Data Protection
- **End-to-End Encryption** for sensitive medical data
- **Secure Data Transmission** using HTTPS/TLS protocols
- **Privacy-First Architecture** - minimal data collection
- **Encrypted Storage** for personal health information
- **Access Control Lists** (ACL) for user data isolation

### API Security
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **Environment Variable Protection** for API keys
- **CORS Configuration** limiting cross-origin requests
- **Request Authentication** for all sensitive endpoints

### Compliance
- **GDPR Ready** - Right to access, rectification, and erasure
- **HIPAA Aligned** - Medical data handling guidelines
- **Data Minimization** - Collecting only essential information
- **Audit Logging** for admin activities

## 📈 Scalability

### Horizontal Scaling
- **Serverless Architecture** with Next.js API routes
- **Auto-scaling** through Vercel deployment platform
- **CDN Distribution** for static assets
- **Load Balancing** managed by cloud infrastructure

### Database Optimization
- **Firestore Indexes** for fast queries
- **Query Optimization** with efficient data structures
- **Pagination** for large datasets
- **Caching Strategies** for frequently accessed data

### Performance
- **Edge Computing** with global CDN
- **Optimized Bundle Size** with tree-shaking
- **Lazy Loading** for components and routes
- **Image Optimization** with Next.js Image component

### Resource Management
- **Connection Pooling** for database operations
- **Memory Optimization** for AI model interactions
- **Bandwidth Efficiency** with audio compression
- **Resource Cleanup** with proper disposal patterns

## 🤖 AI Models & Architecture

### Language Model
- **Model**: Llama 3.3-70b (via Groq API)
- **Capabilities**: Medical consultation, symptom analysis, health guidance
- **Safety**: Built-in medical safety protocols and guardrails
- **Languages**: Multilingual support via Groq's API

### Speech Processing
- **STT Model**: Whisper Large V3 (via Groq API)
- **TTS Model**: ElevenLabs multilingual model
- **Quality**: High-fidelity audio processing
- **Latency**: Optimized for real-time conversation

### Safety Protocols
- **Medical Disclaimers** prominently displayed
- **Non-Diagnostic Focus** - wellness guidance only
- **Emergency Detection** with immediate alerts
- **Professional Referral** for serious symptoms

## 🏗️ Project Architecture

```
medical-voice-ai/
├── app/                    # Next.js App Router
│   ├── api/               # Server-side API routes
│   │   ├── admin/         # Admin dashboard APIs
│   │   ├── consultation/  # Report generation
│   │   ├── live-consultation/ # Voice conversation APIs
│   │   ├── profile/       # User profile APIs
│   │   ├── reports/       # Report management
│   │   ├── speech-to-text/ # Audio transcription
│   │   └── text-to-speech/ # Audio synthesis
│   ├── dashboard/         # Protected user routes
│   ├── admin/             # Admin panel
│   └── ...                # Other pages
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components
├── lib/                  # Business logic and utilities
│   ├── ai-prompts.ts     # Centralized AI prompts
│   ├── groq.ts           # AI integration
│   ├── firebase.ts       # Client Firebase config
│   ├── firebase-admin.ts # Server Firebase config
│   ├── firestore-admin.ts # Database operations
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medical-voice-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure API keys in `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🛡️ Privacy & Data Policy

### Data Collection
- User profile information (optional)
- Consultation history and symptoms
- Voice recordings (processed and discarded)
- Usage analytics (anonymous)

### Data Retention
- Consultation data: Available for user access
- Temporary processing data: Automatically deleted
- Logs: Retained for security purposes

### User Rights
- Access to personal data
- Correction of inaccurate data
- Deletion of account and data
- Data portability options

## ⚠️ Important Disclaimers

- **NOT FOR EMERGENCY USE**: This service is not a substitute for professional medical care
- **Non-Diagnostic**: Provides wellness guidance, not medical diagnoses
- **Professional Consultation**: Always consult healthcare providers for medical concerns
- **Accuracy Disclaimer**: Information provided is for educational purposes only
- **Emergency Protocol**: Call emergency services for urgent medical situations

## 🚨 Emergency Guidelines

The system includes automatic emergency detection:
- Monitors for critical symptom keywords
- Immediately alerts users for emergency situations
- Provides emergency contact information
- Recommends immediate professional medical attention

## 📊 Admin Features

### Dashboard Capabilities
- User statistics and activity monitoring
- Consultation volume tracking
- Emergency alert logging
- User management tools
- Platform usage analytics

### Security Monitoring
- Suspicious activity detection
- Access log review
- User behavior analysis
- System performance metrics

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact the development team or open an issue in the repository.

---

**Disclaimer**: This application provides health information for educational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.
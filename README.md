# TransactEasy

Welcome to TransactEasy, a modern, AI-enhanced B2B transaction platform designed to simplify and automate cross-border trade for importers and suppliers. This project was built collaboratively with the App Prototyper AI in Firebase Studio.

## ✨ Vision

Our vision is to create a seamless, transparent, and intelligent ecosystem where businesses can manage invoices, payments, and digital wallets with unparalleled ease and security.

---

## 🚀 Core Features

-   **Role-Based Access Control**: Tailored dashboards and functionality for Importers, Suppliers, and platform Admins.
-   **Invoice Management**: Create, send, and track invoices with status updates (unpaid, paid, overdue).
-   **Digital Wallets**: Manage funds in multiple currencies (USD, EUR).
-   **Transaction History**: A clear record of all financial movements on the platform.
-   **AI-Powered Suggestions**: A "Smart Invoice" tool that uses Genkit and Google's Gemini models to suggest optimal pricing and payment terms.
-   **Comprehensive Admin Panels**: Full control over users, organizations, and wallet funds for platform administrators.
-   **Modern, Responsive UI**: A professional and intuitive interface built with ShadCN UI and Tailwind CSS, designed to work flawlessly on desktop and mobile.

---

## 🛠️ Tech Stack

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **UI**: React, ShadCN UI, Tailwind CSS
-   **State Management**: React Context API
-   **Forms**: React Hook Form with Zod
-   **Authentication**: Firebase Authentication (currently mocked, ready for integration)
-   **AI/Generative**: Genkit with Google AI (Gemini)
-   **Deployment**: Firebase App Hosting

---

## 🏁 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   A Firebase Project
-   A Google AI API Key

### Installation & Setup

1.  **Install Dependencies**:
    Open a terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Configure Environment Variables**:
    Create a new file named `.env` in the project root by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and replace the placeholder values with your actual credentials from your Firebase project and Google AI Studio.

    > **Note**: The application is currently configured to run with mock data and authentication, so providing Firebase credentials is not strictly required for local development. However, they will be needed to enable live authentication. The Google AI key is required for the "Smart Invoice" feature to work.

3.  **Run the Development Servers**:
    This project requires two separate development servers running concurrently.

    *   **Next.js App Server**:
        ```bash
        npm run dev
        ```
        This will start the main web application, typically on `http://localhost:9003`.

    *   **Genkit AI Server**:
        In a separate terminal window, run:
        ```bash
        npm run genkit:watch
        ```
        This starts the Genkit development server which powers the AI features.

4.  **Open the App**:
    Navigate to `http://localhost:9003` in your browser to start using TransactEasy.

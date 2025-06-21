# TransactEasy v2.0 - Task Breakdown

This document tracks the major tasks required to implement the features outlined in the PRD.

### Phase 1: Foundational Overhaul & Feature Completion

-   [x] **Project Scaffolding & Documentation**
    -   [x] Create `docs` directory.
    -   [x] Create `PRD.md` with detailed product requirements.
    -   [x] Create `TASKS.md` to track development progress.
    -   [x] Create `CHANGELOG.md` for AI-driven change tracking.

-   [x] **Authentication System**
    -   [x] Integrate Firebase SDK and initialize the app.
    -   [x] Implement Firebase Anonymous Authentication.
    -   [x] Refactor `useAuth` hook to manage Firebase state.
    -   [x] Update `LoginOverlay` to handle async login and loading states.
    -   [x] Ensure session persistence and secure logout.

-   [x] **Admin Form Implementation**
    -   [x] Build "Create User" form with `react-hook-form` and Zod validation.
    -   [x] Build "Create Organization" form.
    -   [x] Build "Manage Wallet Funds" form for admins.

-   [x] **Invoice & Payment Enhancements**
    -   [x] Implement QR code generation for invoices.
    -   [x] Create a QR Code dialog component for payment simulation.
    -   [x] Integrate QR code feature into the invoices page.
    -   [x] Build "Create Invoice" form for suppliers.

-   [x] **User Experience & Modularity**
    -   [x] Add confirmation `AlertDialog` for deleting users.
    -   [x] Add confirmation `AlertDialog` for deleting organizations.
    -   [x] Refactor pages to consume new form components and state logic.
    -   [x] Ensure all new features are fully mobile-responsive.
    -   [x] Review and apply consistent iconography and styling.

### Phase 2: UI/UX Polish & Feature Completion

-   [x] **UI/UX Overhaul**
    -   [x] Update color theme in `globals.css` to a modern, professional palette.
    -   [x] Redesign dashboard cards for better visual appeal.
    -   [x] Make dashboard stats dynamic based on mock data.

-   [x] **Complete Core Feature Actions**
    -   [x] Implement "View Details" for invoices with a dedicated dialog.
    -   [x] Implement "View Receipt" for paid invoices with a dedicated dialog.
    -   [x] Implement "Edit" functionality for Users and Organizations.
    -   [x] Make the "Profile" settings form fully functional.
    -   [x] Add a functional "Notifications" settings form.

-   [x] **Payment Flow Simulation**
    -   [x] Enhance QR code dialog to include "Alipay" branding and simulate payment.
    -   [x] Ensure "Pay Invoice" action correctly updates invoice status.

### Phase 3: Advanced Features & Polish (Future)

-   [ ] **Real-time Updates**
    -   [ ] Integrate Firestore to reflect data changes in real-time (e.g., invoice status).

-   [ ] **Full Firebase Auth**
    -   [ ] Re-enable live Firebase Authentication.
    -   [ ] Implement Email/Password sign-up and sign-in flow.
    -   [ ] Add "Forgot Password" functionality.

-   [ ] **AI Tool Enhancements**
    -   [ ] Use historical data from Firestore to provide more accurate AI suggestions.
    -   [ ] Allow users to apply AI suggestions directly to an invoice draft.

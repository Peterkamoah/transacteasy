# TransactEasy v2.0 - Task Breakdown

This document tracks the major tasks required to implement the features outlined in the PRD.

### Phase 1: Foundational Overhaul & Feature Completion

-   [x] **Project Scaffolding & Documentation**
    -   [x] Create `docs` directory.
    -   [x] Create `PRD.md` with detailed product requirements.
    -   [x] Create `TASKS.md` to track development progress.

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

### Phase 2: Advanced Features & Polish (Future)

-   [ ] **Real-time Updates**
    -   [ ] Integrate Firestore to reflect data changes in real-time (e.g., invoice status).

-   [ ] **Full Firebase Auth**
    -   [ ] Implement Email/Password sign-up and sign-in flow.
    -   [ ] Add "Forgot Password" functionality.

-   [ ] **Profile Management**
    -   [ ] Allow users to update their own profile information in the Settings page.
    -   [ ] Implement password change functionality.

-   [ ] **Notification System**
    -   [ ] Implement a notification system (e.g., when an invoice is paid or becomes overdue).

-   [ ] **AI Tool Enhancements**
    -   [ ] Use historical data from Firestore to provide more accurate AI suggestions.
    -   [ ] Allow users to apply AI suggestions directly to an invoice draft.

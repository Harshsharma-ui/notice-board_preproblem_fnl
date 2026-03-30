# CampusConnect - Smart Digital Notice Board

CampusConnect is a modern, real-time digital notice board application designed for educational institutions. It streamlines campus communication by allowing administrators to post, manage, and broadcast important announcements to students instantly.

## 🚀 Features

### For Students
- **Real-time Updates**: Notices appear instantly without refreshing the page using live database listeners.
- **Smart Filtering**: Categorize notices by Academic, Placement, Events, Scholarships, Sports, Hostel, and General.
- **Search**: Quickly find specific announcements with a high-performance search interface.
- **Browser Notifications**: Opt-in to receive push-style notifications for critical college updates.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing with a "mobile-first" approach.
- **Dark Mode**: Intelligent theme support for comfortable viewing in any environment.

### For Administrators
- **Secure Authentication**: Protected admin access via Firebase Authentication.
- **Notice Management**: Full CRUD (Create, Read, Update, Delete) capabilities for announcements.
- **Pinning System**: Highlight critical announcements by pinning them to the top of the board.
- **Global Broadcast**: Send instant notifications to all active students for emergency or high-priority alerts.
- **Attachment Support**: Seamlessly link external documents, PDFs, and resources to notices.
- **Automated Archiving**: Smart expiry system that manages notice visibility based on scheduled dates.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript for robust, type-safe development.
- **Build Tool**: Vite for lightning-fast development and optimized production builds.
- **Styling**: Tailwind CSS for a modern, utility-first design system.
- **Animations**: Framer Motion for smooth, high-performance UI transitions and modal effects.
- **Backend**: Firebase Firestore for real-time NoSQL data synchronization.
- **Authentication**: Firebase Auth for secure, reliable user management.
- **UI Components**: Lucide React for consistent, high-quality iconography.
- **State Management**: React Hooks and Context for efficient data flow.

## 🏗️ Architecture & Design

- **React Portals**: All modals and overlays are rendered via Portals to ensure they are never clipped by parent containers and maintain perfect layering.
- **Real-time Sync**: Uses Firestore `onSnapshot` for zero-latency updates across all connected clients.
- **Security First**: Implements granular Firestore Security Rules to protect data integrity and restrict administrative actions to authorized users only.
- **Performance**: Optimized rendering with Framer Motion's `AnimatePresence` for fluid entry and exit animations.

---


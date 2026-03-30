rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ===============================================================
    // Assumed Data Model
    // ===============================================================
    //
    // Collection: /users/{userId}
    // Fields:
    //   - uid: string (required)
    //   - email: string (required)
    //   - role: string (required, 'admin' or 'student')
    //   - displayName: string (optional)
    //
    // Collection: /notices/{noticeId}
    // Fields:
    //   - title: string (required, size 1-200)
    //   - description: string (required, size 1-5000)
    //   - category: string (required, enum: Academic, Placement, Events, Scholarships, Sports, Hostel, General)
    //   - urgency: string (required, enum: Normal, Important, Urgent)
    //   - expiryDate: timestamp (required)
    //   - createdAt: timestamp (required)
    //   - attachmentUrl: string (optional, URL format)
    //   - pinned: bool (required)
    //   - authorUid: string (required)
    //
    // Collection: /subscriptions/{subscriptionId}
    // Fields:
    //   - userId: string (required)
    //   - category: string (required)
    //   - fcmToken: string (required)
    //
    // ===============================================================

    // ===============================================================
    // Helper Functions
    // ===============================================================
    
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         (request.auth.token.email == "weilhaters@gmail.com" && request.auth.token.email_verified == true));
    }

    function isValidEmail(email) {
      return email is string && email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    function isValidUrl(url) {
      return url is string && (url.matches("^https://.*") || url.matches("^http://.*"));
    }

    function hasOnlyAllowedFields(fields) {
      return request.resource.data.keys().hasOnly(fields);
    }

    function hasRequiredFields(fields) {
      return request.resource.data.keys().hasAll(fields);
    }

    // ===============================================================
    // Domain Validators
    // ===============================================================

    function isValidUser(data) {
      return hasRequiredFields(['uid', 'email', 'role']) &&
             hasOnlyAllowedFields(['uid', 'email', 'role', 'displayName']) &&
             data.uid == request.auth.uid &&
             data.email == request.auth.token.email &&
             data.role in ['admin', 'student'] &&
             (data.role == 'student' || isAdmin());
    }

    function isValidNotice(data) {
      return hasRequiredFields(['title', 'description', 'category', 'urgency', 'expiryDate', 'createdAt', 'pinned', 'authorUid']) &&
             hasOnlyAllowedFields(['title', 'description', 'category', 'urgency', 'expiryDate', 'createdAt', 'pinned', 'authorUid', 'attachmentUrl']) &&
             data.title is string && data.title.size() >= 1 && data.title.size() <= 200 &&
             data.description is string && data.description.size() >= 1 && data.description.size() <= 5000 &&
             data.category in ['Academic', 'Placement', 'Events', 'Scholarships', 'Sports', 'Hostel', 'General'] &&
             data.urgency in ['Normal', 'Important', 'Urgent'] &&
             data.expiryDate is timestamp &&
             data.createdAt is timestamp &&
             data.pinned is bool &&
             data.authorUid == request.auth.uid &&
             (!('attachmentUrl' in data) || isValidUrl(data.attachmentUrl));
    }

    function isValidSubscription(data) {
      return hasRequiredFields(['userId', 'category', 'fcmToken']) &&
             hasOnlyAllowedFields(['userId', 'category', 'fcmToken']) &&
             data.userId == request.auth.uid &&
             data.category is string &&
             data.fcmToken is string;
    }

    function isValidNotification(data) {
      return hasRequiredFields(['title', 'message', 'category', 'createdAt']) &&
             hasOnlyAllowedFields(['title', 'message', 'category', 'createdAt']) &&
             data.title is string && data.title.size() >= 1 && data.title.size() <= 200 &&
             data.message is string && data.message.size() >= 1 && data.message.size() <= 5000 &&
             data.category is string &&
             data.createdAt is timestamp;
    }

    // ===============================================================
    // Rules
    // ===============================================================

    match /notices/{noticeId} {
      allow read: if true;
      allow create, update, delete: if true; // Simplified for password-based admin mode
    }

    match /notifications/{notificationId} {
      allow read: if true;
      allow create, update, delete: if true; // Simplified for password-based admin mode
    }

    match /users/{userId} {
      allow read, write: if true;
    }

    match /subscriptions/{subscriptionId} {
      allow read, write: if true;
    }

    match /{path=**} {
      allow read, write: if false;
    }
  }
}

# 🔒 Security Note

## Current Firestore Rules (Development Mode)

**⚠️ IMPORTANT:** The current Firestore rules allow **full read/write access** to everyone for testing purposes.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Why This Is Temporary

During development and testing, we've opened up the Firestore rules to avoid permission issues while building features. This is common during development but **should NOT be used in production**.

## Before Going Live

Before deploying your portfolio to production, update the Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'charlieshane57@gmail.com';
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if true;  // Anyone can read
      allow write: if isAuthenticated();  // Only authenticated users can write
    }
    
    // Artworks collection
    match /artworks/{artworkId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Content collection
    match /content/{contentId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Featured items
    match /featured/{itemId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}
```

## How to Update Rules

1. Update `firestore.rules` file with the production rules above
2. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. Test that:
   - Public can still view your portfolio
   - Only you (when logged in) can edit content
   - Unauthorized users cannot modify data

## Additional Security Measures

For even tighter security, you can:

1. **Restrict to specific email:**
   ```javascript
   allow write: if isAdmin();  // Only your specific email
   ```

2. **Add rate limiting** through Firebase App Check

3. **Enable Firebase App Check** to prevent abuse

4. **Monitor usage** in Firebase Console

## Testing Security Rules

Use the Firebase Console's Rules Playground to test your rules before deploying:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click on "Rules" tab
4. Use the "Rules Playground" to simulate requests

---

**Remember:** Security rules are your first line of defense. Always test them thoroughly before going live! 🔒

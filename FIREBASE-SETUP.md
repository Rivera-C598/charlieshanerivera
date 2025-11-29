# 🔥 Firebase Setup Guide for Admin Panel

## 📋 Step-by-Step Setup

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. **Project name**: `portfolio-admin` (or your choice)
4. **Google Analytics**: Optional (you can disable it)
5. Click **"Create project"**

---

### **Step 2: Register Your Web App**

1. In your Firebase project, click the **Web icon** (`</>`)
2. **App nickname**: `Portfolio Admin`
3. **Firebase Hosting**: No need to check (using Vercel)
4. Click **"Register app"**
5. **Copy the config values** - you'll need these!

```javascript
// You'll see something like this:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

---

### **Step 3: Update Environment Variables**

Open your `.env` file and replace the Firebase placeholders:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

---

### **Step 4: Enable Authentication**

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"** under Sign-in providers
4. **Enable** the toggle
5. Click **"Save"**

---

### **Step 5: Create Firestore Database**

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. **Start in production mode** (we'll add rules next)
4. **Location**: Choose closest to your users
5. Click **"Enable"**

---

### **Step 6: Set Up Firestore Security Rules**

1. In Firestore, go to **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'charlieshane57@gmail.com';
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if true;  // Anyone can read
      allow write: if isAdmin();  // Only admin can write
    }
    
    // Artworks collection
    match /artworks/{artworkId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Content collection (About, Skills, etc.)
    match /content/{contentId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Featured items
    match /featured/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

---

### **Step 7: Enable Firebase Storage**

1. Go to **Build** → **Storage**
2. Click **"Get started"**
3. **Start in production mode**
4. **Location**: Same as Firestore
5. Click **"Done"**

---

### **Step 8: Set Up Storage Security Rules**

1. In Storage, go to **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'charlieshane57@gmail.com';
    }
    
    // Projects images
    match /projects/{allPaths=**} {
      allow read: if true;  // Anyone can read
      allow write: if isAdmin();  // Only admin can upload
    }
    
    // Art images
    match /art/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Profile images
    match /profile/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

---

### **Step 9: Create Admin User**

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. **Email**: `charlieshane57@gmail.com`
4. **Password**: Create a strong password (save it!)
5. Click **"Add user"**

---

### **Step 10: Test the Connection**

1. Restart your dev server: `npm run dev`
2. Check browser console for any Firebase errors
3. If no errors, Firebase is connected! ✅

---

## 🔐 Security Best Practices

### **Environment Variables:**
- ✅ Never commit `.env` to Git (already in `.gitignore`)
- ✅ Add Firebase config to Vercel environment variables
- ✅ Use different Firebase projects for dev/production

### **Firestore Rules:**
- ✅ Only your email can write data
- ✅ Everyone can read (for public portfolio)
- ✅ Test rules in Firebase Console

### **Authentication:**
- ✅ Use strong password
- ✅ Enable 2FA on your Google account
- ✅ Never share credentials

---

## 📊 Firebase Free Tier Limits

Your portfolio will easily stay within free limits:

| Service | Free Tier | Your Usage (Est.) |
|---------|-----------|-------------------|
| **Firestore** | 50K reads/day | ~100-500/day |
| **Storage** | 5GB storage | ~500MB |
| **Auth** | Unlimited | 1 user (you) |
| **Bandwidth** | 1GB/day | ~10-50MB/day |

**Verdict**: ✅ You'll never hit the limits!

---

## 🚀 Vercel Deployment

### **Add Environment Variables to Vercel:**

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add all `VITE_FIREBASE_*` variables
4. Add `VITE_ADMIN_EMAIL`
5. **Redeploy** your site

---

## ✅ Checklist

- [ ] Create Firebase project
- [ ] Register web app
- [ ] Copy config to `.env`
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Set Firestore security rules
- [ ] Enable Firebase Storage
- [ ] Set Storage security rules
- [ ] Create admin user account
- [ ] Test connection locally
- [ ] Add env vars to Vercel
- [ ] Deploy and test

---

## 🆘 Troubleshooting

### **"Firebase: Error (auth/configuration-not-found)"**
- Check that all env variables are set correctly
- Restart dev server after changing `.env`

### **"Missing or insufficient permissions"**
- Check Firestore security rules
- Verify you're logged in with admin email

### **"Storage: Object not found"**
- Check Storage security rules
- Verify file path is correct

### **Images not loading**
- Check Storage CORS settings
- Verify image URLs are public

---

## 📞 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

---

**Next**: Once Firebase is set up, we'll build the admin UI! 🎨
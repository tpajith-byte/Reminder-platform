# Supabase Configuration Required

## ⚠️ IMPORTANT: Update Redirect URL

For the email confirmation flow to work correctly, you need to update the redirect URL in your Supabase project settings.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `xihnbfktplfxlupscpwr`

2. **Update Email Templates**
   - Go to: **Authentication** → **Email Templates**
   - Select **Confirm signup** template
   - Find the line with the confirmation link (usually contains `{{ .ConfirmationURL }}`)
   - Update it to redirect to your app's confirmation page:

   **For Local Development:**
   ```
   {{ .SiteURL }}/auth-confirm#{{ .TokenHash }}&type=signup
   ```

   **For Production (Netlify):**
   ```
   https://your-app-name.netlify.app/auth-confirm#{{ .TokenHash }}&type=signup
   ```

3. **Update URL Configuration**
   - Go to: **Authentication** → **URL Configuration**
   - Ensure **Site URL** is set to:
     - Local: `http://localhost:3000`
     - Production: `https://your-app-name.netlify.app`
   
   - Add to **Redirect URLs**:
     - Local: `http://localhost:3000/auth-confirm`
     - Production: `https://your-app-name.netlify.app/auth-confirm`

4. **Save Changes**

## Alternative: Use Default Configuration

If you prefer not to customize the email template, Supabase's default confirmation should work, but users will be redirected to the home page (`/`) instead of the confirmation page (`/auth-confirm`). The confirmation will still work, but won't show the "Email Confirmed!" success message.

## Testing After Configuration

After updating the Supabase settings:

1. Clear your browser cache or use an incognito window
2. Sign up with a new email address
3. Check your email for the confirmation link
4. Click the link
5. You should see the "Email Confirmed!" page
6. Click "Proceed to Sign In"
7. Sign in with your credentials
8. You should successfully reach the dashboard

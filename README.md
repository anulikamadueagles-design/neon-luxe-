# NEON LUXE — Render-ready e-commerce frontend

## Upload structure
This ZIP opens directly at the project root. There is no extra outer project folder.

Root files:
- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `GITHUB-UPLOAD.txt`

## GitHub
Upload the root files directly into the main branch. Do not create another NEON-LUXE folder inside the repository.

## Render
Create a **Static Site** from the GitHub repository.
- Branch: `main`
- Root Directory: leave empty
- Build Command: leave empty
- Publish Directory: `.`
- Auto Deploy: enabled

## Included
- Responsive/adaptive layout for desktop, tablet and mobile
- Landing/hero section
- 960 product records across 12 categories
- Search
- Category filtering
- Price filtering
- Sorting
- Pagination
- Product quick view
- Wishlist stored in localStorage
- Shopping cart stored in localStorage
- Checkout UI
- Payment method selection UI
- Newsletter UI
- Mobile navigation
- Dark futuristic neon green/gold/blue/pink visual system
- No framework/build step required

## Production integrations still required
The frontend is complete as a static storefront UI, but real commerce requires secure backend services for:
- Real payment processing and payment verification
- Server-side orders
- User authentication/accounts
- Inventory and product database
- Shipping/tax calculation
- Admin dashboard
- Transactional email/SMS
- Secure secrets/API keys

Never put private payment/API secrets in `script.js` or other frontend files.

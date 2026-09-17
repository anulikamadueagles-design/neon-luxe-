# NEON LUXE Marketplace — GitHub + Render Ready

This version expands the existing NEON LUXE frontend into a multi-vendor marketplace UI inspired by common marketplace/e-commerce patterns.

Included:
- 960 product records
- Responsive desktop/tablet/mobile design
- Advanced search, filters, sorting and categories
- Favourites, saved searches, compare and recently viewed
- Product details, reviews and seller profiles
- Cart, vouchers and checkout UI
- Card/bank transfer/USSD-wallet/cash-on-delivery payment choices (UI)
- Orders and tracking UI
- Buyer protection/trust UI
- Seller listing creation
- Seller dashboard
- Seller chat and offers
- Notifications
- Admin control center UI
- Delivery/pickup concepts
- LocalStorage persistence for demo data
- No build command required

IMPORTANT:
This is a production-style frontend/demo marketplace, not a completed financial backend. Real authentication, database, image uploads, KYC, payment processing, escrow, seller payouts, logistics APIs, real-time chat, email/SMS, fraud controls and server-side order processing must be connected through a secure backend. Never put private payment/API secrets in frontend JavaScript.

DEPLOY:
Upload ALL four files directly to the root of your existing GitHub repository:
index.html
style.css
script.js
products.js
README.md

Then commit directly to main. If your existing Render service is connected to that repository, it should redeploy automatically.


## Button/interaction fixes
All major navigation, marketplace, modal, cart, seller, account, comparison, favourites, chat and checkout controls are wired to JavaScript handlers. Real payment/account/KYC/delivery integrations still require backend services.

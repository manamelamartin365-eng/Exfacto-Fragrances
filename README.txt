EXFACTO FRAGRANCES — WEBSITE STARTER
=====================================

This is a responsive, multi-page front-end website concept for Exfacto Fragrances.

HOW TO OPEN
1. Extract the ZIP file.
2. Open the "exfacto_fragrances" folder.
3. Double-click index.html. It opens in your browser.
4. Use the navigation to visit Shop, Our Story, Contact, Bag and Checkout.

EDITING
- Open the files in Notepad++.
- Main styling: css/style.css
- Product names, categories, image URLs, descriptions and prices: js/config.js
- Website functionality: js/app.js

IMPORTANT BUSINESS PLACEHOLDERS
The supplied social media links are included:
Instagram: https://www.instagram.com/exfacto_fragrance/
TikTok: https://www.tiktok.com/@exfactofragrances
Facebook: https://www.facebook.com/reel/521395476991654/

I could not reliably verify social profile content automatically. Therefore:
- Product names, categories, descriptions, sizes, notes and prices are placeholders.
- Business email and WhatsApp number are not configured.
- Business story, location, opening hours, delivery fees and policies need approval.
- Product photography currently uses illustrative external Unsplash images, not verified Exfacto product photos.
- No payment gateway or server-side order system is connected.

TO ADD VERIFIED PRODUCTS
Edit js/config.js. Each product object has:
id, name, category, description, size, price, image, tag, notes

Set price to a number in ZAR, for example price: 450.
Do not leave placeholder text as a real product price.

TO CONNECT WHATSAPP
In js/config.js, enter the confirmed WhatsApp number in international format using digits only, without + or spaces, e.g. "27XXXXXXXXX".
The checkout then prepares an order enquiry in WhatsApp. The business must still confirm the order.
This does not process payments.

TO CONNECT EMAIL
Enter the confirmed business email in contactEmail in js/config.js.
The contact form opens the customer's email application; it does not send email from a server.

BEFORE PUBLIC LAUNCH
- Replace all placeholder product details and imagery.
- Confirm prices, stock, delivery fees, returns/refunds and privacy wording.
- Connect a trusted payment provider and server-side order handling.
- Test on mobile and desktop.
- Add a privacy policy and terms that have been reviewed for the actual business.
- Ensure the business has permission to use all product photos and brand assets.

Fonts and product images load from external services, so an internet connection is required for those assets.

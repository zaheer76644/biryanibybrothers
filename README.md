# Biryani By Brothers

Static React website for **Biryani By Brothers** — a small-batch biryani kitchen in Mira Road, Mumbai.

Tagline: *Two Brothers. One Recipe.*

## Stack

- React + Vite
- React Router
- Lucide React
- Local CSS (no Tailwind)
- Cart / order state in React Context + `localStorage`

No backend, database, auth, or payment gateway. Orders are saved locally for now.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Where to edit business data

| What | File |
| --- | --- |
| Menu prices, names, availability | `src/data/menu.js` |
| Configurable prices (Hyderabad, Dum, Gulab Jamun, Coke) | `CONFIGURABLE_PRICES` in `src/data/menu.js` |
| Delivery fee / free-delivery threshold | `src/config/deliveryConfig.js` |
| WhatsApp number, hours, location | `src/config/business.js` |
| Today’s batch count | `todaysBatch` in `src/config/business.js` |
| Demo reviews | `src/data/reviews.js` |
| Images | `src/assets/images/` + `src/assets/images.js` |

**Replace before launch**

1. `BUSINESS_WHATSAPP_NUMBER` in `src/config/business.js` (placeholder: `919876543210`)
2. Instagram URL in the same file
3. Placeholder reviews in `src/data/reviews.js`
4. Menu photos if you have better kitchen shots

## Pages

Home · Menu · Product · Cart · Checkout · Order confirmation · About · Contact · FAQ · Privacy · Terms

Payment method on checkout: **Cash / UPI on Delivery** only.

## Project layout

```
src/
  assets/       # logo + food images
  components/   # reusable UI
  config/       # brand, delivery, WhatsApp
  context/      # cart + order state
  data/         # menu, FAQ, reviews
  hooks/
  pages/
  styles/
  utils/
```

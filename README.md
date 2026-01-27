# Omni E-Commerce - Next.js Frontend

A modern, multilingual e-commerce frontend built with Next.js 16, React 19, and TypeScript.

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **React:** 19.2.3
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4.1.18
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Internationalization:** next-intl
- **Testing:** Jest + React Testing Library

## 🌍 Features

- ✅ Multilingual support (English, French)
- ✅ Server-side rendering (SSR)
- ✅ Responsive design (mobile-first)
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Customer authentication
- ✅ Order management
- ✅ Address book
- ✅ Account settings
- ✅ Order tracking (guest & authenticated)
- ✅ Comprehensive unit tests (70+ tests)

## 📁 Project Structure

```
app/
├── [locale]/                 # Internationalized routes
│   ├── account/             # Customer account pages
│   │   ├── dashboard/       # Account dashboard
│   │   ├── orders/          # Order history
│   │   ├── settings/        # Account settings (NEW)
│   │   ├── addresses/       # Address book (NEW)
│   │   └── wishlist/        # Wishlist management
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout process
│   └── orders/              # Order confirmation & tracking
lib/
├── api.ts                   # API client
├── cart.ts                  # Cart management
├── wishlist.ts              # Wishlist management
├── addresses.ts             # Address management (NEW)
└── checkout.ts              # Checkout logic
types/
├── index.ts                 # TypeScript type definitions
└── auth.ts                  # Authentication functions
messages/
├── en.json                  # English translations
└── fr.json                  # French translations
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 22.x (LTS)
- npm 10.x

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_KEY=your-api-key
NEXT_PUBLIC_CHANNEL_DOMAIN=localhost
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 Available Pages

### Public Pages
- `/` - Homepage
- `/[locale]/cart` - Shopping cart
- `/[locale]/checkout` - Checkout process
- `/[locale]/orders/track` - Order tracking (guest)

### Protected Pages (Require Authentication)
- `/[locale]/account/dashboard` - Account dashboard
- `/[locale]/account/orders` - Order history
- `/[locale]/account/orders/[id]` - Order details
- `/[locale]/account/settings` - Account settings (profile & password)
- `/[locale]/account/addresses` - Address book management
- `/[locale]/account/wishlist` - Wishlist

## 🔌 API Integration

The frontend integrates with the OmniStock Laravel backend API:

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove cart item

### Wishlist
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist/items` - Add item to wishlist
- `DELETE /api/wishlist/items/{id}` - Remove wishlist item
- `POST /api/wishlist/items/{id}/move-to-cart` - Move to cart

### Addresses
- `GET /api/customer/addresses` - List addresses
- `POST /api/customer/addresses` - Create address
- `PUT /api/customer/addresses/{id}` - Update address
- `DELETE /api/customer/addresses/{id}` - Delete address
- `POST /api/customer/addresses/{id}/set-default` - Set default

### Orders
- `GET /api/orders` - List customer orders
- `POST /api/orders` - Create order
- `GET /api/orders/{number}` - Get order details
- `POST /api/orders/track` - Track order (guest)

## 🧪 Testing

The project includes comprehensive unit tests:

- **Cart Tests:** 9 tests
- **Wishlist Tests:** 7 tests
- **Checkout Tests:** 11 tests
- **Order Confirmation Tests:** 11 tests
- **Order Tracking Tests:** 11 tests
- **Wishlist Page Tests:** 11 tests
- **Address Tests:** 10 tests

**Total:** 70 tests (all passing)

## 🌐 Internationalization

The application supports multiple languages using `next-intl`:

- **English (en)** - Default
- **French (fr)**

Language selection is URL-based:
- `/en/account/settings` - English
- `/fr/account/settings` - French

## 📝 Recent Updates

### January 27, 2026
- ✅ Added Account Settings page (#10)
  - Profile settings (name, email, phone)
  - Password change functionality
  - Tab navigation
- ✅ Added Address Book page (#11)
  - List all addresses
  - Add/edit/delete addresses
  - Set default shipping/billing addresses
  - Address validation
- ✅ Created address management library
- ✅ Added 10 new unit tests
- ✅ Full i18n support for new features

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app)

## 🚢 Deployment

The application can be deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

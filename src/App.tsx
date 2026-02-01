import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

// Types
interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  badge?: 'Best Seller' | 'New' | 'Must Try';
  prices: {
    box6: number;
    box12: number;
  };
}

interface CartItem {
  id: string; // Unique ID (productId + size)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: 'Box of 6' | 'Box of 12';
}

interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
}

// Products Data (From Menu Image)
const products: Product[] = [
  // COOKIES
  {
    id: 'c1',
    name: 'Chocolate Chip Cookies',
    prices: { box6: 200, box12: 350 },
    image: '/assets/cookie.png',
    category: 'Cookies',
    badge: 'Best Seller'
  },
  {
    id: 'c2',
    name: 'Oatmeal Cookies',
    prices: { box6: 200, box12: 350 },
    image: '/assets/cookie.png',
    category: 'Cookies'
  },
  {
    id: 'c3',
    name: 'Red Velvet Cookies',
    prices: { box6: 260, box12: 480 },
    image: '/assets/cookie.png',
    category: 'Cookies',
    badge: 'Must Try'
  },
  {
    id: 'c4',
    name: 'Nutella Cookies',
    prices: { box6: 260, box12: 480 },
    image: '/assets/cookie.png',
    category: 'Cookies'
  },
  {
    id: 'c5',
    name: 'Biscoff Cookies',
    prices: { box6: 260, box12: 480 },
    image: '/assets/cookie.png',
    category: 'Cookies'
  },

  // BROWNIES
  {
    id: 'b1',
    name: 'Fudge Brownies',
    prices: { box6: 220, box12: 380 },
    image: '/assets/brownie.png',
    category: 'Brownies',
    badge: 'Best Seller'
  },
  {
    id: 'b2',
    name: 'Nutty Brownies',
    prices: { box6: 260, box12: 450 },
    image: '/assets/brownie.png',
    category: 'Brownies'
  },

  // MUFFINS
  {
    id: 'm1',
    name: 'Banana Muffin',
    prices: { box6: 250, box12: 400 },
    image: '/assets/muffin.png',
    category: 'Muffins'
  },
  {
    id: 'm2',
    name: 'Chocolate Chip Muffin',
    prices: { box6: 250, box12: 400 },
    image: '/assets/muffin.png',
    category: 'Muffins'
  },
  {
    id: 'm3',
    name: 'Corn Muffin',
    prices: { box6: 250, box12: 400 },
    image: '/assets/muffin.png',
    category: 'Muffins'
  },

  // CUPCAKES
  {
    id: 'cp1',
    name: 'Vanilla w/ Buttercream',
    prices: { box6: 250, box12: 600 },
    image: '/assets/cupcake.png', // Note: Image says 350 for box 6 but 250 was generic, updating to match image explicitly
    category: 'Cupcakes'
  },
  {
    id: 'cp2',
    name: 'Chocolate w/ Buttercream',
    prices: { box6: 350, box12: 600 },
    image: '/assets/cupcake.png',
    category: 'Cupcakes'
  },
  {
    id: 'cp3',
    name: 'Red Velvet w/ Cream Cheese',
    prices: { box6: 380, box12: 650 },
    image: '/assets/cupcake.png',
    category: 'Cupcakes',
    badge: 'Best Seller'
  }
];

// Badge Component
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </div>
);

// ProductCard Component - Memoized for performance
const ProductCard = React.memo(({
  product,
  onAddToCart,
  cartItems,
  isShopOpen = true // Default to true if not passed
}: {
  product: Product;
  onAddToCart: (product: Product, size: 'Box of 6' | 'Box of 12', price: number) => void;
  cartItems: CartItem[];
  isShopOpen?: boolean;
}) => {
  const [selectedSize, setSelectedSize] = useState<'Box of 6' | 'Box of 12'>('Box of 6');
  const currentPrice = selectedSize === 'Box of 6' ? product.prices.box6 : product.prices.box12;

  // Optimized find: only re-calculates when cart or size changes
  const qty = React.useMemo(() => {
    const item = cartItems.find(i => i.productId === product.id && i.size === selectedSize);
    return item ? item.quantity : 0;
  }, [cartItems, product.id, selectedSize]);

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-100 flex flex-col h-full transform-gpu"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-hidden bg-rose-50 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${!isShopOpen ? 'grayscale opacity-70' : ''}`}
        />
        {product.badge && (
          <div className="absolute top-3 right-3">
            <Badge className={`${product.badge === 'Best Seller'
              ? 'bg-amber-400 text-amber-900 border-amber-500'
              : 'bg-rose-400 text-rose-900 border-rose-500'
              } shadow-md font-bold`}>
              {product.badge}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-1 font-heading leading-tight min-h-[3rem]">{product.name}</h3>

        {/* Size Selector */}
        <div className="flex bg-rose-50 rounded-lg p-1 mb-3">
          <button
            onClick={() => setSelectedSize('Box of 6')}
            className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${selectedSize === 'Box of 6' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Box of 6
          </button>
          <button
            onClick={() => setSelectedSize('Box of 12')}
            className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${selectedSize === 'Box of 12' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Box of 12
          </button>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm text-gray-500 font-medium">{selectedSize}</span>
            <p className="text-2xl font-bold text-red-600">₱{currentPrice}</p>
          </div>

          <button
            onClick={() => isShopOpen && onAddToCart(product, selectedSize, currentPrice)}
            disabled={!isShopOpen}
            className={`w-full py-2 px-4 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2 shadow-md active:scale-95 touch-manipulation ${isShopOpen
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
              }`}
          >
            {isShopOpen ? (
              <>
                <Plus className="w-4 h-4" />
                {qty > 0 ? `Add Another (${qty})` : 'Add to Order'}
              </>
            ) : (
              'Opens Monday'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

// Main Component
const BatterDaysPreOrder = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    pickupDate: '',
    pickupTime: '',
    specialInstructions: ''
  });
  const orderFormRef = useRef<HTMLDivElement>(null);
  // Memoize handlers to prevent prop drilling re-renders
  const addToCart = React.useCallback((product: Product, size: 'Box of 6' | 'Box of 12', price: number) => {
    const uniqueId = `${product.id}-${size}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === uniqueId);
      if (existing) {
        return prev.map(item => item.id === uniqueId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: uniqueId,
        productId: product.id,
        name: product.name,
        price: price,
        image: product.image,
        quantity: 1,
        size: size
      }];
    });
  }, []);

  const removeFromCart = (uniqueId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === uniqueId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === uniqueId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== uniqueId);
    });
  };

  // Helper to add specifically from cart modal (increments existing variant)
  const incrementItem = (uniqueId: string) => {
    setCart(prev => prev.map(item => item.id === uniqueId ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setActiveTab('order');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'GCash' | 'Maya' | 'MariBank'>('GCash');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔴 IMPORTANT: REPLACE THIS WITH YOUR ACTUAL GOOGLE APPS SCRIPT WEB APP URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx42jIGvtYZ5u2_ALUYu8bmvXMSDtyHcZJep4dDv2nJnvwZXOF5RaGdt-QYqlgJgz8Esw/exec"

  // --- CALENDAR LOGIC START ---

  // 🧪 TEST MODE: SIMULATE DATE
  // Uncomment the date you want to test.
  // const SIMULATED_TODAY = new Date(); // Real Today (Use this for production)
  const SIMULATED_TODAY = new Date(2026, 1, 2, 10, 0, 0); // TEST: Monday Feb 2 (Month is 0-indexed: 0=Jan, 1=Feb)
  // const SIMULATED_TODAY = new Date(2026, 1, 6, 10, 0, 0); // TEST: Friday Feb 6 (Shop CLOSED)

  // Shop is OPEN only Mon(1) - Thu(4)
  const isShopOpen = () => {
    const day = SIMULATED_TODAY.getDay();
    return day >= 1 && day <= 4;
  };

  // Returns TRUE if the date is Fri(5), Sat(6), or Sun(0) (BAKING DAYS - NO PICKUPS)
  const isDateDisabled = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const day = date.getDay();
    // Pickup allowed only Mon(1), Tue(2), Wed(3), Thu(4)
    return day === 0 || day === 5 || day === 6;
  };

  // Calculates the minimum valid pickup date based on the "Next Week" rule
  const getMinPickupDate = () => {
    const today = new Date(SIMULATED_TODAY); // Use Simulated Date
    const dayOfWeek = today.getDay();

    // Logic: Order Mon-Thu (Week A) -> Pickup Mon-Thu (Week B)
    // We need to calculate days until the *Next Monday*.

    // Days until next Monday:
    // If Mon(1) -> +7 days (Next Mon)
    // If Thu(4) -> +4 days (Next Mon)

    let daysUntilNextMonday = (1 - dayOfWeek + 7) % 7;
    if (daysUntilNextMonday === 0) daysUntilNextMonday = 7;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + daysUntilNextMonday);

    return minDate.toISOString().split('T')[0];
  };


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    const minDate = getMinPickupDate();

    // 1. Check if date is too early (Lead Time Rule)
    if (dateVal < minDate) {
      alert(`⚠️ Too early! We need 1 week lead time.\n\nEarliest pickup starts: ${minDate}`);
      setFormData({ ...formData, pickupDate: '' });
      return;
    }

    // 2. Check if date is a weekend (Fri-Sun)
    if (isDateDisabled(dateVal)) {
      alert("⚠️ We are busy baking on weekends!\n\nPickups are only available Monday to Thursday.");
      setFormData({ ...formData, pickupDate: '' });
    } else {
      setFormData({ ...formData, pickupDate: dateVal });
    }
  };
  // --- CALENDAR LOGIC END ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final Validation before submit
    const minDate = getMinPickupDate();
    if (formData.pickupDate < minDate) {
      alert(`Please select a date on or after ${minDate}.`);
      return;
    }
    if (isDateDisabled(formData.pickupDate)) {
      alert("Please select a valid weekday (Mon-Thu). Weekends are for baking!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Data
      const orderData = {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        name: formData.name, // Matched to backend 'data.name'
        contact: formData.phone,
        email: formData.email,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        order: cart.map(item => `${item.quantity}x ${item.name} (${item.size})`).join(', '), // Matched to backend 'data.order'
        cart: cart, // 🔴 NEW: Sending full cart data for LineItems sheet
        total: cartTotal, // Matched to backend 'data.total'
        status: 'Pending',
        paymentProof: paymentProof // Send Base64 string
      };

      // 2. Send to Google Sheets (using no-cors to avoid CORS errors with simple Apps Script implementation if needed, 
      // but standard POST is better if script handles OPTIONs. Usually for simple setup, we try standard first or 'no-cors' if user faces issues.
      // We will use standard POST with Content-Type text/plain to avoid preflight complexity for Apps Script)

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        // Apps Script sometimes dislikes application/json content-type in simple mode, text/plain is safer
        body: JSON.stringify(orderData)
      });

      // 3. Success Handling
      alert("Order Placed Successfully! 🍪 We will contact you for payment confirmation.");
      clearCart();
      setFormData({
        name: '',
        phone: '',
        email: '',
        pickupDate: '',
        pickupTime: '',
        specialInstructions: ''
      });
      setPaymentProof(null);
      setIsCartOpen(false);
      setActiveTab('menu');

    } catch (error) {
      console.error("Submission Error:", error);
      alert("There was an error placing your order. Please try again or message us directly!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFDF5]">
      {/* ... (background code) ... */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-100/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-100/50 rounded-full blur-3xl opacity-60"></div>
      </div>


      {/* Header & Hero Section */}
      <motion.header
        className="relative z-10 text-center py-8 px-4 border-b-2 border-dashed border-red-200 bg-white/80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* DEBUG BAR */}
        <div className="bg-black text-white text-xs py-1 px-2 rounded mb-4 inline-block font-mono">
          DEBUG: Simulating {SIMULATED_TODAY.toDateString()} | Shop Open? {isShopOpen() ? "YES" : "NO"}
        </div>

        <div className="max-w-xs mx-auto mb-6">
          <img
            src="/assets/logo.png"
            alt="Batter Days by Charlie"
            className="w-48 mx-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 🔴 SHOP CLOSED BANNER */}
        {!isShopOpen() && (
          <div className="bg-red-600 text-white py-3 px-4 rounded-xl shadow-lg max-w-2xl mx-auto mb-6 animate-pulse">
            <p className="font-bold flex items-center justify-center gap-2">
              🛑 Pre-orders are CLOSED for the weekend!
            </p>
            <p className="text-sm opacity-90 mt-1">We are busy baking. Ordering re-opens on Monday!</p>
          </div>
        )}

        <div className="hero-welcome max-w-2xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold text-red-700 mb-2"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Baked treats made with love !
          </motion.h1>
          <p className="text-xl text-rose-800/80 font-medium font-heading">
            From batter to better days ⋆𐙚₊˚⊹♡
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap items-center justify-center rounded-2xl bg-white/50 backdrop-blur-sm p-2 text-rose-900 shadow-md mb-8 max-w-4xl mx-auto gap-2 border border-rose-100">
            <TabsTrigger value="menu" className="flex-1 min-w-[100px] rounded-xl px-4 py-3 text-sm font-bold transition-all data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-red-50 cursor-pointer">
              Menu
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex-1 min-w-[100px] rounded-xl px-4 py-3 text-sm font-bold transition-all data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-red-50 cursor-pointer">
              FAQs
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex-1 min-w-[100px] rounded-xl px-4 py-3 text-sm font-bold transition-all data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-red-50 cursor-pointer">
              Policies
            </TabsTrigger>
            <TabsTrigger value="order" className="flex-1 min-w-[100px] rounded-xl px-4 py-3 text-sm font-bold transition-all data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-red-50 cursor-pointer">
              Order Form
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-8 focus:outline-none space-y-16">
            {['Cookies', 'Brownies', 'Muffins', 'Cupcakes'].map(category => {
              const categoryProducts = products.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category} className="scroll-mt-24">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-heading font-bold text-red-800">{category}</h2>
                    <div className="h-px bg-red-200 flex-1 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        cartItems={cart}
                        isShopOpen={isShopOpen()}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </TabsContent>

          <TabsContent value="faqs" className="mt-8 focus:outline-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border-2 border-dashed border-rose-200">
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-8 text-center text-red-600">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Q1 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">🍪</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">What do you sell?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">We offer freshly baked treats such as cookies, brownies, muffins, and cupcakes!</p>
                  </div>
                </div>

                {/* Q2 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">🛒</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">How can I place an order?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">You can order right here on our website! Or message us on Facebook/Instagram.</p>
                  </div>
                </div>

                {/* Q3 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">📍</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">Where are you located?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">We are based in Silang, Cavite. Delivery details will be discussed upon order.</p>
                  </div>
                </div>

                {/* Q4 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">🚫</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">Walk-in or Same-day orders?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">No. All orders are strictly <strong>pre-order only</strong>.</p>
                  </div>
                </div>

                {/* Q5 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">👩‍🍳</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">When do you bake?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">We bake every <strong>Friday to Sunday</strong> only.</p>
                  </div>
                </div>

                {/* Q6 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">🚚</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">When is delivery?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Deliveries are scheduled <strong>Monday to Wednesday</strong> after baking.</p>
                  </div>
                </div>

                {/* Q7 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">❄️</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">Why no delivery on baking days?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">To ensure quality, proper cooling, and safe transport of baked goods.</p>
                  </div>
                </div>

                {/* Q8 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">🏃</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">Do you accept rush orders?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Rush orders depend on availability. Feel free to message us and ask!</p>
                  </div>
                </div>

                {/* Q9 */}
                <div className="flex gap-3 items-start p-3 hover:bg-white rounded-xl transition-colors">
                  <div className="text-2xl pt-1">🤝</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1 leading-tight">Do you do meet-ups?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Meet-ups may be available depending on schedule and location.</p>
                  </div>
                </div>

              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-8 focus:outline-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-3xl mx-auto border-2 border-dashed border-rose-200">
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-8 text-center">Policies & Payment</h2>
              <div className="space-y-8 text-gray-700">
                <div className="bg-rose-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-red-700 mb-4 border-b border-rose-200 pb-2">Payment Policy</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>50% Downpayment</strong> is required to confirm your slot.</li>
                    <li>Balance must be paid upon pickup/booking of delivery.</li>
                    <li>No DP = No Reservation.</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-rose-200">
                    <p className="font-bold">GCash / Maya: 09183546374</p>
                    <p className="font-bold">MariBank: *4240</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="order" className="mt-8 focus:outline-none">
            <div ref={orderFormRef} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-3xl mx-auto border-2 border-dashed border-rose-200 relative">
              {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-200/80 w-32 h-8 rotate-1 shadow-sm"></div>

              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6 text-center">Complete Your Order</h2>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧺</div>
                  <p className="text-gray-500 text-xl mb-6">Your basket is empty.</p>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                    <h3 className="font-bold text-yellow-900 mb-3 uppercase tracking-wide text-sm">Order Summary</h3>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-800 mb-2 border-b border-yellow-100 pb-2 last:border-0">
                        <span className="font-medium">{item.quantity}x {item.name}</span>
                        <span>₱{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t-2 border-dashed border-gray-300 mt-4 pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-800 mb-2">
                        <span>Total:</span>
                        <span>₱{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-red-600 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                        <span>50% Downpayment:</span>
                        <span>₱{cartTotal * 0.5}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Required to confirm slot. Balance due upon pickup.
                      </p>
                    </div>

                    {/* Payment Details with Selector */}
                    <div className="mt-6 bg-white p-5 rounded-xl border border-yellow-200 shadow-sm">
                      <p className="text-sm font-extrabold text-gray-700 mb-4 uppercase text-center tracking-wider">Select Payment Method</p>

                      {/* Payment Tabs */}
                      <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
                        {(['GCash', 'Maya', 'MariBank'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedPayment(method)}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${selectedPayment === method
                              ? 'bg-white text-red-600 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>

                      {/* Selected QR Display */}
                      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 min-h-[350px]">
                        <div className="relative w-full max-w-[280px] aspect-square bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mx-auto">
                          {/* Crop bottom text by anchoring to TOP and setting fixed height/cover */}
                          {selectedPayment === 'GCash' && <img src="/assets/qr_gcash.png" alt="GCash QR" className="w-full h-full object-cover object-top" />}
                          {selectedPayment === 'Maya' && <img src="/assets/qr_maya.png" alt="Maya QR" className="w-full h-full object-cover object-top" />}
                          {selectedPayment === 'MariBank' && <img src="/assets/qr_maribank.png" alt="MariBank QR" className="w-full h-full object-cover object-top" />}
                        </div>
                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                          Scan with {selectedPayment}
                        </p>
                      </div>

                      <div className="text-center space-y-1 text-sm text-gray-500 mt-6 border-t border-yellow-100 pt-4">
                        <p>Total Balance Due: <span className="font-bold text-red-600 text-lg">₱{cartTotal}</span></p>
                        <p>Minimum Downpayment (50%): <span className="font-bold text-red-600 text-lg">₱{cartTotal * 0.5}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Customer Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white text-base"
                          placeholder="e.g. Juana Dela Cruz"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact / Socials</label>
                        <input
                          type="text"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white text-base"
                          placeholder="09XX... or IG Handle"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pickup Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Pickup Schedule</h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Date (Mon-Thu Only)</label>
                      <input
                        type="date"
                        required
                        min={getMinPickupDate()}
                        value={formData.pickupDate}
                        onChange={handleDateChange}
                        onKeyDown={(e) => e.preventDefault()}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white text-base"
                      />
                      <p className="text-xs text-red-500 mt-1 font-medium bg-red-50 inline-block px-2 py-1 rounded-md">
                        📅 Pickups available starting: {new Date(getMinPickupDate()).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Payment Upload Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Payment Verification</h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Attach Proof of Payment (Required)</label>
                      <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${paymentProof ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}`}>
                        <input
                          type="file"
                          accept="image/*"
                          required={!paymentProof}
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {paymentProof ? (
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-cover bg-center rounded-lg shadow-sm border border-green-200 mb-2" style={{ backgroundImage: `url(${paymentProof})` }}></div>
                            <p className="text-sm font-bold text-green-700">Screenshot Attached! ✅</p>
                            <p className="text-xs text-green-600">Tap to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-bold">Tap to upload screenshot</p>
                            <p className="text-xs">or drag and drop here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting Order...' : 'Submit Order ➝'}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">Running Shop Status Check...</p>
                </form>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Cart Summary */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            <div className="pointer-events-auto bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 flex items-center gap-6 cursor-pointer w-full max-w-md justify-between border border-white/10" onClick={() => setIsCartOpen(true)}>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{cartItemCount} Items</span>
                <span className="text-xl font-bold font-heading">₱{cartTotal}</span>
              </div>
              <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                View Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto h-[80vh] flex flex-col">
                <div className="p-6 bg-rose-50 flex justify-between items-center border-b border-rose-100">
                  <h2 className="text-2xl font-heading font-bold text-rose-900">Your Basket 🧺</h2>
                  <button onClick={() => setIsCartOpen(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-rose-100 transition-colors text-rose-900">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Your basket is empty.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                            <img src={item.image} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                            <p className="text-xs text-red-500 font-bold">{item.size}</p>
                            <p className="text-xs text-gray-500">₱{item.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold hover:bg-gray-200">-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => incrementItem(item.id)} className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold hover:bg-red-200">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">₱{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || !isShopOpen()}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isShopOpen() ? 'Proceed to Checkout' : 'Ordering Closed (Fri-Sun)'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm border-t border-dashed border-red-200 bg-white/50">
        <p className="font-heading font-bold text-red-800 text-lg mb-2">Batter Days by Charlie</p>
        <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="flex items-center gap-1 hover:text-red-600 transition-colors">
            <span>📷</span> @batterdays_bycharlie
          </a>
          <a href="#" className="flex items-center gap-1 hover:text-red-600 transition-colors">
            <span>📘</span> Batter Days by Charlie
          </a>
        </div>
        <p>&copy; 2026 Batter Days. All rights reserved.</p>
      </footer>
    </div >
  );
};

export default BatterDaysPreOrder;

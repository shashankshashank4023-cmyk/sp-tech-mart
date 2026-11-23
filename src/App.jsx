import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Box, ChevronDown, ChevronRight, Cpu, Gamepad2, Headphones, Heart, Laptop, Menu, Monitor, PackageCheck, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Star, Truck, UserRound, Wrench, X, Zap } from 'lucide-react'
import './App.css'
import { adminService, cartService, productService, orderService } from './api/services'
import { useAuth } from './context/AuthContext'
import AccountPage from './pages/AccountPage'
import AdminDashboard from './pages/AdminDashboard'
import { mapProducts } from './api/productMapper'

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const sampleProducts = [
  { id: 1, name: 'GeForce RTX 5070 Ti Gaming OC 16GB', brand: 'Gigabyte', category: 'GPUs', price: 104999, oldPrice: 119999, rating: 4.9, reviews: 128, badge: 'BESTSELLER', image: 'photo-1591488320449-011701bb6704', color: 'violet', specs: ['16GB GDDR7', 'PCIe 5.0', '3× WINDFORCE fans'] },
  { id: 2, name: 'ROG Zephyrus G16 · Core Ultra 9', brand: 'ASUS', category: 'Laptops', price: 189990, oldPrice: 219990, rating: 4.8, reviews: 84, badge: 'SAVE ₹30,000', image: 'photo-1593642632823-8f785ba67e45', color: 'blue', specs: ['Intel Core Ultra 9', 'RTX 5070 · 32GB RAM', '16″ OLED 240Hz'] },
  { id: 3, name: 'Ryzen 7 9800X3D Processor', brand: 'AMD', category: 'CPUs', price: 52990, oldPrice: 57990, rating: 5, reviews: 206, badge: 'GAMER FAVOURITE', image: 'photo-1555617981-dac3880eac6e', color: 'orange', specs: ['8 cores · 16 threads', 'Up to 5.2 GHz', 'AM5 · 120W TDP'] },
  { id: 4, name: 'Vengeance DDR5 32GB (2×16GB) 6000MHz', brand: 'Corsair', category: 'RAM', price: 10990, oldPrice: 13990, rating: 4.7, reviews: 91, badge: 'HOT DEAL', image: 'photo-1562976540-1502c2145186', color: 'cyan', specs: ['DDR5 · 6000MHz', 'CL36 · XMP 3.0', 'Matte black heat spreader'] },
  { id: 5, name: '990 PRO 2TB NVMe Gen4 SSD', brand: 'Samsung', category: 'Storage', price: 17990, oldPrice: 21990, rating: 4.9, reviews: 317, badge: 'TOP RATED', image: 'photo-1597872200969-2b65d56bd16b', color: 'green', specs: ['Read up to 7,450 MB/s', '2TB · M.2 2280', '5-year warranty'] },
  { id: 6, name: 'Odyssey G7 32″ 4K 165Hz Monitor', brand: 'Samsung', category: 'Monitors', price: 46990, oldPrice: 54990, rating: 4.6, reviews: 62, badge: 'LIMITED DEAL', image: 'photo-1527443224154-c4a3942d3acf', color: 'blue', specs: ['4K UHD · IPS', '165Hz · 1ms', 'HDR600 · Adaptive Sync'] },
  { id: 7, name: 'AORUS B850 Elite WiFi7 Motherboard', brand: 'Gigabyte', category: 'Motherboards', price: 26990, oldPrice: 29990, rating: 4.8, reviews: 43, badge: '', image: 'photo-1518770660439-4636190af475', color: 'violet', specs: ['AMD AM5 · ATX', 'Wi-Fi 7 · PCIe 5.0', '14+2+2 phases'] },
  { id: 8, name: 'RM850e 850W 80+ Gold PSU', brand: 'Corsair', category: 'PSUs', price: 10990, oldPrice: 12990, rating: 4.8, reviews: 71, badge: '', image: 'photo-1587202372775-e229f172b9d7', color: 'cyan', specs: ['850W · 80+ Gold', 'Fully modular', 'ATX 3.1 · PCIe 5.1'] },
  { id: 9, name: 'North XL Tempered Glass Cabinet', brand: 'Fractal Design', category: 'Cabinets', price: 15990, oldPrice: 17990, rating: 4.7, reviews: 54, badge: '', image: 'photo-1586023492125-27b2c045efd7', color: 'orange', specs: ['E-ATX · walnut front', '4× included fans', 'Tempered glass side'] },
  { id: 10, name: 'DeathAdder V3 Pro Wireless Mouse', brand: 'Razer', category: 'Accessories', price: 11990, oldPrice: 14990, rating: 4.7, reviews: 115, badge: '', image: 'photo-1527814050087-3793815479db', color: 'green', specs: ['58g ultra-light', 'Focus Pro 30K sensor', '90-hour battery'] },  { id: 11, name: 'ROG Strix SCAR 16 Gaming Laptop', brand: 'ASUS', category: 'Laptops', laptopType: 'Gaming', price: 279990, oldPrice: 309990, rating: 4.9, reviews: 42, badge: 'RTX 5080', image: 'photo-1593642632823-8f785ba67e45', stockQty: 8, specs: ['Intel Core Ultra 9', 'GeForce RTX 5080', '16″ 240Hz Mini LED'] },
  { id: 12, name: 'Zephyrus G14 OLED Creator Edition', brand: 'ASUS', category: 'Laptops', laptopType: 'Creator', price: 199990, oldPrice: 219990, rating: 4.8, reviews: 31, badge: 'CREATOR PICK', image: 'photo-1496181133206-80ce9b88a853', stockQty: 6, specs: ['AMD Ryzen AI 9', 'GeForce RTX 5070', '14″ OLED 3K 120Hz'] },
  { id: 13, name: 'TUF Gaming A15 · RTX 5060', brand: 'ASUS', category: 'Laptops', laptopType: 'Gaming', price: 129990, oldPrice: 144990, rating: 4.7, reviews: 63, badge: 'TOUGH & READY', image: 'photo-1588872657578-7efd1f1555ed', stockQty: 12, specs: ['AMD Ryzen 7', 'GeForce RTX 5060', '15.6″ FHD 165Hz'] },
  { id: 14, name: 'Legion Pro 7i · RTX 5080', brand: 'Lenovo', category: 'Laptops', laptopType: 'Gaming', price: 269990, oldPrice: 299990, rating: 4.9, reviews: 29, badge: 'PRO GAMING', image: 'photo-1603302576837-37561b2e2302', stockQty: 5, specs: ['Intel Core Ultra 9', 'GeForce RTX 5080', '16″ OLED 240Hz'] },
  { id: 15, name: 'LOQ 15 · RTX 5060 Gaming Laptop', brand: 'Lenovo', category: 'Laptops', laptopType: 'Gaming', price: 109990, oldPrice: 124990, rating: 4.7, reviews: 78, badge: 'GAMING VALUE', image: 'photo-1593642632823-8f785ba67e45', stockQty: 16, specs: ['Intel Core i7 HX', 'GeForce RTX 5060', '15.6″ 144Hz IPS'] },
  { id: 16, name: 'OMEN 16 · Next-Gen Gaming', brand: 'HP', category: 'Laptops', laptopType: 'Gaming', price: 149990, oldPrice: 164990, rating: 4.8, reviews: 36, badge: 'OMEN GAMING', image: 'photo-1588872657578-7efd1f1555ed', stockQty: 7, specs: ['Intel Core Ultra 7', 'GeForce RTX 5070', '16″ QHD 240Hz'] },
  { id: 17, name: 'Victus 15 · RTX 4050', brand: 'HP', category: 'Laptops', laptopType: 'Gaming', price: 84990, oldPrice: 94990, rating: 4.6, reviews: 91, badge: 'ENTRY GAMING', image: 'photo-1593642632823-8f785ba67e45', stockQty: 14, specs: ['AMD Ryzen 7', 'GeForce RTX 4050', '15.6″ FHD 144Hz'] },
  { id: 18, name: 'ProArt P16 OLED Creator Laptop', brand: 'ASUS', category: 'Laptops', laptopType: 'Creator', price: 249990, oldPrice: 274990, rating: 4.9, reviews: 24, badge: 'STUDIO READY', image: 'photo-1496181133206-80ce9b88a853', stockQty: 4, specs: ['AMD Ryzen AI 9 HX', 'GeForce RTX 5070', '16″ 4K OLED touch'] },
  { id: 19, name: 'Zenbook 14 OLED · Ultra-thin', brand: 'ASUS', category: 'Laptops', laptopType: 'Ultrabook', price: 109990, oldPrice: 124990, rating: 4.8, reviews: 55, badge: 'ALL-DAY LIGHT', image: 'photo-1496181133206-80ce9b88a853', stockQty: 11, specs: ['Intel Core Ultra 7', '16GB · 1TB SSD', '14″ 3K OLED touch'] },
  { id: 20, name: 'ThinkPad X1 Carbon · Business', brand: 'Lenovo', category: 'Laptops', laptopType: 'Business', price: 189990, oldPrice: 209990, rating: 4.9, reviews: 38, badge: 'BUSINESS CLASS', image: 'photo-1588872657578-7efd1f1555ed', stockQty: 6, specs: ['Intel Core Ultra 7', '32GB · 1TB SSD', '14″ 2.8K OLED'] },
  { id: 21, name: 'Yoga 9i 2-in-1 · Aura Edition', brand: 'Lenovo', category: 'Laptops', laptopType: '2-in-1', price: 169990, oldPrice: 184990, rating: 4.8, reviews: 27, badge: 'FLIP & CREATE', image: 'photo-1496181133206-80ce9b88a853', stockQty: 5, specs: ['Intel Core Ultra 7', 'Touchscreen · 360° hinge', '14″ 2.8K OLED'] },
  { id: 22, name: 'OmniBook Flip x360 14', brand: 'HP', category: 'Laptops', laptopType: '2-in-1', price: 119990, oldPrice: 134990, rating: 4.7, reviews: 19, badge: '2-IN-1', image: 'photo-1593642632823-8f785ba67e45', stockQty: 8, specs: ['Intel Core Ultra 7', 'Touchscreen · 360° hinge', '14″ 2.8K OLED'] },
  { id: 23, name: 'IdeaPad Slim 3 · Everyday Laptop', brand: 'Lenovo', category: 'Laptops', laptopType: 'Student', price: 54990, oldPrice: 61990, rating: 4.6, reviews: 105, badge: 'STUDENT PICK', image: 'photo-1588872657578-7efd1f1555ed', stockQty: 21, specs: ['AMD Ryzen 5', '16GB · 512GB SSD', '15.6″ FHD anti-glare'] },
  { id: 24, name: 'Aspire 5 · Everyday Performance', brand: 'Acer', category: 'Laptops', laptopType: 'Student', price: 59990, oldPrice: 67990, rating: 4.6, reviews: 72, badge: 'EVERYDAY VALUE', image: 'photo-1496181133206-80ce9b88a853', stockQty: 17, specs: ['Intel Core i5', '16GB · 512GB SSD', '15.6″ FHD IPS'] },
  { id: 25, name: 'Chromebook Plus 514', brand: 'Acer', category: 'Laptops', laptopType: 'Chromebook', price: 39990, oldPrice: 44990, rating: 4.5, reviews: 34, badge: 'CLOUD READY', image: 'photo-1588872657578-7efd1f1555ed', stockQty: 10, specs: ['Intel Core i3', '8GB · 256GB SSD', '14″ FHD IPS'] },
  { id: 26, name: 'MacBook Air 13″ · M4', brand: 'Apple', category: 'Laptops', laptopType: 'MacBook', price: 99900, oldPrice: 109900, rating: 4.9, reviews: 114, badge: 'SILENT POWER', image: 'photo-1517336714731-489689fd1ca8', stockQty: 9, specs: ['Apple M4 chip', '16GB unified memory', '13.6″ Liquid Retina'] },
  { id: 27, name: 'MacBook Pro 14″ · M4 Pro', brand: 'Apple', category: 'Laptops', laptopType: 'MacBook', price: 199900, oldPrice: 219900, rating: 4.9, reviews: 86, badge: 'PRO WORKFLOW', image: 'photo-1517336714731-489689fd1ca8', stockQty: 4, specs: ['Apple M4 Pro chip', '24GB unified memory', '14.2″ Liquid Retina XDR'] },
  { id: 28, name: 'Precision 5690 Mobile Workstation', brand: 'Dell', category: 'Laptops', laptopType: 'Workstation', price: 289990, oldPrice: 319990, rating: 4.8, reviews: 16, badge: 'PRO WORKSTATION', image: 'photo-1603302576837-37561b2e2302', stockQty: 3, specs: ['Intel Core Ultra 9', 'Professional RTX graphics', '16″ UHD+ creator display'] },
  { id: 29, name: 'Swift Go 14 OLED · Portable AI PC', brand: 'Acer', category: 'Laptops', laptopType: 'Ultrabook', price: 89990, oldPrice: 99990, rating: 4.7, reviews: 47, badge: 'LIGHT & QUICK', image: 'photo-1496181133206-80ce9b88a853', stockQty: 12, specs: ['Intel Core Ultra 7', '16GB · 1TB SSD', '14″ 2.8K OLED'] },
  { id: 30, name: 'Inspiron 14 · Everyday 2-in-1', brand: 'Dell', category: 'Laptops', laptopType: '2-in-1', price: 79990, oldPrice: 89990, rating: 4.6, reviews: 41, badge: 'VERSATILE', image: 'photo-1588872657578-7efd1f1555ed', stockQty: 7, specs: ['Intel Core Ultra 5', '16GB · 512GB SSD', '14″ touchscreen 2-in-1'] },
]
const categories = [
  { name: 'Laptops', icon: Laptop, sub: 'Power to go anywhere', color: 'cat-blue' },
  { name: 'GPUs', icon: Gamepad2, sub: 'Frame rates, maxed out', color: 'cat-purple' },
  { name: 'CPUs', icon: Cpu, sub: 'The heart of your build', color: 'cat-orange' },
  { name: 'RAM', icon: Zap, sub: 'More speed. More flow.', color: 'cat-green' },
  { name: 'Monitors', icon: Monitor, sub: 'See every detail', color: 'cat-cyan' },
  { name: 'Accessories', icon: Headphones, sub: 'Complete your setup', color: 'cat-pink' },
]
const buildSteps = [
  { category: 'CPUs', label: 'Processor', icon: Cpu }, { category: 'Motherboards', label: 'Motherboard', icon: Box }, { category: 'RAM', label: 'Memory', icon: Zap }, { category: 'GPUs', label: 'Graphics card', icon: Gamepad2 }, { category: 'Storage', label: 'Storage', icon: PackageCheck }, { category: 'PSUs', label: 'Power supply', icon: Zap }, { category: 'Cabinets', label: 'Cabinet', icon: Box },
]
const imageUrl = (id, width = 700) => id?.startsWith('http') ? id : `https://images.unsplash.com/${id || 'photo-1591488320449-011701bb6704'}?auto=format&fit=crop&w=${width}&q=82`

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}
function App() {
  const { user, token, isAdmin, login, register, logout } = useAuth()
  const routes = { '/': 'home', '/products': 'catalog', '/pc-builder': 'builder', '/orders': 'orders', '/admin': 'admin', '/login': 'account' }
  const [view, setView] = useState(() => routes[window.location.pathname] || 'home')
  const [storeProducts, setStoreProducts] = useState(sampleProducts)
  const [orders, setOrders] = useState([])
  const [adminRows, setAdminRows] = useState([])
  const [revenue, setRevenue] = useState(null)
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [category, setCategory] = useState('All')
  const [brand, setBrand] = useState('')
  const [catalogPage, setCatalogPage] = useState(0)
  const [catalogPages, setCatalogPages] = useState(1)
  const [apiCatalogRows, setApiCatalogRows] = useState(null)
  const [laptopType, setLaptopType] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const [selected, setSelected] = useState(null)
  const [build, setBuild] = useState({})
  const [step, setStep] = useState(0)
  const [notice, setNotice] = useState('')
  const [apiOnline, setApiOnline] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [inStock, setInStock] = useState(false)
  const [maxPrice, setMaxPrice] = useState(250000)

  useEffect(() => {
    productService.list({ page: 0, size: 100 }).then((data) => {
      const rows = Array.isArray(data) ? data : data?.content
      if (rows?.length) { setStoreProducts(mapProducts(rows)); setApiOnline(true) }
    }).catch(() => setApiOnline(false))
  }, [])

  useEffect(() => {
    if (view !== 'catalog' || !apiOnline) { setApiCatalogRows(null); return }
    const timer = window.setTimeout(() => productService.list({ category: category === 'All' ? undefined : category, brand: brand || undefined, maxPrice, inStock: inStock ? true : undefined, q: query || undefined, laptopType: category === 'Laptops' ? laptopType || undefined : undefined, page: catalogPage, size: 12 }).then((data) => { const rows = Array.isArray(data) ? data : data?.content || []; setApiCatalogRows(mapProducts(rows)); setCatalogPages(data?.totalPages || 1) }).catch(() => setApiCatalogRows(null)), 220)
    return () => window.clearTimeout(timer)
  }, [view, apiOnline, category, brand, maxPrice, inStock, query, laptopType, catalogPage])

  useEffect(() => { setCatalogPage(0) }, [category, brand, maxPrice, inStock, query, laptopType])
  useEffect(() => { if (token) cartService.get().then((remote) => setCart(remote.items.map((row) => ({ itemId: row.itemId, quantity: row.quantity, product: storeProducts.find((p) => p.id === row.productId) || { id: row.productId, name: row.name, brand: row.brand, price: Number(row.unitPrice), oldPrice: Number(row.unitPrice), image: row.imageUrl, specs: [] } })))).catch(() => {}) }, [token])

  useEffect(() => {
    const onPopState = () => setView(routes[window.location.pathname] || 'home')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (view === 'orders' && token) orderService.myOrders().then(setOrders).catch(() => setOrders([]))
  }, [view, token])

  useEffect(() => {
    if (view === 'admin' && isAdmin) {
      Promise.all([adminService.listOrders(), productService.list({ page: 0, size: 100 }), adminService.revenue()]).then(([o, p, r]) => { setOrders(o); setAdminRows(Array.isArray(p) ? p : p.content || []); setRevenue(r); setAdminError('') }).catch((e) => setAdminError(e.message))
    }
  }, [view, isAdmin])

  const visibleProducts = useMemo(() => {
    let result = (apiCatalogRows || storeProducts).filter((p) => (category === 'All' || p.category === category) && (category !== 'Laptops' || !laptopType || p.laptopType === laptopType) && (!brand || p.brand === brand) && p.price <= maxPrice && (!query || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())) && (!inStock || p.stockQty > 0))
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price)
    return result
  }, [apiCatalogRows, storeProducts, category, brand, laptopType, query, sort, maxPrice, inStock])
  const cartCount = cart.reduce((n, item) => n + item.quantity, 0)
  const total = cart.reduce((n, item) => n + item.product.price * item.quantity, 0)
  const builderTotal = Object.values(build).reduce((n, p) => n + (p?.price || 0), 0)

  async function authenticate(payload) {
    setAuthBusy(true); setAuthError('')
    try {
      const profile = payload.mode === 'register' ? await register({ name: payload.name, email: payload.email, phone: payload.phone, password: payload.password }) : await login({ email: payload.email, password: payload.password })
      if (profile?.userId) {
        try {
          const remote = await cartService.get()
          if (remote.items?.length) setCart(remote.items.map((row) => ({ itemId: row.itemId, quantity: row.quantity, product: storeProducts.find((p) => p.id === row.productId) || { id: row.productId, name: row.name, brand: row.brand, price: Number(row.unitPrice), oldPrice: Number(row.unitPrice), image: row.imageUrl, specs: [] } })))
          else for (const item of cart) await cartService.add(item.product.id, item.quantity)
        } catch { /* Use the local preview bag when the API is offline. */ }
      }
      navigate(profile?.role === 'ROLE_ADMIN' ? 'admin' : 'orders')
    } catch (e) { setAuthError(e.message || 'Sign in failed. Please try again.') }
    finally { setAuthBusy(false) }
  }

  function addToCart(product, open = true) {
    if (token) cartService.add(product.id, 1).then((remote) => setCart(remote.items.map((row) => ({ itemId: row.itemId, quantity: row.quantity, product: storeProducts.find((item) => item.id === row.productId) || { id: row.productId, name: row.name, brand: row.brand, price: Number(row.unitPrice), oldPrice: Number(row.unitPrice), image: row.imageUrl, specs: [] } })))).catch((e) => setNotice(e.message))
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      return existing ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]
    })
    setNotice(`${product.name} added to your bag`)
    window.setTimeout(() => setNotice(''), 2600)
    if (open) setCartOpen(true)
  }

  function addFullBuild() {
    Object.values(build).filter(Boolean).forEach((product) => addToCart(product, false))
    setCartOpen(true)
    setNotice('Your custom build has been added to the bag')
  }

  function updateQty(id, diff) {
    const item = cart.find((row) => row.product.id === id)
    if (token && item?.itemId) {
      const next = item.quantity + diff
      const request = next <= 0 ? cartService.remove(item.itemId) : cartService.remove(item.itemId).then(() => cartService.add(id, next))
      request.then((remote) => setCart(remote.items.map((row) => ({ itemId: row.itemId, quantity: row.quantity, product: storeProducts.find((p) => p.id === row.productId) || { id: row.productId, name: row.name, brand: row.brand, price: Number(row.unitPrice), oldPrice: Number(row.unitPrice), image: row.imageUrl, specs: [] } })))).catch((e) => setNotice(e.message))
    }
    setCart((current) => current.map((row) => row.product.id === id ? { ...row, quantity: row.quantity + diff } : row).filter((row) => row.quantity > 0))
  }

  async function checkout() {
    if (!token) { setCartOpen(false); navigate('account'); setNotice('Sign in before checking out.'); return }
    setCheckoutOpen(true)
  }

  async function startPayment() {
    if (!shippingAddress.trim()) { setNotice('Enter your shipping address to continue.'); return }
    setCheckoutBusy(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Razorpay checkout could not be loaded.')
      const result = await orderService.checkout(shippingAddress.trim())
      const payment = new window.Razorpay({ key: result.razorpayKeyId, amount: result.amount, currency: result.currency || 'INR', name: 'SP Computers', description: 'Your SP Computers order', order_id: result.razorpayOrderId,
        handler: async (response) => { try { await orderService.verifyPayment(response); setCart([]); setCartOpen(false); setCheckoutOpen(false); setNotice('Payment verified. Your order is being prepared.'); navigate('orders'); window.setTimeout(() => setNotice(''),4500) } catch (error) { setNotice(error.message || 'Payment could not be verified. Please contact support before retrying.') } },
        modal: { ondismiss: () => setNotice('Payment window closed. Your bag is still saved.') }, theme: { color: '#78912e' } })
      payment.on('payment.failed',(event)=>setNotice(event.error?.description||'Payment failed. Please try again.'))
      payment.open()
    } catch (e) { setNotice(e.message || 'Checkout needs the Spring Boot API and Razorpay credentials.'); window.setTimeout(()=>setNotice(''),4500) }
    finally { setCheckoutBusy(false) }
  }

  function navigate(next) {
    const paths = { home: '/', catalog: '/products', builder: '/pc-builder', orders: '/orders', admin: '/admin', account: '/login' }
    window.history.pushState({}, '', paths[next] || '/')
    setView(next)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <div className="app-shell">
    <div className="announcement"><span className="announcement-dot" /> INDIA'S TECH DESTINATION <span className="announcement-sep">·</span> FREE INSURED SHIPPING ON ORDERS ABOVE ₹2,000 <span className="announcement-link">SHOP NOW <ArrowRight size={12} /></span></div>
    <header className="header">
      <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={21} /></button>
      <button className="wordmark" onClick={() => navigate('home')}><span className="brand-symbol"><span /><span /><span /></span><span>SP<span className="wordmark-light">COMPUTERS</span><small>BUILD YOUR EDGE</small></span></button>
      <nav className={mobileMenu ? 'main-nav open' : 'main-nav'}>
        <button className={view === 'catalog' ? 'nav-active' : ''} onClick={() => { setCategory('All'); navigate('catalog') }}>Shop all</button>
        <button onClick={() => navigate('catalog')}>Components <ChevronDown size={13} /></button>
        <button onClick={() => navigate('builder')}>PC builder <span className="new-pill">NEW</span></button>
        <button onClick={() => { setCategory('Laptops'); navigate('catalog') }}>Laptops</button>
        <button onClick={() => navigate('orders')}>Track order</button>
        {isAdmin && <button onClick={() => navigate('admin')}>Admin</button>}
      </nav>
      <div className="header-actions"><button className="account-button" onClick={() => navigate(user ? (isAdmin ? 'admin' : 'orders') : 'account')}><UserRound size={16}/><span>{user?.name?.split(' ')[0] || 'Sign in'}</span></button><label className="search-box"><Search size={17} /><input value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value && view !== 'catalog') navigate('catalog') }} placeholder="Search components..." /><kbd>⌘ K</kbd></label><button className="icon-button wishlist" aria-label="Wishlist"><Heart size={19} /></button><button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}</button></div>
    </header>
    {apiOnline && <div className="api-status"><span /> Live store connected</div>}

    {view === 'home' && <>
      <main>
        <section className="hero wrap">
          <div className="hero-copy"><div className="eyebrow"><Sparkles size={13} /> THE NEXT GENERATION IS HERE</div><h1>Built for the<br /><span>uncompromising.</span></h1><p>From first build to final frame. Find the gear that takes you further, with people who know their stuff.</p><div className="hero-ctas"><button className="button button-dark" onClick={() => { setCategory('GPUs'); navigate('catalog') }}>Explore graphics cards <ArrowRight size={16} /></button><button className="button button-link" onClick={() => navigate('builder')}>Build your PC <ArrowUpRight size={15} /></button></div><div className="hero-proof"><div className="avatar-stack"><span>A</span><span>R</span><span>S</span><span>+</span></div><span><b>12,000+</b> setups shipped across India</span><div className="proof-stars"><Star fill="currentColor" size={12} /> 4.9/5</div></div></div>
          <div className="hero-visual"><div className="hero-image" style={{ backgroundImage: `url(${imageUrl('photo-1593305841991-05c297ba4575', 1200)})` }} /><div className="hero-glow" /><div className="hero-product-tag"><div className="tag-line"><span className="live-dot" /> JUST LANDED</div><b>RTX 50 Series</b><span>Next-level performance starts here.</span><button onClick={() => { setCategory('GPUs'); navigate('catalog') }}>Explore series <ArrowRight size={13} /></button></div><div className="hero-stats"><span>UP TO</span><b>2.4×</b><span>AI PERFORMANCE</span></div><div className="hero-index">01 <span>/ 04</span></div></div>
        </section>

        <section className="category-section wrap"><div className="section-heading"><div><div className="eyebrow muted">FIND YOUR NEXT UPGRADE</div><h2>Shop by category</h2></div><button className="text-link" onClick={() => navigate('catalog')}>View all products <ArrowRight size={15} /></button></div><div className="category-grid">{categories.map(({ name, icon: Icon, sub, color }) => <button className={`category-card ${color}`} key={name} onClick={() => { setCategory(name); navigate('catalog') }}><div className="category-icon"><Icon size={23} strokeWidth={1.7} /></div><div className="category-info"><b>{name}</b><span>{sub}</span></div><ArrowUpRight className="category-arrow" size={17} /></button>)}</div></section>

        <section className="deal-section"><div className="wrap"><div className="section-heading"><div><div className="eyebrow muted">GOOD GEAR. BETTER PRICES.</div><h2>Worth the upgrade<span className="heading-period">.</span></h2></div><button className="text-link" onClick={() => navigate('catalog')}>Shop all deals <ArrowRight size={15} /></button></div><div className="product-grid">{storeProducts.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} onAdd={addToCart} onSelect={setSelected} featured={i === 0} />)}</div></div></section>

        <section className="builder-banner wrap"><div className="builder-banner-copy"><div className="eyebrow"><Wrench size={13} /> YOUR BUILD, YOUR RULES</div><h2>Dream it.<br />We’ll make it <i>boot.</i></h2><p>Pick your parts. We’ll check compatibility, build it with care, and ship it to your door.</p><button className="button button-lime" onClick={() => navigate('builder')}>Start your build <ArrowRight size={16} /></button></div><div className="builder-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="builder-chip"><Cpu size={89} strokeWidth={1.1} /><span>YOUR BUILD<br />STARTS HERE</span></div><div className="floating-part fp-1"><Zap size={17} /> CPU</div><div className="floating-part fp-2"><Gamepad2 size={17} /> GPU</div><div className="floating-part fp-3"><Box size={17} /> RAM</div></div><span className="builder-serial">SP CUSTOM LAB · EST. 2014</span></section>

        <section className="trust-row wrap"><Trust icon={BadgeCheck} title="Genuine. Always." text="Authorised stock with GST billing." /><Trust icon={Truck} title="Safe to your door." text="Insured shipping, pan-India." /><Trust icon={ShieldCheck} title="Built to last." text="Official warranty on every part." /><Trust icon={Headphones} title="Real humans, real help." text="Talk to a builder who gets it." /></section>
      </main>
    </>}

    {view === 'catalog' && <main className="wrap catalog-page"><div className="breadcrumbs">Home <ChevronRight size={13} /> Shop <ChevronRight size={13} /> <b>{category === 'All' ? 'All products' : category}</b></div><div className="catalog-title"><div><div className="eyebrow muted">THE GOOD STUFF</div><h1>{category === 'All' ? 'Shop all gear' : category}<span className="heading-period">.</span></h1><p>Expert-picked hardware. Straight-up good prices. {visibleProducts.length} products to explore.</p></div><div className="catalog-controls"><button className="filter-toggle"><SlidersHorizontal size={16} /> Filters</button><label className="sort-control">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>{category === 'Laptops' && <div className="laptop-type-filters">{['All types','Gaming','Creator','Ultrabook','Business','2-in-1','Student','Chromebook','MacBook','Workstation'].map((type) => <button className={(type==='All types'&&!laptopType||type===laptopType)?'selected':''} key={type} onClick={()=>setLaptopType(type==='All types'?'':type)}>{type}</button>)}</div>}<div className="catalog-layout"><aside className="filters"><div className="filter-group"><h3>Category</h3>{['All', ...categories.map((c) => c.name), 'Storage'].map((c) => <button className={category === c ? 'filter-option selected' : 'filter-option'} key={c} onClick={() => setCategory(c)}>{c}<span>{c === 'All' ? storeProducts.length : storeProducts.filter((p) => p.category === c).length}</span></button>)}</div><div className="filter-group"><h3>Brand</h3><select className="brand-select" value={brand} onChange={(e)=>setBrand(e.target.value)}><option value="">All brands</option>{[...new Set(storeProducts.filter((p)=>category==='All'||p.category===category).map((p)=>p.brand))].sort().map((name)=><option key={name}>{name}</option>)}</select></div><div className="filter-group"><h3>Price range</h3><div className="price-label"><span>₹0</span><b>{money(maxPrice)}</b></div><input type="range" min="10000" max="250000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></div><div className="filter-group"><h3>Availability</h3><label className="stock-check"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only</label></div><div className="filter-help"><Headphones size={19} /><b>Need a recommendation?</b><span>Our builders know their stuff.</span><button onClick={() => navigate('builder')}>Talk to a builder <ArrowRight size={13} /></button></div></aside><div className="catalog-results"><div className="catalog-result-top"><span>Showing <b>{visibleProducts.length}</b> products</span><div className="active-filters">{category !== 'All' && <button onClick={() => setCategory('All')}>{category} <X size={12} /></button>}{query && <button onClick={() => setQuery('')}>“{query}” <X size={12} /></button>}</div></div><div className="product-grid catalog-product-grid">{visibleProducts.map((p) => <ProductCard key={p.id} product={p} onAdd={addToCart} onSelect={setSelected} />)}</div>{catalogPages>1&&<div className="catalog-pagination"><button disabled={catalogPage===0} onClick={()=>setCatalogPage(catalogPage-1)}>Previous</button><span>Page {catalogPage+1} of {catalogPages}</span><button disabled={catalogPage+1>=catalogPages} onClick={()=>setCatalogPage(catalogPage+1)}>Next</button></div>}{visibleProducts.length === 0 && <div className="empty-state"><Search size={27} /><h3>No gear found</h3><p>Try another search or category.</p><button className="button button-dark" onClick={() => { setCategory('All'); setQuery(''); setMaxPrice(250000) }}>Clear filters</button></div>}</div></div></main>}

    {view === 'builder' && <main className="wrap builder-page"><div className="breadcrumbs">Home <ChevronRight size={13} /> PC Builder</div><div className="builder-title"><div><div className="eyebrow"><Wrench size={13} /> SP CUSTOM LAB</div><h1>Make it <i>yours.</i></h1><p>Seven steps to your next favourite machine. We’ll make sure every part plays nice.</p></div><div className="build-total"><span>YOUR BUILD TOTAL</span><b>{money(builderTotal)}</b><small>Inclusive of GST</small></div></div><div className="builder-progress">{buildSteps.map((s, i) => <button key={s.category} className={`progress-step ${i === step ? 'current' : ''} ${build[s.category] ? 'complete' : ''}`} onClick={() => setStep(i)}><span>{build[s.category] ? '✓' : String(i + 1).padStart(2, '0')}</span>{s.label}</button>)}</div><div className="builder-layout"><section className="builder-picks"><div className="builder-pick-heading"><div><span className="eyebrow muted">STEP {String(step + 1).padStart(2, '0')} OF 07</span><h2>Choose your {buildSteps[step].label.toLowerCase()}</h2><p>Hand-picked options, checked by our build team.</p></div><div className="step-arrows"><button disabled={step === 0} onClick={() => setStep(step - 1)} aria-label="Previous step"><ArrowLeft size={16} /></button><button disabled={step === buildSteps.length - 1} onClick={() => setStep(step + 1)} aria-label="Next step"><ArrowRight size={16} /></button></div></div><div className="builder-options">{storeProducts.filter((p) => p.category === buildSteps[step].category).map((p) => <button className={`build-option ${build[p.category]?.id === p.id ? 'picked' : ''}`} key={p.id} onClick={() => { setBuild({ ...build, [p.category]: p }); if (step < buildSteps.length - 1) setStep(step + 1) }}><img src={imageUrl(p.image, 160)} alt="" /><div><small>{p.brand}</small><b>{p.name}</b><span>{p.specs.slice(0, 2).join(' · ')}</span></div><strong>{money(p.price)}</strong><span className="option-plus">{build[p.category]?.id === p.id ? '✓' : '+'}</span></button>)}{!storeProducts.some((p) => p.category === buildSteps[step].category) && <div className="empty-state"><Cpu size={26} /><p>Options are being updated. Check back shortly.</p></div>}</div></section><aside className="build-summary"><div className="summary-top"><span>YOUR BUILD</span><b>{Object.values(build).filter(Boolean).length}/7 PARTS</b></div>{buildSteps.map((s) => <div className="summary-part" key={s.category}><s.icon size={17} /><div><b>{s.label}</b><span>{build[s.category]?.name || 'Choose a component'}</span></div>{build[s.category] ? <strong>{money(build[s.category].price)}</strong> : <button onClick={() => setStep(buildSteps.indexOf(s))}>Add</button>}</div>)}<div className="summary-total"><span>Estimated total</span><b>{money(builderTotal)}</b></div><button className="button button-dark full-button" disabled={!Object.values(build).some(Boolean)} onClick={addFullBuild}>Add build to bag <ArrowRight size={16} /></button><p className="compat-note"><ShieldCheck size={15} /> Compatibility checked by our build team.</p></aside></div></main>}

    {view === 'account' && <AccountPage onSubmit={authenticate} error={authError} busy={authBusy}/>}
    {view === 'orders' && <main className="wrap orders-page"><div className="breadcrumbs">Home <ChevronRight size={13} /> My orders</div>{!token?<div className="orders-card"><div className="order-icon"><PackageCheck size={28}/></div><div className="eyebrow muted">YOUR SP COMPUTERS ACCOUNT</div><h1>Track your gear.</h1><p>Sign in to see order updates from the build bench to your doorstep.</p><button className="button button-dark" onClick={()=>navigate('account')}>Sign in to your account <ArrowRight size={16}/></button></div>:<><div className="orders-heading"><div><div className="eyebrow muted">ORDER HISTORY</div><h1>My orders<span className="heading-period">.</span></h1></div><div className="orders-actions"><button className="admin-refresh" onClick={()=>orderService.myOrders().then(setOrders).catch(e=>setNotice(e.message))}>Refresh</button><button className="account-switch" onClick={()=>{logout();navigate('home')}}>Sign out</button></div></div>{orders.length===0?<div className="orders-empty"><PackageCheck size={30}/><h2>No orders yet.</h2><p>When you place an order, you’ll find its live status here.</p><button className="button button-dark" onClick={()=>navigate('catalog')}>Explore the store <ArrowRight size={15}/></button></div>:<div className="order-list">{orders.map(o=><article className="customer-order" key={o.orderId}><div className="customer-order-top"><div><span>ORDER #{o.orderId}</span><small>{new Date(o.createdAt).toLocaleDateString('en-IN')}</small></div><b>{money(o.totalAmount)}</b></div><div className="order-progress">{['PAID','PROCESSING','SHIPPED','DELIVERED'].map((status,i)=>{const current=['PAID','PROCESSING','SHIPPED','DELIVERED'].indexOf(o.orderStatus);return <div className={current>=i?'progress-done':''} key={status}><i/>{status}</div>})}{o.orderStatus==='CANCELLED'&&<span className="cancelled-status">CANCELLED</span>}</div><div className="customer-order-items">{o.items?.map((item,i)=><span key={i}>{item.productName} × {item.quantity}</span>)}</div><div className="customer-address">Delivering to: {o.shippingAddress}</div></article>)}</div>}</>}</main>}
    {view === 'admin' && (isAdmin?<AdminDashboard onNotice={(message)=>{setNotice(message);window.setTimeout(()=>setNotice(''),3000)}}/>:<main className="wrap simple-page"><div className="orders-card"><div className="order-icon"><ShieldCheck size={28}/></div><h1>Admin access only.</h1><p>Sign in with an administrator account to manage SP Computers.</p><button className="button button-dark" onClick={()=>navigate('account')}>Sign in <ArrowRight size={15}/></button></div></main>)}

    <Footer navigate={navigate} />

    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><span className="eyebrow muted">YOUR SP COMPUTERS BAG</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button></div>{cart.length === 0 ? <div className="cart-empty"><div className="empty-bag"><ShoppingBag size={26} /></div><h3>A little room for good gear.</h3><p>Your bag’s looking empty. Let’s fix that.</p><button className="button button-dark" onClick={() => { setCartOpen(false); navigate('catalog') }}>Explore the store <ArrowRight size={15} /></button></div> : <><div className="cart-items">{cart.map(({ product, quantity }) => <div className="cart-item" key={product.id}><img src={imageUrl(product.image, 180)} alt="" /><div className="cart-item-info"><small>{product.brand}</small><b>{product.name}</b><strong>{money(product.price)}</strong><div className="qty-control"><button onClick={() => updateQty(product.id, -1)}>−</button><span>{quantity}</span><button onClick={() => updateQty(product.id, 1)}>+</button></div></div><button className="remove-item" onClick={() => updateQty(product.id, -quantity)} aria-label="Remove item"><X size={15} /></button></div>)}</div><div className="drawer-footer"><div className="shipping-note"><Truck size={16} /> <span>{total >= 2000 ? 'You’ve unlocked free insured shipping.' : `Add ${money(2000 - total)} for free shipping.`}</span></div><div className="subtotal"><span>Subtotal</span><b>{money(total)}</b></div><span className="tax-note">Inclusive of all taxes. Shipping calculated at checkout.</span>{checkoutOpen ? <div className="checkout-address"><label>Shipping address<textarea rows="3" value={shippingAddress} onChange={(e)=>setShippingAddress(e.target.value)} placeholder="House, street, city, state, PIN code" required/></label><button className="button button-dark checkout-button" disabled={checkoutBusy} onClick={startPayment}>{checkoutBusy?'Preparing secure payment…':'Pay securely'} <ArrowRight size={16}/></button><button className="continue-shopping" onClick={()=>setCheckoutOpen(false)}>Back to bag</button></div> : <button className="button button-dark checkout-button" onClick={checkout}>Continue to checkout <ArrowRight size={16} /></button>}<button className="continue-shopping" onClick={() => { setCartOpen(false); navigate('catalog') }}>Continue shopping</button></div></>}</aside></div>}

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="product-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)}><X size={20} /></button><div className="modal-image" style={{ backgroundImage: `url(${imageUrl(selected.image, 900)})` }}><span className="product-badge">{selected.badge || 'SP APPROVED'}</span></div><div className="modal-content"><span className="eyebrow muted">{selected.brand} · {selected.category}</span><h2>{selected.name}</h2><div className="rating-line"><Star fill="currentColor" size={14} /> {selected.rating} <span>({selected.reviews} reviews)</span></div><div className="modal-price">{money(selected.price)} <del>{money(selected.oldPrice)}</del></div><ul className="spec-list">{selected.specs.map((spec) => <li key={spec}><BadgeCheck size={15} /> {spec}</li>)}</ul><div className="in-stock"><span /> In stock · ready to ship</div><button className="button button-dark full-button" onClick={() => { addToCart(selected); setSelected(null) }}>Add to bag <ShoppingBag size={16} /></button><p className="tax-note">GST invoice included · Official manufacturer warranty</p></div></section></div>}
    {notice && <div className="toast"><BadgeCheck size={17} /> {notice}<button onClick={() => setNotice('')}><X size={14} /></button></div>}
  </div>
}

function ProductCard({ product, onAdd, onSelect, featured }) {
  return <article className="product-card"><button className="product-image" onClick={() => onSelect(product)} style={{ backgroundImage: `url(${imageUrl(product.image, 650)})` }} aria-label={`View ${product.name}`}><span className="product-badge">{product.badge || 'SP APPROVED'}</span><span className="image-view"><ArrowUpRight size={15} /></span></button><div className="product-meta"><span>{product.brand}</span><span><Star size={12} fill="currentColor" /> {product.rating} <small>({product.reviews})</small></span></div><button className="product-name" onClick={() => onSelect(product)}>{product.name}</button><div className="product-price"><b>{money(product.price)}</b><del>{money(product.oldPrice)}</del><span className="discount">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span></div><div className="product-card-bottom"><span className="stock-indicator"><i /> In stock</span><button className="quick-add" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={15} /> Add</button></div></article>
}
function Trust({ icon: Icon, title, text }) { return <div className="trust-item"><div className="trust-icon"><Icon size={18} /></div><div><b>{title}</b><span>{text}</span></div></div> }
function Footer({ navigate }) { return <footer className="footer"><div className="wrap footer-main"><div className="footer-brand"><button className="wordmark" onClick={() => navigate('home')}><span className="brand-symbol"><span /><span /><span /></span><span>SP<span className="wordmark-light">COMPUTERS</span><small>BUILD YOUR EDGE</small></span></button><p>Good gear changes everything.<br />Let’s find yours.</p></div><div className="footer-col"><b>Explore</b><button onClick={() => navigate('catalog')}>Shop all</button><button onClick={() => navigate('catalog')}>PC components</button><button onClick={() => navigate('builder')}>Custom PC builder</button></div><div className="footer-col"><b>Here to help</b><button onClick={() => navigate('orders')}>Track your order</button><span>Returns & warranty</span><span>Talk to an expert</span></div><div className="footer-news"><b>Stay in the loop.</b><span>New drops, build guides, and the occasional deal.</span><form onSubmit={(e) => { e.preventDefault(); alert('You’re on the list. Talk soon!') }}><input type="email" required placeholder="Your email address" /><button aria-label="Subscribe"><ArrowRight size={16} /></button></form><small>No spam. Just good stuff.</small></div></div><div className="wrap footer-bottom"><span>© 2026 SP Computers. Built for the ones who build.</span><span><ShieldCheck size={14} /> Secure checkout · GST billed · India</span></div></footer> }

export default App
















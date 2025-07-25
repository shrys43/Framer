// Main app state and navigation
const appState = createState({
    currentPage: "home",
    searchQuery: "",
    cart: [],
    user: null,
    auth: {
        email: "",
        otp: "",
        newPassword: "",
        step: "login" // login | signup | forgot | otp | reset
    },
    categories: [
        { id: "tees", name: "Tees", products: Array(8).fill().map((_, i) => ({
            id: `tee-${i+1}`,
            name: `F1 Racing Tee ${i+1}`,
            price: 39.99 + i*5,
            image: "/images/placeholder-tee.jpg"
        }))},
        { id: "jackets", name: "Jackets", products: [] },
        { id: "caps", name: "Caps", products: [] },
        { id: "accessories", name: "Accessories", products: [] },
        { id: "limited", name: "Limited Edition", products: [] }
    ]
});

// Navigation functions
function navigateTo(page) {
    appState.currentPage = page;
}

function addToCart(product) {
    const existingItem = appState.cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({ ...product, quantity: 1 });
    }
}

function updateQuantity(itemId, newQuantity) {
    const item = appState.cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            appState.cart = appState.cart.filter(item => item.id !== itemId);
        }
    }
}

// Home Page Component
const HomePage = () => {
    return (
        <Stack direction="vertical" gap={40} padding={40}>
            {/* Hero Section */}
            <Stack width="100%" height="400px" background="linear-gradient(to right, #000000, #e10600)" radius={8} align="center" justify="center">
                <Text style={{ color: "white", fontSize: 48, fontWeight: "bold" }}>F1 STREETWEAR</Text>
                <Text style={{ color: "white", fontSize: 24 }}>Race-Inspired Fashion</Text>
                <Button onClick={() => navigateTo("products")} style={{ marginTop: 20 }}>SHOP NOW</Button>
            </Stack>
            
            {/* Categories Section */}
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Shop by Category</Text>
            <Grid columns={5} gap={20}>
                {appState.categories.map((category, index) => (
                    <Stack key={category.id} height="200px" background="#f5f5f5" radius={8} align="center" justify="center" onClick={() => index === 0 ? navigateTo("category") : null}>
                        <Text style={{ fontWeight: "bold" }}>{category.name}</Text>
                        {index === 0 && <Text style={{ fontSize: 12, marginTop: 8 }}>Click to view</Text>}
                    </Stack>
                ))}
            </Grid>
        </Stack>
    );
};

// Category Page Component
const CategoryPage = () => {
    const category = appState.categories[0]; // First category only
    const filteredProducts = category.products.filter(product => 
        product.name.toLowerCase().includes(appState.searchQuery.toLowerCase())
    );
    
    return (
        <Stack direction="vertical" gap={20} padding={40}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>{category.name}</Text>
            
            {filteredProducts.length === 0 ? (
                <Text>No products found matching your search.</Text>
            ) : (
                <Grid columns={4} gap={20}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Grid>
            )}
        </Stack>
    );
};

// Product Card Component (Reusable)
const ProductCard = ({ product }) => {
    return (
        <Stack direction="vertical" gap={10} onClick={() => {
            appState.currentProduct = product;
            navigateTo("product");
        }}>
            <Image src={product.image} width="100%" height="200px" radius={8} />
            <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
            <Text>${product.price.toFixed(2)}</Text>
        </Stack>
    );
};

// Product Page Component
const ProductPage = () => {
    const product = appState.currentProduct;
    
    return (
        <Stack direction="vertical" gap={20} padding={40}>
            <Stack direction="horizontal" gap={40}>
                <Image src={product.image} width="400px" height="400px" radius={8} />
                <Stack direction="vertical" gap={20} width="50%">
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>{product.name}</Text>
                    <Text style={{ fontSize: 20 }}>${product.price.toFixed(2)}</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
                    <Button onClick={() => addToCart(product)}>ADD TO CART</Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

// Cart Page Component
const CartPage = () => {
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return (
        <Stack direction="vertical" gap={20} padding={40}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Your Cart</Text>
            
            {appState.cart.length === 0 ? (
                <Text>Your cart is empty</Text>
            ) : (
                <>
                    {appState.cart.map(item => (
                        <Stack key={item.id} direction="horizontal" gap={20} align="center">
                            <Image src={item.image} width="80px" height="80px" radius={8} />
                            <Stack direction="vertical" grow={1}>
                                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                                <Text>${item.price.toFixed(2)}</Text>
                            </Stack>
                            <Stack direction="horizontal" gap={10} align="center">
                                <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                                <Text>{item.quantity}</Text>
                                <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                            </Stack>
                        </Stack>
                    ))}
                    
                    <Stack direction="horizontal" justify="space-between" style={{ marginTop: 20 }}>
                        <Text style={{ fontWeight: "bold" }}>Subtotal:</Text>
                        <Text style={{ fontWeight: "bold" }}>${subtotal.toFixed(2)}</Text>
                    </Stack>
                    
                    <Button onClick={() => navigateTo("checkout")} style={{ marginTop: 20 }}>PROCEED TO CHECKOUT</Button>
                </>
            )}
        </Stack>
    );
};

// Authentication Pages
const AuthPage = () => {
    const { step } = appState.auth;
    
    return (
        <Stack direction="vertical" gap={20} padding={40} width="400px" margin="0 auto">
            {step === "login" && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Login</Text>
                    <Input placeholder="Email" type="email" onChange={e => appState.auth.email = e.target.value} />
                    <Input placeholder="Password" type="password" />
                    <Button>LOGIN</Button>
                    <Text style={{ textAlign: "center", cursor: "pointer" }} onClick={() => appState.auth.step = "signup"}>Create an account</Text>
                    <Text style={{ textAlign: "center", cursor: "pointer" }} onClick={() => appState.auth.step = "forgot"}>Forgot password?</Text>
                </>
            )}
            
            {step === "signup" && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Sign Up</Text>
                    <Input placeholder="Email" type="email" onChange={e => appState.auth.email = e.target.value} />
                    <Input placeholder="Password" type="password" />
                    <Input placeholder="Confirm Password" type="password" />
                    <Button>SIGN UP</Button>
                    <Text style={{ textAlign: "center", cursor: "pointer" }} onClick={() => appState.auth.step = "login"}>Already have an account? Login</Text>
                </>
            )}
            
            {step === "forgot" && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Reset Password</Text>
                    <Input placeholder="Email" type="email" onChange={e => appState.auth.email = e.target.value} />
                    <Button onClick={() => {
                        // In a real app, send OTP to email
                        appState.auth.step = "otp";
                    }}>SEND OTP</Button>
                    <Text style={{ textAlign: "center", cursor: "pointer" }} onClick={() => appState.auth.step = "login"}>Back to login</Text>
                </>
            )}
            
            {step === "otp" && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Enter OTP</Text>
                    <Text>We sent a code to {appState.auth.email}</Text>
                    <Input placeholder="OTP" onChange={e => appState.auth.otp = e.target.value} />
                    <Button onClick={() => {
                        // In a real app, verify OTP
                        appState.auth.step = "reset";
                    }}>VERIFY OTP</Button>
                </>
            )}
            
            {step === "reset" && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>New Password</Text>
                    <Input placeholder="New Password" type="password" onChange={e => appState.auth.newPassword = e.target.value} />
                    <Input placeholder="Confirm New Password" type="password" />
                    <Button onClick={() => {
                        // In a real app, update password
                        appState.auth.step = "login";
                    }}>UPDATE PASSWORD</Button>
                </>
            )}
        </Stack>
    );
};

// Header Component (Reusable)
const Header = () => {
    return (
        <Stack direction="horizontal" padding={20} justify="space-between" align="center" width="100%" background="#f5f5f5">
            <Text style={{ fontSize: 20, fontWeight: "bold", cursor: "pointer" }} onClick={() => navigateTo("home")}>F1 STREETWEAR</Text>
            
            <Stack direction="horizontal" gap={20} align="center">
                {appState.currentPage === "category" && (
                    <Input 
                        placeholder="Search products..." 
                        value={appState.searchQuery}
                        onChange={e => appState.searchQuery = e.target.value}
                        style={{ width: "200px" }}
                    />
                )}
                <Icon name="user" onClick={() => navigateTo("auth")} />
                <Stack direction="horizontal" onClick={() => navigateTo("cart")} align="center" gap={5}>
                    <Icon name="shopping-cart" />
                    {appState.cart.length > 0 && (
                        <Text style={{ background: "red", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                            {appState.cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </Text>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};

// Main App Component
const App = () => {
    return (
        <Stack direction="vertical" width="100%" height="100%">
            <Header />
            
            {appState.currentPage === "home" && <HomePage />}
            {appState.currentPage === "category" && <CategoryPage />}
            {appState.currentPage === "product" && <ProductPage />}
            {appState.currentPage === "cart" && <CartPage />}
            {appState.currentPage === "auth" && <AuthPage />}
        </Stack>
    );
};

// Render the app
render(<App />);

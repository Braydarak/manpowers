import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import productsService, { type Product } from "../services/productsService";
import emailjs from "@emailjs/browser";
import {
  Minus,
  Plus,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Trash2,
  History,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import ComercialHeader from "../components/comercialHeader";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  company?: string;
  callPreference?: string;
}

interface Order {
  date: string;
  agent: string;
  total: number;
  customer: CustomerData;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  filename?: string;
}

const Comercial: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [view, setView] = useState<"products" | "orders" | "checkout">(
    "products",
  );
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    company: "",
    callPreference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    // Check if previously logged in (optional persistence)
    // For now, we stick to session state
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      productsService.getProducts().then((data) => {
        setProducts(data);
      });
    }
  }, [isLoggedIn]);

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const url = isAdmin
        ? "https://manpowers.es/backend/get_orders.php"
        : `https://manpowers.es/backend/get_orders.php?agent=${username}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [isAdmin, username]);

  useEffect(() => {
    if (view === "orders" && isLoggedIn) {
      fetchOrders();
    }
  }, [view, isLoggedIn, fetchOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://manpowers.es/backend/comercial.php",
      );

      if (response.ok) {
        const users = await response.json();
        const userList = Array.isArray(users) ? users : users.users || [];

        const validUser = userList.find(
          (u: { username: string; password: string; role?: string }) =>
            u.username === username && u.password === password,
        );

        if (validUser) {
          setIsLoggedIn(true);
          if (validUser.role === "admin") {
            setIsAdmin(true);
            setView("orders");
          } else {
            setIsAdmin(false);
          }
          return;
        }
      } else {
        console.warn(
          "Backend PHP no disponible, usando validación local de respaldo.",
        );
        if (username === "comercial" && password === "manpowers2024") {
          setIsLoggedIn(true);
          setIsAdmin(false);
          return;
        }
        if (username === "admin" && password === "manpowersAdmin2024") {
          setIsLoggedIn(true);
          setIsAdmin(true);
          setView("orders");
          return;
        }
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      if (username === "comercial" && password === "manpowers2024") {
        setIsLoggedIn(true);
        setIsAdmin(false);
        return;
      }
      if (username === "admin" && password === "manpowersAdmin2024") {
        setIsLoggedIn(true);
        setIsAdmin(true);
        setView("orders");
        return;
      }
    }

    setError("Usuario o contraseña incorrectos");
  };

  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 0) return;
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const calculateTotal = () => {
    return products.reduce((acc, product) => {
      const qty = quantities[product.id] || 0;
      const price = product.comercial_price || product.price;
      return acc + price * qty;
    }, 0);
  };

  const totalItems = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  const getSelectedProducts = () => {
    return products
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({
        ...p,
        quantity: quantities[p.id],
      }));
  };

  // Group products by category for better organization
  const groupedProducts = products.reduce(
    (acc, product) => {
      const category =
        typeof product.category === "string"
          ? product.category
          : product.category.es; // Default to ES for commercial view

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as { [key: string]: Product[] },
  );

  const handleConfirmOrder = async () => {
    if (!customerData.name || !customerData.phone || !customerData.address)
      return;

    setIsSubmitting(true);

    const selectedProducts = getSelectedProducts().map((p) => ({
      id: p.id,
      name: p.name.es,
      quantity: p.quantity,
      price: p.comercial_price || p.price,
      total: (p.comercial_price || p.price) * p.quantity,
    }));

    const orderData = {
      customer: customerData,
      products: selectedProducts,
      total: calculateTotal(),
      date: new Date().toISOString(),
      agent: username,
    };

    try {
      const response = await fetch(
        "https://manpowers.es/backend/save_order.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      if (response.ok) {
        // Send email via EmailJS
        try {
          const productsHtml = selectedProducts
            .map(
              (p) => `
                <tr>
                    <td>${p.name}</td>
                    <td style="text-align: center;">${p.quantity}</td>
                    <td style="text-align: right;">${p.price.toFixed(2)} €</td>
                    <td style="text-align: right;">${p.total.toFixed(2)} €</td>
                </tr>
            `,
            )
            .join("");

          const templateParams = {
            agent: username,
            date: new Date().toLocaleString(),
            customer_name: customerData.name,
            customer_company: customerData.company || "N/A",
            customer_email: customerData.email || "N/A",
            customer_phone: customerData.phone,
            customer_address: customerData.address,
            call_preference: customerData.callPreference || "Indiferente",
            customer_notes: customerData.notes || "Sin notas",
            products_list: productsHtml,
            total_order: calculateTotal().toFixed(2),
          };

          await emailjs.send(
            "service_bpquuvf",
            "template_mvqiigl",
            templateParams,
            "VbS91pBRVJyfs4wc9",
          );
          alert("Pedido guardado y enviado por correo correctamente.");
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          alert(
            "Pedido guardado en servidor, pero hubo un error al enviar el correo.",
          );
        }

        setQuantities({});
        setCustomerData({
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
          company: "",
          callPreference: "",
        });
        setView("products");
      } else {
        const errorData = await response.json();
        alert(
          "Error al guardar el pedido: " +
            (errorData.error || "Error desconocido"),
        );
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error de conexión al intentar guardar el pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white font-sans">
        <Header />
        <main className="flex-grow pt-32 pb-10 px-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-yellow-500/10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white">
                Acceso Comercial
              </h1>
              <p className="text-gray-400 text-sm">
                Introduce tus credenciales para gestionar pedidos
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario asignado"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-500/20"
              >
                ACCEDER AL PANEL
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Admin View - Only show orders
  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white font-sans">
        <ComercialHeader
          onLogout={() => setIsLoggedIn(false)}
          onOrdersClick={() => {}} // Already in orders view
        />
        <main className="flex-grow pt-32 pb-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="text-yellow-500">
                <History />
              </span>
              Panel de Administración - Todos los Pedidos
            </h2>

            {isLoadingOrders ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-yellow-500" size={48} />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No hay pedidos registrados en el sistema.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-yellow-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-800 gap-4">
                      <div>
                        <div className="text-lg font-bold text-white mb-1">
                          {order.customer.name}
                        </div>
                        {order.customer.company && (
                          <div className="text-sm text-yellow-500 font-medium mb-1">
                            {order.customer.company}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Comercial:{" "}
                          <span className="text-yellow-500 font-bold">
                            {order.agent}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {order.total.toFixed(2)}€
                          </div>
                          <div className="text-xs text-green-500 font-medium bg-green-900/20 px-2 py-1 rounded-full inline-block mt-1">
                            Confirmado
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>📞</span> {order.customer.phone}
                        </div>
                        {order.customer.email && (
                          <div className="flex items-center gap-2">
                            <span>✉️</span> {order.customer.email}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>📍</span> {order.customer.address}
                        </div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
                        <div className="text-xs text-gray-500 mb-2 uppercase font-bold">
                          Resumen
                        </div>
                        {order.products.map((p, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-300 mb-1"
                          >
                            <span>
                              {p.quantity}x {p.name}
                            </span>
                            <span>{(p.price * p.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      <ComercialHeader
        onLogout={() => setIsLoggedIn(false)}
        onOrdersClick={() => setView("orders")}
      />
      <main className="flex-grow pt-28 pb-32 px-4 container mx-auto max-w-7xl">
        {view === "orders" ? (
          <div className="flex flex-col items-center py-10 min-h-[50vh] w-full">
            <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <History className="text-yellow-500" /> Historial de Pedidos
              </h2>
              <button
                onClick={() => setView("products")}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Volver
              </button>
            </div>

            {isLoadingOrders ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2
                  className="animate-spin text-yellow-500 mb-4"
                  size={48}
                />
                <p className="text-gray-400">Cargando pedidos...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/50 rounded-2xl w-full max-w-2xl border border-gray-800">
                <div className="text-gray-600 mb-4 flex justify-center">
                  <History size={64} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No hay pedidos registrados
                </h3>
                <p className="text-gray-400 mb-8">
                  Aún no has realizado ningún pedido con este usuario.
                </p>
                <button
                  onClick={() => setView("products")}
                  className="px-8 py-3 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
                >
                  REALIZAR PEDIDO
                </button>
              </div>
            ) : (
              <div className="w-full max-w-4xl space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-800 pb-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          {new Date(order.date).toLocaleDateString()} -{" "}
                          {new Date(order.date).toLocaleTimeString()}
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {order.customer.name}
                        </h3>
                        {order.customer.company && (
                          <div className="text-sm text-yellow-500">
                            {order.customer.company}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {order.total.toFixed(2)} €
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.products.length} productos
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>📞</span> {order.customer.phone}
                        </div>
                        {order.customer.email && (
                          <div className="flex items-center gap-2">
                            <span>✉️</span> {order.customer.email}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>📍</span> {order.customer.address}
                        </div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
                        <div className="text-xs text-gray-500 mb-2 uppercase font-bold">
                          Resumen
                        </div>
                        {order.products.map((p, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-300 mb-1"
                          >
                            <span>
                              {p.quantity}x {p.name}
                            </span>
                            <span>{(p.price * p.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === "checkout" ? (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setView("products")}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} /> Volver al catálogo
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Formulario */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
                  <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                    <span className="text-yellow-500">📝</span> Datos del
                    Cliente
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Ej: Juan Pérez"
                        value={customerData.name}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Empresa / Comercio (Opcional)
                      </label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Ej: Gimnasio Hércules"
                        value={customerData.company}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Ej: 600 000 000"
                        value={customerData.phone}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Preferencia Hora de Llamada (Opcional)
                      </label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Ej: Por la mañana, 10:00 - 14:00"
                        value={customerData.callPreference}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            callPreference: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email (Opcional)
                      </label>
                      <input
                        type="email"
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="cliente@email.com"
                        value={customerData.email}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Dirección de Envío
                      </label>
                      <textarea
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none h-24"
                        placeholder="Calle, Número, Ciudad, CP..."
                        value={customerData.address}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Notas Adicionales
                      </label>
                      <textarea
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none h-20"
                        placeholder="Instrucciones especiales..."
                        value={customerData.notes}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen Final */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl sticky top-32">
                  <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                    <span className="text-yellow-500">🛒</span> Resumen Final
                  </h2>

                  <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {getSelectedProducts().map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center text-sm bg-black/30 p-3 rounded-lg border border-gray-800"
                      >
                        <div className="flex-grow">
                          <div className="text-white font-medium">
                            {p.name.es}
                          </div>
                          <div className="text-gray-500 text-xs">
                            x{p.quantity}
                          </div>
                        </div>
                        <div className="text-yellow-400 font-bold whitespace-nowrap">
                          {(
                            (p.comercial_price || p.price) * p.quantity
                          ).toFixed(2)}{" "}
                          €
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-800 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-white">Total a Pagar</span>
                      <span className="text-yellow-400">
                        {calculateTotal().toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !customerData.name ||
                      !customerData.phone ||
                      !customerData.address ||
                      isSubmitting
                    }
                    onClick={handleConfirmOrder}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Check size={20} />
                    )}
                    {isSubmitting ? "ENVIANDO..." : "CONFIRMAR PEDIDO"}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    * Todos los campos son obligatorios excepto email, empresa,
                    preferencia horaria y notas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <span className="text-yellow-500">⚡</span> Panel Comercial
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Selecciona los productos para el pedido
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products List */}
              <div className="lg:col-span-2 space-y-8">
                {Object.entries(groupedProducts).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h2 className="text-xl font-bold text-yellow-500 uppercase tracking-wider border-b border-gray-800 pb-2">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {items.map((product) => (
                        <div
                          key={product.id}
                          className={`
                        relative bg-gray-900/60 border rounded-xl overflow-hidden transition-all duration-300
                        ${
                          (quantities[product.id] || 0) > 0
                            ? "border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                            : "border-gray-800 hover:border-gray-700"
                        }
                      `}
                        >
                          <div className="flex p-4 gap-4">
                            <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name.es}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-white leading-tight mb-1">
                                  {product.name.es}
                                </h3>
                              </div>
                              <div className="flex justify-between items-end mt-2">
                                <span className="text-lg font-bold text-yellow-400">
                                  {(
                                    product.comercial_price || product.price
                                  ).toFixed(2)}{" "}
                                  €
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Controls Footer */}
                          <div className="bg-black/40 p-3 border-t border-gray-800/50 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {(quantities[product.id] || 0) > 0
                                ? "Cantidad:"
                                : "Añadir:"}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  (quantities[product.id] || 0) > 0
                                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                                    : "bg-gray-900 text-gray-600 cursor-not-allowed"
                                }`}
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    (quantities[product.id] || 0) - 1,
                                  )
                                }
                                disabled={(quantities[product.id] || 0) === 0}
                              >
                                <Minus size={14} />
                              </button>

                              <input
                                type="number"
                                min="0"
                                className={`w-12 bg-transparent text-center font-bold focus:outline-none focus:ring-1 focus:ring-yellow-500/50 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                                  (quantities[product.id] || 0) > 0
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                                value={quantities[product.id] || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  handleQuantityChange(
                                    product.id,
                                    isNaN(val) ? 0 : val,
                                  );
                                }}
                                onFocus={(e) => e.target.select()}
                              />

                              <button
                                className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition-colors shadow-lg shadow-yellow-500/20"
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    (quantities[product.id] || 0) + 1,
                                  )
                                }
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Sidebar Summary */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-32 shadow-2xl">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShoppingCart className="text-yellow-500" /> Resumen del
                    Pedido
                  </h2>

                  <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {getSelectedProducts().length > 0 ? (
                      getSelectedProducts().map((p) => (
                        <div
                          key={p.id}
                          className="flex justify-between items-start text-sm bg-black/30 p-3 rounded-lg border border-gray-800"
                        >
                          <div className="flex-grow">
                            <div className="text-white font-medium">
                              {p.name.es}
                            </div>
                            <div className="text-gray-500 text-xs">
                              x{p.quantity} unidad{p.quantity > 1 ? "es" : ""}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-yellow-400 font-bold">
                              {(p.price * p.quantity).toFixed(2)} €
                            </span>
                            <button
                              onClick={() => handleQuantityChange(p.id, 0)}
                              className="text-gray-600 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
                        <ShoppingCart
                          size={32}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p>No hay productos seleccionados</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-800 pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Productos</span>
                      <span className="text-white font-bold">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-yellow-400 font-bold">
                        {calculateTotal().toFixed(2)} €
                      </span>
                    </div>
                    <button
                      className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 transform active:scale-95"
                      disabled={calculateTotal() === 0}
                      onClick={() => setView("checkout")}
                    >
                      SIGUIENTE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile Sticky Footer Summary */}
      {view === "products" && (
        <>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            {/* Expanded Summary Drawer */}
            {showOrderSummary && (
              <div className="absolute bottom-full left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-2xl shadow-2xl p-4 max-h-[70vh] overflow-y-auto animate-slide-up">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-2 border-b border-gray-800">
                  <h3 className="font-bold text-white">Detalle del Pedido</h3>
                  <button
                    onClick={() => setShowOrderSummary(false)}
                    className="p-2 bg-gray-800 rounded-full"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {getSelectedProducts().length > 0 ? (
                    getSelectedProducts().map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center text-sm bg-black/30 p-3 rounded-lg"
                      >
                        <div className="flex-grow pr-4">
                          <div className="text-white font-medium">
                            {p.name.es}
                          </div>
                          <div className="text-gray-500 text-xs">
                            x{p.quantity}
                          </div>
                        </div>
                        <div className="text-yellow-400 font-bold whitespace-nowrap">
                          {(p.price * p.quantity).toFixed(2)} €
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Carrito vacío
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Collapsed Bar */}
            <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-4 pb-safe shadow-2xl">
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setShowOrderSummary(!showOrderSummary)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl flex items-center justify-between px-4 transition-colors"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      {totalItems} items{" "}
                      <ChevronUp
                        size={12}
                        className={`transition-transform ${showOrderSummary ? "rotate-180" : ""}`}
                      />
                    </span>
                    <span className="font-bold text-lg text-yellow-400">
                      {calculateTotal().toFixed(2)} €
                    </span>
                  </div>
                </button>

                <button
                  className="flex-[1.5] bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:grayscale transition-all"
                  disabled={calculateTotal() === 0}
                  onClick={() => setView("checkout")}
                >
                  SIGUIENTE
                </button>
              </div>
            </div>
          </div>

          {/* Overlay when drawer is open */}
          {showOrderSummary && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setShowOrderSummary(false)}
            />
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Comercial;

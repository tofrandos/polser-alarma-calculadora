import React, { useState, useEffect } from "react";

// --- DATOS ESTÁTICOS (SOLO TARIFAS BASE Y OPCIONES) ---
const baseRates = {
  particular: 27.99,
  negocio: 34.99,
};

const permanenceOptions = [
  { label: "Instalación a cargo del cliente", value: 0 },
  { label: "12 meses", value: 12 },
  { label: "24 meses", value: 24 },
  { label: "36 meses", value: 36 },
  { label: "48 meses", value: 48 },
];

// --- COMPONENTES DE LA UI ---

const MaterialInput = ({ id, label, quantity, onQuantityChange }) => (
  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center bg-gray-50 p-3 rounded-lg gap-2">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onQuantityChange(id, Math.max(0, quantity - 1))}
        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-red-200 transition-colors"
        aria-label={`Disminuir ${label}`}
      >
        -
      </button>
      <input
        type="number"
        id={id}
        name={id}
        value={quantity}
        onChange={(e) =>
          onQuantityChange(id, Math.max(0, parseInt(e.target.value, 10) || 0))
        }
        className="w-16 text-center font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#ff6b00] focus:border-[#ff6b00]"
        min="0"
      />
      <button
        onClick={() => onQuantityChange(id, quantity + 1)}
        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-green-200 transition-colors"
        aria-label={`Aumentar ${label}`}
      >
        +
      </button>
    </div>
  </div>
);

const CustomerTypeSelector = ({ customerType, setCustomerType }) => (
  <div className="flex justify-center p-1 bg-gray-200 rounded-full mb-8">
    {["particular", "negocio"].map((type) => (
      <button
        key={type}
        onClick={() => setCustomerType(type)}
        className={`w-1/2 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 ${
          customerType === type
            ? "bg-white text-[#042149] shadow"
            : "bg-transparent text-gray-600 hover:bg-gray-100"
        }`}
      >
        {type === "particular" ? "👤 Particulares" : "🏢 Pequeños Negocios"}
      </button>
    ))}
  </div>
);

const PermanenceSelector = ({ selected, onSelect }) => (
  <div className="space-y-3">
    {permanenceOptions.map(({ label, value }) => (
      <div
        key={value}
        onClick={() => onSelect(value)}
        className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
          selected === value
            ? "bg-orange-50 border-[#ff6b00] shadow-md"
            : "bg-white border-gray-200 hover:border-[#ff6b00]/50"
        }`}
      >
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="permanencia"
            value={value}
            checked={selected === value}
            onChange={() => onSelect(value)}
            className="h-4 w-4 text-[#ff6b00] border-gray-300 focus:ring-[#ff6b00]"
          />
          <span className="ml-3 text-sm font-medium text-gray-800">
            {label}
          </span>
        </label>
      </div>
    ))}
  </div>
);

const SummaryCard = ({ results, onGenerateQuote, isSubmitting }) => (
  <div className="bg-[#042149] text-white p-6 sm:p-8 rounded-2xl shadow-2xl lg:sticky top-8">
    <h3 className="text-2xl font-bold text-center border-b border-blue-900 pb-4 mb-6">
      Resumen del Presupuesto
    </h3>

    <div className="space-y-4 text-lg">
      <div className="flex justify-between items-baseline">
        <span className="text-blue-200">Coste Material:</span>
        <span className="font-bold text-xl sm:text-2xl">
          {results.totalMaterialCost.toFixed(2)} €
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-blue-200">Tarifa Base Mensual:</span>
        <span className="font-bold text-xl sm:text-2xl">
          {results.baseRate.toFixed(2)} €
        </span>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t-2 border-[#ff6b00] space-y-6">
      <div className="text-center">
        <p className="text-lg text-blue-200">Coste Inicial</p>
        <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {results.initialCost.toFixed(2)} €
        </p>
        {results.permanence > 0 && (
          <span className="text-sm text-[#ff6b00] font-semibold">
            ¡Instalación financiada!
          </span>
        )}
      </div>
      <div className="text-center bg-blue-900/50 p-4 rounded-lg">
        <p className="text-lg text-blue-200">Cuota Mensual Final</p>
        <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {results.monthlyCost.toFixed(2)} €
        </p>
        <p className="text-blue-300 text-sm mt-1">IVA incluido</p>
      </div>
    </div>

    <div className="mt-8">
      <button
        onClick={onGenerateQuote}
        disabled={isSubmitting}
        className="w-full bg-[#ff6b00] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {isSubmitting ? "Enviando..." : "Enviar calculo"}
      </button>
    </div>

    <p className="text-center text-xs text-blue-300 mt-8">
      * Presupuesto orientativo. La central HUB es obligatoria y está incluida
      en el coste del material.
    </p>
  </div>
);

const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;

  const baseClasses =
    "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 flex items-center z-50";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type] || "bg-gray-700"}`}>
      <span className="flex-grow">{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold text-lg">
        &times;
      </button>
    </div>
  );
};

// --- COMPONENTES DE ESTADO DE CARGA Y ERROR ---
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-700">
    <svg
      className="animate-spin -ml-1 mr-3 h-10 w-10 text-[#042149] mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="text-lg font-semibold">Cargando datos de materiales...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-700 p-4">
    <h2 className="text-2xl font-bold mb-2">Error</h2>
    <p>{message}</p>
    <p className="mt-4 text-sm">
      Por favor, refresca la página o inténtalo más tarde.
    </p>
  </div>
);

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function App() {
  const [materials, setMaterials] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customerType, setCustomerType] = useState("particular");
  const [offerName, setOfferName] = useState("");
  const [quantities, setQuantities] = useState({});
  const [permanence, setPermanence] = useState(36);
  const [results, setResults] = useState({
    totalMaterialCost: 0,
    initialCost: 0,
    monthlyCost: 0,
    baseRate: 0,
    permanence: 0,
    monthlyPermanenceCost: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Efecto para obtener los datos de los materiales desde la API al cargar la app
  useEffect(() => {
    const fetchMaterials = async () => {
      // **IMPORTANTE**: Reemplaza esta URL con tu endpoint de la API
      const API_ENDPOINT =
        "https://n8n.polser.cat/webhook/85091f4b-638d-48a3-8ab7-e3f7f8ad4924";
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(
            "No se pudo obtener la lista de materiales del servidor."
          );
        }
        const data = await response.json();
        setMaterials(data);

        const initialQuantities = Object.keys(data).reduce((acc, key) => {
          if (key !== "hub") {
            acc[key] = 0;
          }
          return acc;
        }, {});

        if ("fotodetector" in initialQuantities)
          initialQuantities.fotodetector = 2;
        if ("contacto" in initialQuantities) initialQuantities.contacto = 1;
        if ("teclado" in initialQuantities) initialQuantities.teclado = 1;

        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Efecto para recalcular el presupuesto cuando cambian las dependencias
  useEffect(() => {
    if (!materials || Object.keys(quantities).length === 0) {
      return;
    }

    const totalMaterialCost = Object.keys(quantities).reduce(
      (total, key) => {
        if (materials[key]) {
          return total + quantities[key] * materials[key].price;
        }
        return total;
      },
      materials.hub ? materials.hub.price : 0
    );

    const baseRate = baseRates[customerType];
    let initialCost = 0;
    let monthlyPermanenceCost = 0;
    const NOMINAL_ANNUAL_INTEREST = 0.07;

    if (permanence === 0) {
      initialCost = totalMaterialCost;
    } else {
      initialCost = 0;
      if (totalMaterialCost > 0) {
        const monthlyInterestRate = NOMINAL_ANNUAL_INTEREST / 12;
        const numberOfPayments = permanence;
        const principal = totalMaterialCost;
        const numerator =
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments);
        const denominator =
          Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

        if (denominator > 0) {
          monthlyPermanenceCost = principal * (numerator / denominator);
        } else {
          monthlyPermanenceCost = principal / numberOfPayments;
        }
      }
    }

    const finalMonthlyCost = baseRate + monthlyPermanenceCost;

    setResults({
      totalMaterialCost,
      initialCost,
      monthlyCost: finalMonthlyCost,
      baseRate,
      permanence,
      monthlyPermanenceCost,
    });
  }, [materials, quantities, permanence, customerType]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateQuote = async () => {
    setIsSubmitting(true);
    setNotification({ message: "", type: "" });

    let amortizationDetails = null;
    if (permanence > 0 && results.totalMaterialCost > 0) {
      const principal = results.totalMaterialCost;
      const numberOfPayments = permanence;
      const monthlyPayment = results.monthlyPermanenceCost;
      const totalPaid = monthlyPayment * numberOfPayments;
      const totalInterestPaid = totalPaid - principal;
      const annualInterestRate = 0.07;

      amortizationDetails = {
        principal: principal.toFixed(2),
        annualInterestRate: annualInterestRate,
        monthlyInterestRate: (annualInterestRate / 12).toFixed(6),
        numberOfPayments: numberOfPayments,
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        totalInterestPaid: totalInterestPaid.toFixed(2),
      };
    }

    const quoteData = {
      offerName,
      customerType,
      permanence,
      amortizationDetails,
      components: { ...quantities, hub: 1 },
      summary: results,
      timestamp: new Date().toISOString(),
    };

    const API_ENDPOINT =
      "https://n8n.polser.cat/webhook-test/42bdb8d0-bc16-4573-b80d-4cff5132b93c";

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteData),
      });
      if (!response.ok)
        throw new Error(`Error del servidor: ${response.status}`);
      setNotification({
        message: "¡Presupuesto enviado con éxito!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Error al enviar. Inténtalo más tarde.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  const materialInputs = materials
    ? Object.keys(materials).filter((key) => key !== "hub")
    : [];

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
      <Notification
        message={notification.message}
        type={notification.type}
        onDismiss={() => setNotification({ message: "", type: "" })}
      />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#042149]">
            Calculadora de tarifas de Alarma - polser.cat
          </h1>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Personaliza tu sistema de seguridad y obtén un presupuesto al
            instante.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <CustomerTypeSelector
              customerType={customerType}
              setCustomerType={setCustomerType}
            />
            <div className="mb-12">
              <label
                htmlFor="offerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la Oferta Comercial
              </label>
              <input
                type="text"
                id="offerName"
                name="offerName"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                className="w-full px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#ff6b00] focus:border-[#ff6b00]"
                placeholder="Ej: O123456"
              />
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6">
                1. Elige los componentes
              </h2>
              <div className="space-y-4">
                {materialInputs.map((key) => (
                  <MaterialInput
                    key={key}
                    id={key}
                    label={materials[key].name}
                    quantity={quantities[key] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6">
                2. Elige la financiación
              </h2>
              <PermanenceSelector
                selected={permanence}
                onSelect={setPermanence}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <SummaryCard
              results={results}
              onGenerateQuote={handleGenerateQuote}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

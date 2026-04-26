import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/NavBar/NavBar';
import Footer from "../Components/Footer";
import { useCart } from "../Context/CartContext";

const BASE_URL = "http://localhost:8081";

export default function DishDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/public/menu/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error("Failed to load item:", err));
  }, [id]);

  const hasHalf = !!item?.half_price;
  const hasFull = !!item?.full_price;
  const hasPortionOptions = hasHalf || hasFull;
  const mustChoosePortion = hasHalf && hasFull;
  const isSinglePriceItem = !hasPortionOptions;

  const currentPrice = useMemo(() => {
    if (!item) return 0;

    if (selectedSize === "HALF" && item.half_price) {
      return Number(item.half_price);
    }

    if (selectedSize === "FULL" && item.full_price) {
      return Number(item.full_price);
    }

    if (hasHalf && !hasFull) {
      return Number(item.half_price || 0);
    }

    if (hasFull && !hasHalf) {
      return Number(item.full_price || 0);
    }

    return Number(item.price || 0);
  }, [item, selectedSize, hasHalf, hasFull]);

  if (!item) {
    return (
      <div style={{ padding: 40, fontFamily: "DM Sans, sans-serif" }}>
        Loading...
      </div>
    );
  }

  const imageSrc = item.image_url
    ? `${BASE_URL}${item.image_url}`
    : "https://via.placeholder.com/700x500?text=No+Image";

  const isAvailable = item.is_available === true;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    if (mustChoosePortion && !selectedSize) {
      alert("Please select Half or Full before adding to cart.");
      return;
    }

    let finalSize = "DEFAULT";

    if (mustChoosePortion) {
      finalSize = selectedSize;
    } else if (hasHalf && !hasFull) {
      finalSize = "HALF";
    } else if (hasFull && !hasHalf) {
      finalSize = "FULL";
    }

    const cartItem = {
      ...item,
      selectedSize: finalSize,
      price: currentPrice,
      itemId: item.item_id,
      itemName:
        finalSize !== "DEFAULT"
          ? `${item.item_name} (${finalSize})`
          : item.item_name,
      imageUrl: item.image_url,
    };

    addToCart(cartItem, qty);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <div
      style={{
        background: "#fffdf8",
        minHeight: "100vh",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <style>{`
        .cart-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: linear-gradient(135deg, #d9b85f, #b8922f);
          color: white;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 700;
          box-shadow: 0 12px 30px rgba(185,146,47,0.3);
          animation: fadeSlide 0.4s ease;
          z-index: 9999;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Navbar />

      {showSuccess && (
        <div className="cart-toast">
          ✅ Item added to cart successfully!
        </div>
      )}

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "56px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div>
          <img
            src={imageSrc}
            alt={item.item_name}
            style={{
              width: "100%",
              height: 500,
              objectFit: "cover",
              borderRadius: 24,
              border: "1px solid #eadfcb",
              boxShadow: "0 12px 30px rgba(120,92,24,0.14)",
              background: "#f5f1e8",
            }}
          />
        </div>

        <div>
          <h1
            style={{
              fontSize: 52,
              margin: "0 0 14px",
              color: "#1f1a14",
              lineHeight: 1.1,
            }}
          >
            {item.item_name}
          </h1>

          <p
            style={{
              color: "#5e5548",
              lineHeight: 1.9,
              fontSize: 17,
              marginBottom: 24,
            }}
          >
            {item.description || "No description available."}
          </p>

          {hasPortionOptions && (
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#8d7a57",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 10,
                }}
              >
                Choose Portion
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {hasHalf && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize("HALF")}
                    style={{
                      minWidth: 150,
                      padding: "14px 18px",
                      borderRadius: 14,
                      border:
                        selectedSize === "HALF"
                          ? "2px solid #c9a84c"
                          : "1px solid #eadfcb",
                      background:
                        selectedSize === "HALF"
                          ? "linear-gradient(135deg, #f8edd1, #fff)"
                          : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow:
                        selectedSize === "HALF"
                          ? "0 10px 24px rgba(201,168,76,0.14)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#8d7a57",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Half
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#1f1a14",
                      }}
                    >
                      Rs. {Number(item.half_price).toFixed(2)}
                    </div>
                  </button>
                )}

                {hasFull && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize("FULL")}
                    style={{
                      minWidth: 150,
                      padding: "14px 18px",
                      borderRadius: 14,
                      border:
                        selectedSize === "FULL"
                          ? "2px solid #c9a84c"
                          : "1px solid #eadfcb",
                      background:
                        selectedSize === "FULL"
                          ? "linear-gradient(135deg, #f8edd1, #fff)"
                          : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow:
                        selectedSize === "FULL"
                          ? "0 10px 24px rgba(201,168,76,0.14)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#8d7a57",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Full
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#1f1a14",
                      }}
                    >
                      Rs. {Number(item.full_price).toFixed(2)}
                    </div>
                  </button>
                )}
              </div>

              {mustChoosePortion && !selectedSize && (
                <div
                  style={{
                    marginTop: 10,
                    color: "#b45309",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Please select a portion before adding to cart.
                </div>
              )}
            </div>
          )}

          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "#b8922f",
              marginBottom: 26,
            }}
          >
            Rs. {Number(currentPrice).toFixed(2)}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {!isSinglePriceItem && (
              <InfoCard
                label="Selected Portion"
                value={
                  mustChoosePortion
                    ? selectedSize || "Not selected"
                    : hasFull
                    ? "FULL"
                    : "HALF"
                }
              />
            )}

            <InfoCard
              label="Preparation Time"
              value={item.preparation_time ? `${item.preparation_time} mins` : "Not specified"}
            />
            <InfoCard
              label="Availability"
              value={item.is_available ? "Available" : "Not available"}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{
                width: 90,
                padding: 14,
                borderRadius: 14,
                border: "1px solid #eadfcb",
                fontSize: 16,
              }}
            />

            <button
              style={{
                border: "none",
                borderRadius: 14,
                padding: "14px 22px",
                fontWeight: 800,
                cursor: isAvailable ? "pointer" : "not-allowed",
                background: isAvailable
                  ? "linear-gradient(135deg, #d9b85f, #b8922f)"
                  : "#bdbdbd",
                color: "#fff",
                boxShadow: isAvailable
                  ? "0 10px 24px rgba(185,146,47,0.24)"
                  : "none",
                opacity: mustChoosePortion && !selectedSize ? 0.7 : 1,
              }}
              onClick={handleAddToCart}
              disabled={!isAvailable || (mustChoosePortion && !selectedSize)}
            >
              {isAvailable ? "Add to cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eadfcb",
        borderRadius: 16,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#8d7a57",
          textTransform: "uppercase",
          letterSpacing: "0.7px",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "#1f1a14",
        }}
      >
        {value}
      </div>
    </div>
  );
}
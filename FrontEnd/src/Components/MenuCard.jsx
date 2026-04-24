import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useCart } from "../Context/CartContext";

const BASE_URL = "http://localhost:8081";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const imageSrc = item.image_url
    ? `${BASE_URL}${item.image_url}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  const isAvailable = item.is_available === true;

  const hasHalf = !!item.half_price;
  const hasFull = !!item.full_price;
  const hasPortionOptions = hasHalf || hasFull;

  const finalSize = useMemo(() => {
    if (!hasPortionOptions) return "DEFAULT";
    if (hasFull) return "FULL";
    if (hasHalf) return "HALF";
    return "DEFAULT";
  }, [hasHalf, hasFull, hasPortionOptions]);

  const displayPrice = useMemo(() => {
    if (!hasPortionOptions) {
      return Number(item.price || 0);
    }

    if (finalSize === "FULL") {
      return Number(item.full_price || 0);
    }

    if (finalSize === "HALF") {
      return Number(item.half_price || 0);
    }

    return Number(item.price || 0);
  }, [item, finalSize, hasPortionOptions]);

  const handleAddToCart = () => {
    if (!isAvailable) return;

    const cartItem = {
      ...item,
      selectedSize: finalSize,
      price: displayPrice,
      itemId: item.item_id,
      itemName:
        finalSize !== "DEFAULT"
          ? `${item.item_name} (${finalSize})`
          : item.item_name,
      imageUrl: item.image_url,
    };

    addToCart(cartItem, 1);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <>
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
          width: fit-content;
          max-width: 90vw;
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

        .lux-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,249,235,0.92));
          border: 1px solid rgba(234,223,203,0.9);
          border-radius: 24px;
          box-shadow: 0 14px 30px rgba(120,92,24,0.10);
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
          font-family: "DM Sans", sans-serif;
        }

        .lux-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 38px rgba(120,92,24,0.14);
        }

        .lux-card.unavailable {
          opacity: 0.58;
          filter: grayscale(75%);
        }

        .lux-card.unavailable:hover {
          transform: translateY(-4px);
        }

        .lux-card::before {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .lux-card-image-wrap {
          overflow: hidden;
          position: relative;
        }

        .lux-card-image {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
          background: #f5f1e8;
        }

        .lux-card:hover .lux-card-image {
          transform: scale(1.06);
        }

        .lux-card-body {
          position: relative;
          z-index: 1;
          padding: 20px;
        }

        .lux-card-title {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 800;
          color: #1f1a14;
        }

        .lux-card-desc {
          margin: 0 0 16px;
          color: #5e5548;
          min-height: 48px;
          line-height: 1.75;
        }

        .lux-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .lux-price {
          font-size: 24px;
          font-weight: 800;
          color: #b8922f;
        }

        .lux-card-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .lux-view-btn-disabled {
          border-radius: 12px;
          border: 1px solid #d0d0d0;
          background: #e0e0e0;
          padding: 10px 14px;
          cursor: not-allowed;
          font-weight: 700;
          color: #777;
        }

        .lux-view-btn {
          border-radius: 12px;
          border: 1px solid #eadfcb;
          background: white;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 700;
        }

        .lux-add-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 16px;
          cursor: pointer;
          background: linear-gradient(135deg, #d9b85f, #b8922f);
          color: #fff;
          font-weight: 800;
          box-shadow: 0 10px 22px rgba(185,146,47,0.18);
        }

        .lux-add-btn:disabled {
          background: #bdbdbd;
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.95;
        }

        .lux-unavailable-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          background: rgba(80, 80, 80, 0.92);
          color: white;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.4px;
          box-shadow: 0 8px 18px rgba(0,0,0,0.18);
        }
      `}</style>

      {showSuccess && (
        <div className="cart-toast">
          ✅ Item added to cart successfully!
        </div>
      )}

      <div className={`lux-card ${!isAvailable ? "unavailable" : ""}`}>
        {!isAvailable && <div className="lux-unavailable-badge">Unavailable</div>}

        <div className="lux-card-image-wrap">
          <img src={imageSrc} alt={item.item_name} className="lux-card-image" />
        </div>

        <div className="lux-card-body">
          <h3 className="lux-card-title">{item.item_name}</h3>

          <p className="lux-card-desc">
            {item.description || "No description available."}
          </p>

          <div className="lux-card-bottom">
            <div className="lux-price">Rs. {displayPrice.toFixed(2)}</div>

            <div className="lux-card-actions">
              {isAvailable ? (
                <Link to={`/menu/${item.item_id}`}>
                  <button className="lux-view-btn">View</button>
                </Link>
              ) : (
                <button className="lux-view-btn-disabled" disabled>
                  View
                </button>
              )}

              <button
                className="lux-add-btn"
                onClick={handleAddToCart}
                disabled={!isAvailable}
              >
                {isAvailable ? "Add to cart" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
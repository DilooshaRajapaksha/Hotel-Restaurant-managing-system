import Navbar from '../Components/NavBar/NavBar';
import Footer from "../Components/Footer";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8081";

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(201,168,76,0.10), transparent 18%), linear-gradient(180deg, #fffdf8 0%, #fffaf0 100%)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <style>{`
        .cart-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 120px 24px 70px;
        }

        .cart-title {
          font-family: "Playfair Display", serif;
          font-size: 54px;
          line-height: 1.05;
          color: #1f1a14;
          margin: 0 0 12px;
        }

        .cart-sub {
          color: #6b5c45;
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 28px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1.7fr 0.9fr;
          gap: 28px;
          align-items: start;
        }

        .cart-list-card,
        .cart-summary-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(234,223,203,0.95);
          border-radius: 24px;
          box-shadow: 0 16px 34px rgba(83,62,12,0.06);
        }

        .cart-list-card {
          padding: 20px;
        }

        .cart-summary-card {
          padding: 22px;
          position: sticky;
          top: 24px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 18px;
          padding: 16px;
          border: 1px solid rgba(234,223,203,0.85);
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,249,235,0.92));
        }

        .cart-item + .cart-item {
          margin-top: 16px;
        }

        .cart-clickable {
          cursor: pointer;
        }

        .cart-clickable:hover .cart-image {
          transform: scale(1.03);
        }

        .cart-clickable:hover .cart-name {
          color: #b8922f;
        }

        .cart-image {
          width: 120px;
          height: 110px;
          object-fit: cover;
          border-radius: 16px;
          background: #f5f1e8;
          border: 1px solid rgba(234,223,203,0.9);
          transition: transform 0.25s ease;
        }

        .cart-name {
          font-size: 26px;
          font-weight: 800;
          color: #1f1a14;
          margin: 0 0 8px;
          transition: color 0.25s ease;
        }

        .cart-meta {
          color: #7a6a54;
          font-size: 14px;
          line-height: 1.7;
        }

        .cart-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px;
        }

        .cart-price {
          font-size: 26px;
          font-weight: 800;
          color: #b8922f;
        }

        .qty-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-btn {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid rgba(217,184,95,0.35);
          background: white;
          cursor: pointer;
          font-size: 20px;
          font-weight: 700;
          color: #6d5313;
        }

        .qty-value {
          min-width: 34px;
          text-align: center;
          font-weight: 800;
          color: #1f1a14;
        }

        .remove-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 14px;
          background: #f9e7e7;
          color: #b42318;
          font-weight: 800;
          cursor: pointer;
        }

        .summary-title {
          font-size: 24px;
          font-weight: 800;
          color: #1f1a14;
          margin: 0 0 18px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          color: #5f5241;
          border-bottom: 1px solid rgba(234,223,203,0.8);
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0 8px;
          font-size: 22px;
          font-weight: 800;
          color: #1f1a14;
        }

        .checkout-btn {
          width: 100%;
          margin-top: 16px;
          border: none;
          border-radius: 16px;
          padding: 15px 18px;
          background: linear-gradient(135deg, #d9b85f, #b8922f);
          color: white;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(185,146,47,0.22);
        }

        .clear-btn {
          width: 100%;
          margin-top: 12px;
          border: 1px solid rgba(234,223,203,0.95);
          border-radius: 16px;
          padding: 14px 18px;
          background: white;
          color: #5f5241;
          font-weight: 800;
          cursor: pointer;
        }

        .empty-cart {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(234,223,203,0.95);
          border-radius: 24px;
          box-shadow: 0 16px 34px rgba(83,62,12,0.06);
          padding: 54px 28px;
          text-align: center;
          color: #7d6d58;
        }

        .empty-cart h2 {
          margin: 0 0 10px;
          color: #1f1a14;
          font-size: 34px;
          font-family: "Playfair Display", serif;
        }

        .empty-shop-btn {
          margin-top: 18px;
          border: none;
          border-radius: 14px;
          padding: 14px 22px;
          background: linear-gradient(135deg, #d9b85f, #b8922f);
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .cart-bottom-action {
          text-align: center;
          margin-top: 20px;
        }

        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .cart-item {
            grid-template-columns: 1fr;
          }

          .cart-right {
            align-items: flex-start;
          }

          .cart-image {
            width: 100%;
            height: 220px;
          }
        }
      `}</style>

      <Navbar />

      <div className="cart-shell">
        <h1 className="cart-title">Your Cart</h1>
        <div className="cart-sub">
          Review your selected dishes, adjust quantities, and continue to checkout.
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <div>Add some delicious dishes and come back here.</div>
            <button className="empty-shop-btn" onClick={() => navigate("/menu/list")}>
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list-card">
              {items.map((item) => {
                const itemId = item.itemId || item.item_id;
                const itemName = item.itemName || item.item_name;
                const imageUrl = item.imageUrl || item.image_url;
                const selectedSize = item.selectedSize || "DEFAULT";
                const imageSrc = imageUrl
                  ? `${BASE_URL}${imageUrl}`
                  : "https://via.placeholder.com/400x300?text=No+Image";

                return (
                  <div
                    key={`${itemId}-${selectedSize}`}
                    className="cart-item"
                  >
                    <div
                      className="cart-clickable"
                      onClick={() => navigate(`/menu/${itemId}`)}
                      title="View product"
                    >
                      <img
                        src={imageSrc}
                        alt={itemName}
                        className="cart-image"
                      />
                    </div>

                    <div
                      className="cart-clickable"
                      onClick={() => navigate(`/menu/${itemId}`)}
                      title="View product"
                    >
                      <h3 className="cart-name">{itemName}</h3>
                      <div className="cart-meta">
                        {selectedSize !== "DEFAULT" && (
                          <div>Portion: {selectedSize}</div>
                        )}
                        <div>Unit Price: Rs. {Number(item.price || 0).toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="cart-right">
                      <div className="cart-price">
                        Rs. {Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </div>

                      <div className="qty-box">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateQty(itemId, Math.max(1, item.quantity - 1), selectedSize)
                          }
                        >
                          −
                        </button>

                        <div className="qty-value">{item.quantity}</div>

                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateQty(itemId, item.quantity + 1, selectedSize)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItem(itemId, selectedSize)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="cart-bottom-action">
                <button
                  className="empty-shop-btn"
                  onClick={() => navigate("/menu/list")}
                >
                  Explore Menu
                </button>
              </div>
            </div>

            <div className="cart-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Items</span>
                <span>{items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {Number(total).toFixed(2)}</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>Rs. {Number(total).toFixed(2)}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button
                className="clear-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
import React, { useState } from "react";

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);

  // ✅ calculate subtotal (use numeric price directly)
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setOrderPlaced(true);
    // optional: clear cart after checkout via parent
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "darkgoldenrod",
          fontSize: "50px",
          backgroundColor: "white",
          borderRadius: "20px",
        }}
      >
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "black",
            fontSize: "30px",
            backgroundColor: "white",
            borderRadius: "20px",
            width: "25%",
            position: "relative",
            left: "70vh",
          }}
        >
          <b>Your cart is empty.</b>
        </p>
      ) : (
        <>
          {/* cart table */}
          <div style={{ overflowX: "auto" }}>
            <table
  style={{
    width: "90%",
    margin: "0 auto 30px",
    borderCollapse: "collapse",
    background: "#111",
    color: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
    tableLayout: "fixed", // ✅ force equal alignment
  }}
>
  <thead>
    <tr style={{ background: "#222" }}>
      <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>
        Item
      </th>
      <th style={{ padding: "15px", textAlign: "center", width: "15%" }}>
        Price
      </th>
      <th style={{ padding: "15px", textAlign: "center", width: "20%" }}>
        Quantity
      </th>
      <th style={{ padding: "15px", textAlign: "center", width: "15%" }}>
        Total
      </th>
      <th style={{ padding: "15px", textAlign: "center", width: "20%" }}>
        Action
      </th>
    </tr>
  </thead>
  <tbody>
    {cartItems.map((item, index) => (
      <tr
        key={index}
        style={{
          borderBottom: "1px solid #333",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#1f1f1f")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        {/* Item name */}
        <td style={{ padding: "15px", textAlign: "left" }}>{item.title}</td>

        {/* Price */}
        <td style={{ padding: "15px", textAlign: "center" }}>
          ₹{item.price.toFixed(2)}
        </td>

        {/* Quantity controls */}
        <td style={{ padding: "15px", textAlign: "center" }}>
          <button
            onClick={() => updateQuantity(index, item.quantity - 1)}
            disabled={item.quantity <= 1}
            style={{
              padding: "6px 12px",
              marginRight: "8px",
              cursor: "pointer",
              border: "none",
              borderRadius: "6px",
              background: "#333",
              color: "white",
              width: "32px", // ✅ fixed width
            }}
          >
            –
          </button>
          {item.quantity}
          <button
            onClick={() => updateQuantity(index, item.quantity + 1)}
            style={{
              padding: "6px 12px",
              marginLeft: "8px",
              cursor: "pointer",
              border: "none",
              borderRadius: "6px",
              background: "#333",
              color: "white",
              width: "32px", // ✅ fixed width
            }}
          >
            +
          </button>
        </td>

        {/* Total */}
        <td style={{ padding: "15px", textAlign: "center" }}>
          ₹{(item.price * item.quantity).toFixed(2)}
        </td>

        {/* Remove button */}
        <td style={{ padding: "15px", textAlign: "center" }}>
          <button
            onClick={() => removeFromCart(index)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              minWidth: "90px", // ✅ keeps alignment neat
            }}
          >
            Remove
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>

          {/* subtotal */}
          <h2
            style={{
              textAlign: "center",
              marginTop: "30px",
              fontSize: "2.3rem",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Subtotal:
            <span
              style={{
                display: "inline-block",
                marginLeft: "12px",
                padding: "12px 24px",
                background: "rgba(17, 15, 15, 0.24)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                color: "rgba(247, 243, 236, 1)",
                fontSize: "2.3rem",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              ₹{subtotal.toFixed(2)}
            </span>
          </h2>

          {/* ✅ checkout button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleCheckout}
              style={{
                padding: "12px 28px",
                background: "darkgoldenrod",
                border: "none",
                borderRadius: "10px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              ✅ Checkout
            </button>
          </div>

          {/* ✅ order placed message */}
          {orderPlaced && (
            <p
              style={{
                textAlign: "center",
                marginTop: "25px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "green",
              }}
            >
              🎉 Your order has been placed successfully!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;

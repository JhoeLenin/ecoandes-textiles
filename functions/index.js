const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const CULQI_API_URL = "https://api.culqi.com/v2";
const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;

exports.processCulqiPayment = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const order = event.data.data();
    const orderId = event.params.orderId;

    if (!order || order.paymentMethod !== "culqi" || !order.culqiTokenId) {
      return null;
    }

    try {
      const response = await fetch(`${CULQI_API_URL}/charges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CULQI_SECRET_KEY}`,
        },
        body: JSON.stringify({
          amount: Math.round(order.total * 100),
          currency_code: "PEN",
          email: order.customer.email,
          description: `Pedido #${orderId}`,
          source: {
            token_id: order.culqiTokenId,
          },
        }),
      });

      const result = await response.json();

      if (result.object === "charge") {
        await getFirestore().collection("orders").doc(orderId).update({
          status: "pagado",
          culqiChargeId: result.id,
          paidAt: new Date().toISOString(),
        });
        console.log(`Pago exitoso para pedido ${orderId}: ${result.id}`);
      } else {
        await getFirestore().collection("orders").doc(orderId).update({
          status: "pago_fallido",
          culqiError: result.user_message || JSON.stringify(result),
        });
        console.error(`Pago fallido para pedido ${orderId}:`, result);
      }
    } catch (error) {
      await getFirestore().collection("orders").doc(orderId).update({
        status: "error_pago",
        culqiError: error.message,
      });
      console.error(`Error procesando pago ${orderId}:`, error);
    }

    return null;
  }
);

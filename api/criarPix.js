import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res){

  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { nome } = req.body;

  try{

    const pagamento = await mercadopago.payment.create({
      transaction_amount: 25,
      description: "Plano VIP - Liga Online",
      payment_method_id: "pix",
      payer: {
        email: "cliente@email.com",
        first_name: nome
      }
    });

    const qrBase64 = pagamento.body.point_of_interaction.transaction_data.qr_code_base64;

    res.status(200).json({
      qr_code: `data:image/png;base64,${qrBase64}`
    });

  } catch(error){
    res.status(500).json({ error: error.message });
  }

}

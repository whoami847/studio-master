
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import SSLCommerzPayment from 'sslcommerz-lts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, gatewayId, userId, userName, userEmail } = body;

    if (!amount || !gatewayId || !userId || !userName || !userEmail) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch gateway credentials from Firestore
    const gatewayDocRef = doc(db, 'paymentGateways', gatewayId);
    const gatewayDoc = await getDoc(gatewayDocRef);

    if (!gatewayDoc.exists()) {
      return NextResponse.json({ message: 'Payment gateway not found' }, { status: 404 });
    }
    const gateway = gatewayDoc.data();

    if (!gateway.enabled) {
        return NextResponse.json({ message: 'This payment gateway is disabled' }, { status: 403 });
    }

    const tran_id = `TXN_${userId.substring(0, 5)}_${Date.now()}`;
    
    // 2. Create a pending transaction in Firestore
    const transactionData = {
        userId,
        user: userName,
        amount: Number(amount),
        type: 'Top-up' as const,
        description: `Wallet Top-up via ${gateway.name}`,
        status: 'pending' as const,
        gateway: gateway.name,
        tran_id: tran_id,
        date: serverTimestamp(),
    };
    await addDoc(collection(db, "transactions"), transactionData);
    
    // 3. Prepare data for SSLCOMMERZ
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:9002';

    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${serverUrl}/api/payment/success/${tran_id}`,
      fail_url: `${serverUrl}/api/payment/fail/${tran_id}`,
      cancel_url: `${serverUrl}/api/payment/cancel/${tran_id}`,
      ipn_url: `${serverUrl}/api/payment/ipn`,
      shipping_method: 'No',
      product_name: 'Wallet Top-up',
      product_category: 'Digital Goods',
      product_profile: 'general',
      cus_name: userName,
      cus_email: userEmail,
      cus_add1: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'Bangladesh',
      cus_phone: 'N/A',
    };

    // 4. Initiate payment with SSLCOMMERZ
    const sslcz = new SSLCommerzPayment(gateway.storeId, gateway.storePassword, false); // false for sandbox
    const apiResponse = await sslcz.init(data);

    if (apiResponse.status === 'SUCCESS') {
      return NextResponse.json({ url: apiResponse.GatewayPageURL });
    } else {
      return NextResponse.json({ message: 'Failed to initiate payment session' }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Payment initiation failed:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

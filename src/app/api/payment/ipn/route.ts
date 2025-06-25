
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import SSLCommerzPayment from 'sslcommerz-lts';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    const { tran_id, status, val_id, amount: paidAmount } = body as any;
    
    if (status !== 'VALID') {
        // If the status is not 'VALID', it's a failed or cancelled transaction.
        // We handle these via the fail/cancel URLs, but this is a fallback.
        const transactionRefQuery = query(collection(db, 'transactions'), where('tran_id', '==', tran_id));
        const querySnapshot = await getDocs(transactionRefQuery);
        if (!querySnapshot.empty) {
            const transactionDoc = querySnapshot.docs[0];
            const currentStatus = transactionDoc.data().status;
            if (currentStatus === 'pending') {
                await updateDoc(transactionDoc.ref, { status: 'failed' });
            }
        }
        return NextResponse.json({ message: 'Payment failed or cancelled' }, { status: 200 });
    }

    // Find the corresponding transaction in our database
    const transactionRefQuery = query(collection(db, 'transactions'), where('tran_id', '==', tran_id));
    const querySnapshot = await getDocs(transactionRefQuery);

    if (querySnapshot.empty) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }
    const transactionDoc = querySnapshot.docs[0];
    const transactionData = transactionDoc.data();
    
    if(transactionData.status !== 'pending') {
        return NextResponse.json({ message: "Transaction already processed" }, { status: 200 });
    }

    // Fetch gateway credentials to validate the IPN
    const gatewayDocRef = doc(db, 'paymentGateways', transactionData.gatewayId || "SSLCOMMERZ"); // Fallback for old data
    const gatewaysQuery = query(collection(db, 'paymentGateways'), where('name', '==', transactionData.gateway));
    const gatewaysSnapshot = await getDocs(gatewaysQuery);
    
    if (gatewaysSnapshot.empty) {
        return NextResponse.json({ message: "Gateway configuration not found for validation" }, { status: 500 });
    }
    const gateway = gatewaysSnapshot.docs[0].data();

    const sslcz = new SSLCommerzPayment(gateway.storeId, gateway.storePassword, false); // false for sandbox
    const isValid = await sslcz.validate({ val_id });

    if (isValid) {
        // Check if amount matches
        if (Number(transactionData.amount) === Number(paidAmount)) {
            // Update the transaction status to 'approved'
            await updateDoc(transactionDoc.ref, { status: 'approved' });
            return NextResponse.json({ message: 'Payment validated successfully' }, { status: 200 });
        } else {
            // Amount mismatch, flag for review
            await updateDoc(transactionDoc.ref, { status: 'failed', description: 'Amount Mismatch' });
            return NextResponse.json({ message: 'Amount Mismatch' }, { status: 400 });
        }
    } else {
        // Invalid IPN, flag for review
        await updateDoc(transactionDoc.ref, { status: 'failed', description: 'IPN Validation Failed' });
        return NextResponse.json({ message: 'Invalid IPN' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('IPN processing failed:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

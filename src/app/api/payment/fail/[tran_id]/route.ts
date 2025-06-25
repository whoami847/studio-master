
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest, { params }: { params: { tran_id: string } }) {
  const { tran_id } = params;
  
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('tran_id', '==', tran_id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const transactionDoc = querySnapshot.docs[0];
      await updateDoc(transactionDoc.ref, { status: 'failed' });
    }
  } catch (error) {
    console.error("Failed to update transaction status to 'failed':", error);
  }
  
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:9002';
  return NextResponse.redirect(`${clientUrl}/payment/fail`);
}


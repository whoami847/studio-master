
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest, { params }: { params: { tran_id: string } }) {
  const { tran_id } = params;
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:9002';
  
  // Note: We don't validate the payment here. IPN is the source of truth.
  // We just redirect the user to a success page.
  // Optionally, you could update the transaction with a 'payment_initiated' status,
  // but we will wait for IPN to mark it as 'approved'.
  
  return NextResponse.redirect(`${clientUrl}/payment/success`);
}

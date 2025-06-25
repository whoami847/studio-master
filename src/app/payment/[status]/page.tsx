
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PaymentStatusPage() {
    const params = useParams();
    const router = useRouter();
    const status = params.status;

    let content;

    switch(status) {
        case 'success':
            content = {
                icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
                title: "Payment Successful",
                description: "Your payment has been received and is being processed. Your balance will be updated shortly.",
                buttonText: "Go to My Wallet",
                buttonLink: "/my-wallet"
            };
            break;
        case 'fail':
            content = {
                icon: <XCircle className="h-16 w-16 text-red-500" />,
                title: "Payment Failed",
                description: "Unfortunately, your payment could not be processed. Please try again or use a different payment method.",
                buttonText: "Try Again",
                buttonLink: "/my-wallet/topup"
            };
            break;
        case 'cancel':
            content = {
                icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
                title: "Payment Cancelled",
                description: "You have cancelled the payment process. You can try again anytime.",
                buttonText: "Try Again",
                buttonLink: "/my-wallet/topup"
            };
            break;
        default:
             content = {
                icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
                title: "Unknown Status",
                description: "The payment status is unknown. Please check your wallet for updates.",
                buttonText: "Go to My Wallet",
                buttonLink: "/my-wallet"
            };
    }

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">{content.icon}</div>
                    <CardTitle className="text-3xl">{content.title}</CardTitle>
                    <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                     <Button asChild size="lg">
                        <Link href={content.buttonLink}>{content.buttonText}</Link>
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/')}>
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}


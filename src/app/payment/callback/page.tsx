import VerifyPayment from './verify';

export default async function CallbackPage({
    searchParams,
}: {
    searchParams: Promise<{
        trackId?: string;
        success?: string;
        orderId?: string;
    }>;
}) {
    const params = await searchParams;

    return (
        <VerifyPayment
            trackId={params.trackId}
            success={params.success}
            orderId={params.orderId}
        />
    );
}

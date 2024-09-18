import Link from 'next/link'
import { CheckCircle } from "lucide-react"

export default function Component() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h1 className="text-2xl font-bold">Login Successful</h1>
                <p className="text-muted-foreground">
                    You can now start rewriting. Please close this tab and return to your previous website.
                </p>
                <p className="text-sm text-muted-foreground">
                    Or you can visit{' '}
                    <Link
                        href="/a/dashboard"
                        className="text-primary font-bold underline hover:text-primary-focus"
                    >
                        your dashboard
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
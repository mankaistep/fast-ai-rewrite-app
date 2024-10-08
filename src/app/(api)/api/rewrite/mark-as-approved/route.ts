import {NextRequest, NextResponse} from "next/server";
import {getUser} from "@/lib/auth-utils";
import {markActivityAsApproved} from "@/lib/openai-utils";

export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request);

        // If fails => user ~ error
        if (user instanceof NextResponse) {
            return user;
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { activityId } = body;

        if (!activityId) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        await markActivityAsApproved(activityId)

        return NextResponse.json({ message: 'Activity marked as approved' });
    } catch (error) {
        console.error('Error marking activity as approved:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
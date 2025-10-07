import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function authenticate() {  
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return null;
    }
    else{
        return session.user.email;
    }
}; 
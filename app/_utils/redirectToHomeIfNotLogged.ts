import { redirect } from "next/navigation";
import { getUserAuth } from "./getUserAuth";

export function redirectToHomeIfNotLogged () {
    try {
        const userAuth = getUserAuth();

        if (!userAuth) {
            // Log the redirection for debugging purposes
            console.warn("User not authenticated or backend unreachable. Redirecting to landing.");
            redirect("/");
        }
    } catch (error) {
        console.error("Auth check failed:", error);
        // If the auth check itself crashes (common when backend is down), 
        // we redirect to a safe static page to avoid the 500 error loop.
        redirect("/");
    }
}
// This is a blueprint for Better-Auth client integration
// Actual integration requires a running auth server

export const authClient = {
    signIn: async (email: string, password: string) => {
        console.log("Mock Sign In for", email, password);
        return { user: { id: "1", role: "specialist" }, session: { token: "abc" } };
    },
    signOut: async () => {
        console.log("Mock Sign Out");
    },
    useSession: () => {
        return { data: { user: { id: "1", name: "Specialist User", role: "specialist" } }, isPending: false };
    }
}

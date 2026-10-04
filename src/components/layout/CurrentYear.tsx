import { connection } from "next/server";

// reading the clock must happen at request time under Cache Components; render inside <Suspense>
export default async function CurrentYear() {
    await connection();
    return <>{new Date().getFullYear()}</>;
}

import { SignOutButton } from "@clerk/nextjs";

const HomaePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Home Page</h1>
            <SignOutButton redirectUrl="/sign-in">
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Log Out
                </button>
            </SignOutButton>
        </div>
    );
};

export default HomaePage;

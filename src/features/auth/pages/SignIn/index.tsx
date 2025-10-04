import { SignIn as ClerkSignIn } from "@clerk/nextjs";

const SignIn = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <ClerkSignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />;
        </div>
    );
};

export default SignIn;

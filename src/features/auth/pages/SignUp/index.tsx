import { SignUp as ClerkSignUp } from "@clerk/nextjs";

const SignUp = () => {
    return <ClerkSignUp path="/sign-up" routing="path" signInUrl="/sign-in" />;
};

export default SignUp;

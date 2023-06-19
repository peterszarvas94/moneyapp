import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;

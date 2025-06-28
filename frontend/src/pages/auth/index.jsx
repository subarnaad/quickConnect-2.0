
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { GraduationCap } from "lucide-react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {Tabs} from "@/components/ui/Tabs";
import CommonForm from "@/components/common-form";
import { signUpFormControls, signInFormControls } from "@/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";



function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    } = useContext(AuthContext);

    function handleTabChange(value){
      setActiveTab(value);
    }

    function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
   }

   function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
   }
    return  <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex item-center border-b">
            <Link to={'/'} className="flex item-center justify-center">
            <GraduationCap className="h-8 w-8 mr-4"/>
            <span className="font-extrabold text-xl">quickConnect</span>
            </Link>
        </header>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Tabs
            value={activeTab}
            defaultValue="login"
            onValueChange={handleTabChange}
            className="w-full max-w-md"
           >
             {/* Tabs Header */}
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-lg">
              <TabsTrigger
                value="login"
                className={`py-2 px-4 text-center font-medium rounded-lg ${
                  activeTab === "login"
                    ? "bg-gray-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={`py-2 px-4 text-center font-medium rounded-lg ${
                  activeTab === "register"
                    ? "bg-gray-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value='login'>
             <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Login in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"LogIn"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>

            </TabsContent>
            <TabsContent value='register'>
              <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Register"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </Card>

               </TabsContent>

             </Tabs>
        </div>
    </div>

}
export default AuthPage ;

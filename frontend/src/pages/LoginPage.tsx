import React from "react";
import Input from "../components/Input";
import type { LoginCredentials } from "../store/types/adminTypes.ts"
import Button from "../components/Button.tsx";
import { useLoginMutation } from "../store/apis/adminApi.ts";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice.ts";

const LoginPage: React.FC = () => {
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState<LoginCredentials>({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await login(formData).unwrap();
            dispatch(setUser(user));
            navigate("/dashboard"); 
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex items-center flex-col justify-center p-30">   

                <form onSubmit={handleSubmit} className="space-y-6">
                    <p>Login into admin's Dashboard</p>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="bg-gray-200 rouded-2xl border-gray-300 text-center mb-6">
                        <Input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email"
                            required
                            className="w-full px-4 py-3 border"
                        />
                    </div>

                    <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="bg-gray-200 rouded-2xl border-gray-300 text-center mb-6">
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="password"
                            required
                            minLength={8}
                            className="w-full px-4 py-3 border"
                        />
                        </div>
                    </div>

                    <Button primary rounded type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                        </div>
                    ) : (
                        "Sign in"
                    )}
                    </Button>
                </form>

            </div>
        </div>
    );
}

export default LoginPage;
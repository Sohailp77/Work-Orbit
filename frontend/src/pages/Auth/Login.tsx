import { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useNavigate } from "react-router-dom";
import { useToast } from '../../components/ToastContext';
import loginImg from '../../assets/login.svg';


export function Login() {
  const { showToast } = useToast(); // 🔥 use toast
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const onFinish = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(values);
      console.log('Login success:', data);

      if (data?.token) {
        localStorage.setItem('authToken', data.token); // Save token to localStorage
        console.log(data.token);
        showToast('Login Succefull', 'success');
        navigate("/dashboard"); // ✅ Redirect after success
      } else {
        setError('Invalid credentials. Please try again.'); // Handle invalid response
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 403) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('Network error or server is down.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Illustration Section */}
        <div className="w-full md:w-1/2 bg-white p-6 flex justify-center items-center">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">Welcome Back!</h2>
          <p className="text-lg text-gray-700 mb-6">Please sign in to your account</p>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Form layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              label={<span className="text-gray-700">Email</span>}
              name="email"
              rules={[{ required: true, message: 'Please enter your email!' }]}>
              <Input placeholder="Enter your email" className="py-2" />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}>
              <Input.Password placeholder="Enter your password" className="py-2" />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-blue-500">Forgot Password?</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md">
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account? <Link to="/register" className="text-blue-500">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

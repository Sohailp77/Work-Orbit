import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { registerUser } from '../../api/auth';
import RegisterImage from '../../assets/register.svg';
import { useNavigate } from "react-router-dom";
import { useToast } from '../../components/ToastContext';


export function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setError('');
    setLoading(true);

    try {
      console.log('Registering user with values:', values);

      const data = await registerUser(values);
      console.log('Register success:', data);
      showToast('Registeration Successfull', 'success')
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        showToast(error.response?.data?.message || 'Something went wrong.', 'error');
        setError('Something Went Wrong');
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
            src={RegisterImage}
            alt="Register Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">Create an Account</h2>
          <p className="text-lg text-gray-700 mb-6">Please fill in the details below to sign up</p>

          {error && (
            <Alert message={error} type="error" showIcon className="mb-4" />
          )}

          <Form layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              label={<span className="text-gray-700">Full Name</span>}
              name="firstName"
              rules={[{ required: true, message: 'Please enter your full name!' }]}
            >
              <Input className="py-2" placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Enter a valid email!' }
              ]}
            >
              <Input className="py-2" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please enter a password!' }]}
            >
              <Input.Password className="py-2" placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700">Confirm Password</span>}
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  }
                })
              ]}
            >
              <Input.Password className="py-2" placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

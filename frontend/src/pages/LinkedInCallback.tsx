import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import * as linkedinApi from '../services/linkedinApi';

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(
        error === 'user_cancelled_authorize'
          ? 'You cancelled the LinkedIn authorization'
          : 'LinkedIn authorization failed'
      );
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setErrorMessage('Invalid callback parameters');
      return;
    }

    handleCallback(code, state);
  }, [searchParams]);

  const handleCallback = async (code: string, state: string) => {
    try {
      await linkedinApi.handleLinkedInCallback(code, state);
      setStatus('success');
      // Close the popup after 2 seconds
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 'Failed to connect LinkedIn account'
      );
    }
  };

  if (status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Spin size="large" />
        <p>Connecting your LinkedIn account...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Result
          status="success"
          icon={<CheckCircleOutlined />}
          title="LinkedIn Connected Successfully!"
          subTitle="This window will close automatically..."
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Result
        status="error"
        icon={<CloseCircleOutlined />}
        title="Connection Failed"
        subTitle={errorMessage}
        extra={
          <Button type="primary" onClick={() => window.close()}>
            Close Window
          </Button>
        }
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Divider,
  message,
  InputNumber,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  GlobalOutlined,
  BellOutlined,
  LinkedinOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import * as linkedinApi from '../services/linkedinApi';

const { Title, Text, Paragraph } = Typography;

export default function Settings() {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connectingLinkedIn, setConnectingLinkedIn] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        skills: user.skills,
        targetIndustries: user.targetIndustries,
        targetRegions: user.targetRegions,
        weeklyConnectionLimit: user.weeklyConnectionLimit,
        emailEnabled: user.notifications.email.enabled,
        emailAddress: user.notifications.email.address,
        desktopEnabled: user.notifications.desktop.enabled,
        reminderEnabled: user.notifications.appointmentReminder.enabled,
        reminderMinutes: user.notifications.appointmentReminder.minutesBefore,
      });
    }
  }, [user, form]);

  const handleSave = async (_values: any) => {
    setLoading(true);
    try {
      // In a real implementation, you would call an update user endpoint
      message.success('Settings saved successfully!');
      await checkAuth();
    } catch (error: any) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    setConnectingLinkedIn(true);
    try {
      const { authUrl } = await linkedinApi.initiateLinkedInAuth();
      // Open LinkedIn OAuth in a popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'LinkedIn Login',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      );

      // Listen for the callback
      const checkPopup = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkPopup);
          setConnectingLinkedIn(false);
          // Refresh user data to check if connection was successful
          checkAuth().then((updatedUser: any) => {
            if (updatedUser?.linkedinIntegration?.connected) {
              message.success('LinkedIn connected successfully!');
            }
          });
        }
      }, 500);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to connect LinkedIn');
      setConnectingLinkedIn(false);
    }
  };

  const handleDisconnectLinkedIn = async () => {
    try {
      await linkedinApi.disconnectLinkedIn();
      message.success('LinkedIn disconnected successfully!');
      await checkAuth();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to disconnect LinkedIn');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <Title level={2}>Settings</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        style={{ maxWidth: 800 }}
      >
        <Card title={<><UserOutlined /> Profile Information</>} style={{ marginBottom: 24 }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="timezone"
            label="Timezone"
            rules={[{ required: true, message: 'Please select your timezone' }]}
          >
            <Select
              showSearch
              placeholder="Select timezone"
              optionFilterProp="children"
            >
              <Select.Option value="America/Sao_Paulo">
                São Paulo (BRT)
              </Select.Option>
              <Select.Option value="America/New_York">
                New York (EST)
              </Select.Option>
              <Select.Option value="America/Los_Angeles">
                Los Angeles (PST)
              </Select.Option>
              <Select.Option value="Europe/London">London (GMT)</Select.Option>
              <Select.Option value="Europe/Paris">Paris (CET)</Select.Option>
              <Select.Option value="Asia/Tokyo">Tokyo (JST)</Select.Option>
              <Select.Option value="UTC">UTC</Select.Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title={<><GlobalOutlined /> Professional Profile</>} style={{ marginBottom: 24 }}>
          <Form.Item
            name="skills"
            label="Skills"
            help="Used for AI content generation"
          >
            <Select
              mode="tags"
              placeholder="e.g., JavaScript, React, Node.js"
              maxCount={20}
            />
          </Form.Item>

          <Form.Item
            name="targetIndustries"
            label="Target Industries"
          >
            <Select
              mode="tags"
              placeholder="e.g., Technology, Finance, Healthcare"
              maxCount={10}
            />
          </Form.Item>

          <Form.Item
            name="targetRegions"
            label="Target Regions"
          >
            <Select
              mode="tags"
              placeholder="e.g., North America, Europe, LATAM"
              maxCount={10}
            />
          </Form.Item>

          <Form.Item
            name="weeklyConnectionLimit"
            label="Weekly LinkedIn Connection Limit"
            help="Maximum new connections per week (recommended: 100)"
          >
            <InputNumber min={1} max={200} style={{ width: '100%' }} />
          </Form.Item>
        </Card>

        <Card title={<><LinkedinOutlined /> LinkedIn Integration</>} style={{ marginBottom: 24 }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {user.linkedinIntegration.connected ? (
              <>
                <div>
                  <Text strong>Status: </Text>
                  <Text type="success">Connected ✓</Text>
                </div>
                {user.linkedinIntegration.ssiScore && (
                  <div>
                    <Text strong>LinkedIn SSI Score: </Text>
                    <Text>{user.linkedinIntegration.ssiScore}/100</Text>
                  </div>
                )}
                <Button danger onClick={handleDisconnectLinkedIn}>
                  Disconnect LinkedIn
                </Button>
              </>
            ) : (
              <>
                <Paragraph type="secondary">
                  Connect your LinkedIn account to enable automatic post publishing
                  and SSI score tracking.
                </Paragraph>
                <Button
                  type="primary"
                  icon={<LinkedinOutlined />}
                  onClick={handleConnectLinkedIn}
                  loading={connectingLinkedIn}
                >
                  Connect LinkedIn
                </Button>
              </>
            )}
          </Space>
        </Card>

        <Card title={<><BellOutlined /> Notifications</>} style={{ marginBottom: 24 }}>
          <Form.Item
            name="emailEnabled"
            label="Email Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="emailAddress"
            label="Email Address"
            rules={[{ type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Divider />

          <Form.Item
            name="desktopEnabled"
            label="Desktop Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Divider />

          <Form.Item
            name="reminderEnabled"
            label="Appointment Reminders"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="reminderMinutes"
            label="Reminder Time (minutes before)"
          >
            <Select>
              <Select.Option value={15}>15 minutes</Select.Option>
              <Select.Option value={30}>30 minutes</Select.Option>
              <Select.Option value={60}>1 hour</Select.Option>
              <Select.Option value={120}>2 hours</Select.Option>
              <Select.Option value={1440}>1 day</Select.Option>
            </Select>
          </Form.Item>
        </Card>

        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            loading={loading}
          >
            Save Settings
          </Button>
        </div>
      </Form>
    </div>
  );
}

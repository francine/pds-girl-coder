import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Card,
  Statistic,
  Row,
  Col,
  Popconfirm,
  Typography,
} from 'antd';

const { Text } = Typography;
import {
  PlusOutlined,
  LinkedinOutlined,
  UserAddOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  SearchOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  getRecruiters,
  createRecruiter,
  updateRecruiter,
  updateRecruiterStatus,
  deleteRecruiter,
  getWeeklyConnectionCount,
  getLinkedInSearchUrls,
  generateContactMessages,
} from '../services/recruiterApi';
import { Recruiter } from '../types/api';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function Recruiters() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSearchSection, setShowSearchSection] = useState(false);
  const [messagesModalVisible, setMessagesModalVisible] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [searchUrls] = useState<Array<{ description: string; url: string }>>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [_messageLanguage, _setMessageLanguage] = useState<'en' | 'pt'>('en');
  const [genericMessagesVisible, setGenericMessagesVisible] = useState(false);
  const [genericMessages, setGenericMessages] = useState<string[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRecruiters();
    fetchWeeklyCount();
  }, [statusFilter]);



  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const data = await getRecruiters({ status: statusFilter });
      setRecruiters(data);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyCount = async () => {
    try {
      const { count } = await getWeeklyConnectionCount();
      setWeeklyCount(count);
    } catch (error: any) {
      message.error('Failed to load weekly count');
    }
  };

  const handleCreate = () => {
    setEditingRecruiter(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (recruiter: Recruiter) => {
    setEditingRecruiter(recruiter);
    form.setFieldsValue(recruiter);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecruiter) {
        await updateRecruiter(editingRecruiter._id, values);
        message.success('Recruiter updated successfully');
      } else {
        await createRecruiter(values);
        message.success('Recruiter added successfully');
      }
      setModalVisible(false);
      fetchRecruiters();
      fetchWeeklyCount();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save recruiter');
    }
  };

  const handleStatusChange = async (recruiterId: string, newStatus: string) => {
    try {
      await updateRecruiterStatus(recruiterId, newStatus);
      message.success('Status updated successfully');
      fetchRecruiters();
      fetchWeeklyCount();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (recruiterId: string) => {
    try {
      await deleteRecruiter(recruiterId);
      message.success('Recruiter deleted successfully');
      fetchRecruiters();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete recruiter');
    }
  };

  const handleSearchLinkedIn = async () => {
    try {
      setLoading(true);
      const data = await getLinkedInSearchUrls();

      // Open all LinkedIn search URLs in new tabs immediately
      data.searchUrls.forEach((search, index) => {
        setTimeout(() => {
          window.open(search.url, '_blank', 'noopener,noreferrer');
        }, index * 500); // Delay each tab opening by 500ms to avoid popup blocker
      });

      message.success(`Opened ${data.searchUrls.length} LinkedIn searches in new tabs!`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to generate search URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLinkedInSearch = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGenerateMessages = async (recruiter: Recruiter, language: 'en' | 'pt') => {
    try {
      setLoading(true);
      const updatedRecruiter = await generateContactMessages(recruiter._id, language);
      setSelectedRecruiter(updatedRecruiter);
      setMessagesModalVisible(true);
      message.success(language === 'pt' ? 'Mensagens geradas com sucesso!' : 'Messages generated successfully!');
    } catch (error: any) {
      message.error(error.response?.data?.message || (language === 'pt' ? 'Falha ao gerar mensagens' : 'Failed to generate messages'));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGenericMessages = (language: 'en' | 'pt') => {
    const messages = language === 'pt' ? [
      `Olá [Nome]!

Sou Francine, engenheira de software com experiência em Node.js e sempre busco me conectar com recrutadores globais e expandir minha rede.

Ficaria feliz em nos conectar aqui no LinkedIn e manter contato para oportunidades futuras.`,
      `Oi [Nome]!

Meu nome é Francine, sou desenvolvedora de software especializada em Node.js e estou sempre aberta a conhecer recrutadores que trabalham com vagas globais e remotas.

Adoraria adicionar você à minha rede e estar em contato!`,
      `Olá [Nome]!

Sou a Francine, trabalho com desenvolvimento de software (Node.js) e gosto de construir conexões com recrutadores que focam em oportunidades internacionais.

Vamos nos conectar? Seria ótimo fazer parte da sua rede!`
    ] : [
      `Hi [Name]!

I'm Francine, a software engineer with experience in Node.js and I'm always looking to connect with global recruiters and expand my network.

I'd be glad to connect here on LinkedIn and stay in touch for future opportunities.`,
      `Hello [Name]!

My name is Francine, I'm a software developer specialized in Node.js and I'm always open to connecting with recruiters who work with global and remote positions.

Would love to add you to my network and stay in touch!`,
      `Hi [Name]!

I'm Francine, a software engineer (Node.js) and I enjoy building connections with recruiters who focus on international opportunities.

Let's connect? It would be great to be part of your network!`
    ];

    setGenericMessages(messages);
    setGenericMessagesVisible(true);
    message.success(language === 'pt' ? 'Mensagens geradas!' : 'Messages generated!');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      discovered: 'blue',
      connection_sent: 'orange',
      connected: 'green',
      rejected: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      discovered: 'Discovered',
      connection_sent: 'Connection Sent',
      connected: 'Connected',
      rejected: 'Rejected',
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Recruiter) => (
        <Space>
          <span>{text}</span>
          <a
            href={record.linkedinProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinOutlined style={{ color: '#0077b5' }} />
          </a>
        </Space>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Discovered',
      dataIndex: 'discoveredAt',
      key: 'discoveredAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Recruiter) => (
        <Space direction="vertical" size="small">
          <Space>
            {record.status === 'discovered' && (
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => handleStatusChange(record._id, 'connection_sent')}
              >
                Send Connection
              </Button>
            )}
            {record.status === 'connection_sent' && (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange(record._id, 'connected')}
                >
                  Connected
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleStatusChange(record._id, 'rejected')}
                >
                  Rejected
                </Button>
              </>
            )}
          </Space>
          <Space>
            <Button
              size="small"
              icon={<MessageOutlined />}
              onClick={() => handleGenerateMessages(record, 'en')}
            >
              Messages (EN)
            </Button>
            <Button
              size="small"
              icon={<MessageOutlined />}
              onClick={() => handleGenerateMessages(record, 'pt')}
            >
              Messages (PT)
            </Button>
            <Button size="small" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this recruiter?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Recruiters"
              value={recruiters.length}
              prefix={<LinkedinOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Connections This Week"
              value={weeklyCount}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Connected"
              value={recruiters.filter((r) => r.status === 'connected').length}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="Filter by status"
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Select.Option value="discovered">Discovered</Select.Option>
            <Select.Option value="connection_sent">Connection Sent</Select.Option>
            <Select.Option value="connected">Connected</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
        </Space>
        <Space>
          <Button
            icon={<SendOutlined />}
            onClick={() => handleGenerateGenericMessages('en')}
          >
            Generate Message (EN)
          </Button>
          <Button
            icon={<SendOutlined />}
            onClick={() => handleGenerateGenericMessages('pt')}
          >
            Generate Message (PT)
          </Button>
          <Button
            icon={<SearchOutlined />}
            onClick={handleSearchLinkedIn}
            loading={loading}
          >
            Search on LinkedIn
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Recruiter
          </Button>
        </Space>
      </div>

      {/* Generic Messages Card */}
      {genericMessagesVisible && (
        <Card
          style={{ marginBottom: 16 }}
          title="Generic Contact Messages"
          extra={
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setGenericMessagesVisible(false)}
            />
          }
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {genericMessages.map((msg, index) => (
              <Card key={index} size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Option {index + 1}</strong>
                  </div>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    margin: 0,
                    marginBottom: 8
                  }}>
                    {msg}
                  </pre>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(msg);
                      message.success('Message copied to clipboard!');
                    }}
                  >
                    Copy
                  </Button>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      )}

      {/* LinkedIn Search URLs Section */}
      {showSearchSection && searchUrls.length > 0 && (
        <Card
          style={{ marginBottom: 16 }}
          title={
            <Space>
              <LinkedinOutlined style={{ color: '#0077b5', fontSize: 20 }} />
              <span>LinkedIn Recruiter Search</span>
            </Space>
          }
          extra={
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setShowSearchSection(false)}
            />
          }
        >
          <Text style={{ marginBottom: 16, display: 'block' }}>
            Click on the links below to search for recruiters on LinkedIn:
          </Text>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {searchUrls.map((search, index) => (
              <Card key={index} size="small" hoverable>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>{search.description}</Text>
                  <Button
                    type="primary"
                    icon={<LinkedinOutlined />}
                    onClick={() => handleOpenLinkedInSearch(search.url)}
                  >
                    Open Search on LinkedIn
                  </Button>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      )}

      <Table
        columns={columns}
        dataSource={recruiters}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecruiter ? 'Edit Recruiter' : 'Add Recruiter'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter recruiter name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="industry" label="Industry">
            <Input />
          </Form.Item>

          <Form.Item
            name="linkedinProfileUrl"
            label="LinkedIn Profile URL"
            rules={[
              { required: true, message: 'Please enter LinkedIn URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <Input prefix={<LinkedinOutlined />} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Contact Messages for ${selectedRecruiter?.name}`}
        open={messagesModalVisible}
        onCancel={() => setMessagesModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMessagesModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedRecruiter && selectedRecruiter.generatedMessages && selectedRecruiter.generatedMessages.length > 0 ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text>Choose one of these personalized messages to send to this recruiter:</Text>
            </div>
            {selectedRecruiter.generatedMessages.map((msg, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: 16 }}
                title={`Option ${index + 1}`}
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      navigator.clipboard.writeText(msg.message);
                      message.success('Message copied to clipboard!');
                    }}
                  >
                    Copy
                  </Button>
                }
              >
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  margin: 0
                }}>
                  {msg.message}
                </pre>
              </Card>
            ))}
          </>
        ) : (
          <Text>No messages generated yet.</Text>
        )}
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
  Tag,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { JobOpportunity } from '../types/api';
import * as jobOpportunityApi from '../services/jobOpportunityApi';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function JobPipeline() {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<JobOpportunity | null>(null);
  const [form] = Form.useForm();

  const stages = [
    { key: 'initial_contacts', title: 'Initial Contacts', color: '#f0f0f0' },
    { key: 'in_progress', title: 'In Progress', color: '#e6f7ff' },
    { key: 'interview', title: 'Interview', color: '#fff7e6' },
    { key: 'proposal', title: 'Proposal', color: '#f6ffed' },
    { key: 'negotiation', title: 'Negotiation', color: '#fff1f0' },
    { key: 'deal_closed', title: 'Deal Closed', color: '#f9f0ff' },
    { key: 'archived', title: 'Archived', color: '#fafafa' },
  ];

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await jobOpportunityApi.getJobOpportunities();
      setOpportunities(data);
    } catch (error: any) {
      message.error('Failed to load job opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleCreate = () => {
    setEditingOpportunity(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (opportunity: JobOpportunity) => {
    setEditingOpportunity(opportunity);
    form.setFieldsValue({
      ...opportunity,
      salaryMin: opportunity.salary?.min,
      salaryMax: opportunity.salary?.max,
      salaryCurrency: opportunity.salary?.currency,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await jobOpportunityApi.deleteJobOpportunity(id);
      message.success('Opportunity deleted');
      loadOpportunities();
    } catch (error: any) {
      message.error('Failed to delete opportunity');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        salary: values.salaryMin && values.salaryMax ? {
          min: values.salaryMin,
          max: values.salaryMax,
          currency: values.salaryCurrency || 'USD',
        } : undefined,
      };

      // Remove temporary salary fields
      delete data.salaryMin;
      delete data.salaryMax;
      delete data.salaryCurrency;

      if (editingOpportunity) {
        await jobOpportunityApi.updateJobOpportunity(editingOpportunity._id, data);
        message.success('Opportunity updated');
      } else {
        await jobOpportunityApi.createJobOpportunity(data);
        message.success('Opportunity created');
      }
      setModalVisible(false);
      loadOpportunities();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleStageChange = async (opportunity: JobOpportunity, newStage: string) => {
    try {
      await jobOpportunityApi.updateJobStage(opportunity._id, newStage);
      message.success('Stage updated');
      loadOpportunities();
    } catch (error: any) {
      message.error('Failed to update stage');
    }
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter((opp) => opp.stage === stage);
  };

  const renderOpportunityCard = (opportunity: JobOpportunity) => {
    return (
      <Card
        key={opportunity._id}
        size="small"
        style={{ marginBottom: 8 }}
        actions={[
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(opportunity)}
          >
            Edit
          </Button>,
          <Popconfirm
            title="Delete this opportunity?"
            onConfirm={() => handleDelete(opportunity._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Text strong>{opportunity.position}</Text>
          <Text type="secondary">{opportunity.company}</Text>

          {opportunity.location && (
            <Text style={{ fontSize: 12 }}>
              <EnvironmentOutlined /> {opportunity.location}
              {opportunity.remoteType && ` (${opportunity.remoteType})`}
            </Text>
          )}

          {opportunity.salary && (
            <Text style={{ fontSize: 12 }}>
              <DollarOutlined /> {opportunity.salary.currency} {opportunity.salary.min.toLocaleString()} - {opportunity.salary.max.toLocaleString()}
            </Text>
          )}

          {opportunity.contactName && (
            <Text style={{ fontSize: 12 }}>
              👤 {opportunity.contactName}
            </Text>
          )}

          {opportunity.notes && (
            <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12, marginBottom: 0 }}>
              {opportunity.notes}
            </Paragraph>
          )}

          <Select
            size="small"
            value={opportunity.stage}
            onChange={(value) => handleStageChange(opportunity, value)}
            style={{ width: '100%' }}
          >
            {stages.map((stage) => (
              <Select.Option key={stage.key} value={stage.key}>
                {stage.title}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Card>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Job Pipeline</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          New Opportunity
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, overflowX: 'auto' }}>
        {stages.map((stage) => (
          <div
            key={stage.key}
            style={{
              background: stage.color,
              padding: 16,
              borderRadius: 8,
              minHeight: 400,
              minWidth: 250,
            }}
          >
            <Title level={5}>
              {stage.title} ({getOpportunitiesByStage(stage.key).length})
            </Title>
            {getOpportunitiesByStage(stage.key).map(renderOpportunityCard)}
          </div>
        ))}
      </div>

      <Modal
        title={editingOpportunity ? 'Edit Opportunity' : 'New Opportunity'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="e.g., Google" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Input placeholder="e.g., Senior Software Engineer" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Job description..." />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="e.g., São Paulo, Brazil" />
          </Form.Item>

          <Form.Item name="remoteType" label="Work Type">
            <Select placeholder="Select work type" allowClear>
              <Select.Option value="remote">Remote</Select.Option>
              <Select.Option value="hybrid">Hybrid</Select.Option>
              <Select.Option value="onsite">On-site</Select.Option>
            </Select>
          </Form.Item>

          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="salaryMin" label="Salary Range (Min)" style={{ width: '33%' }}>
              <InputNumber
                placeholder="Min"
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <Form.Item name="salaryMax" label="Salary Range (Max)" style={{ width: '33%' }}>
              <InputNumber
                placeholder="Max"
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <Form.Item name="salaryCurrency" label="Currency" style={{ width: '34%' }}>
              <Select placeholder="Currency" defaultValue="USD">
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="BRL">BRL</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
              </Select>
            </Form.Item>
          </Space.Compact>

          <Form.Item name="contactName" label="Contact Name">
            <Input placeholder="Recruiter or hiring manager name" />
          </Form.Item>

          <Form.Item name="contactEmail" label="Contact Email">
            <Input type="email" placeholder="contact@company.com" />
          </Form.Item>

          <Form.Item name="contactPhone" label="Contact Phone">
            <Input placeholder="+1 (555) 123-4567" />
          </Form.Item>

          <Form.Item name="jobPostingUrl" label="Job Posting URL">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="companyWebsite" label="Company Website">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

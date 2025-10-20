import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BulbOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { PostIdea } from '../types/api';
import * as postIdeaApi from '../services/postIdeaApi';

const { Title } = Typography;
const { TextArea } = Input;

export default function PostIdeas() {
  const [postIdeas, setPostIdeas] = useState<PostIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIdea, setEditingIdea] = useState<PostIdea | null>(null);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [form] = Form.useForm();

  const loadPostIdeas = async () => {
    setLoading(true);
    try {
      const ideas = await postIdeaApi.getPostIdeas();
      setPostIdeas(ideas);
    } catch (error: any) {
      message.error('Failed to load post ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostIdeas();
  }, []);

  const handleCreate = () => {
    setEditingIdea(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (idea: PostIdea) => {
    setEditingIdea(idea);
    form.setFieldsValue({
      title: idea.title,
      description: idea.description,
      tags: idea.tags,
      status: idea.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await postIdeaApi.deletePostIdea(id);
      message.success('Post idea deleted');
      loadPostIdeas();
    } catch (error: any) {
      message.error('Failed to delete post idea');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingIdea) {
        await postIdeaApi.updatePostIdea(editingIdea._id, values);
        message.success('Post idea updated');
      } else {
        await postIdeaApi.createPostIdea(values);
        message.success('Post idea created');
      }
      setModalVisible(false);
      loadPostIdeas();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleGenerateIdeas = async () => {
    setGeneratingIdeas(true);
    try {
      const result = await postIdeaApi.generatePostIdeas();
      message.success(`Generated ${result.ideas.length} new post ideas!`);
      loadPostIdeas();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to generate ideas');
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <BulbOutlined style={{ color: '#faad14' }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          used: 'blue',
          archived: 'default',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PostIdea) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this post idea?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Post Ideas</Title>
        <Space>
          <Button
            icon={<RobotOutlined />}
            onClick={handleGenerateIdeas}
            loading={generatingIdeas}
            size="large"
          >
            Generate Ideas with AI
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            New Idea
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={postIdeas}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingIdea ? 'Edit Post Idea' : 'New Post Idea'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Please enter a title' },
              { min: 1, max: 200, message: 'Title must be 1-200 characters' },
            ]}
          >
            <Input placeholder="e.g., JavaScript Best Practices" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 2000, message: 'Description must be max 2000 characters' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Detailed description of the post idea..."
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            help="Press Enter to add a tag (max 10)"
          >
            <Select
              mode="tags"
              placeholder="e.g., javascript, web-dev, tutorial"
              maxCount={10}
            />
          </Form.Item>

          {editingIdea && (
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="used">Used</Select.Option>
                <Select.Option value="archived">Archived</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Space,
  Tag,
  Select,
  Popconfirm,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { Post } from '../types/api';
import * as postApi from '../services/postApi';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Droppable Column Component
function DroppableColumn({ id, title, count, children, style }: {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border: isOver ? '2px dashed #1890ff' : '2px solid transparent',
        transition: 'border 0.2s',
      }}
    >
      <Title level={4}>
        {title} ({count})
      </Title>
      {children}
    </div>
  );
}

// Sortable Card Component
function SortableCard({ post, onEdit, onDelete, onRetry, onClick }: {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  onClick: (post: Post) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'pointer',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    draft: <EditOutlined style={{ color: '#8c8c8c' }} />,
    scheduled: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
    published: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    failed: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        style={{ marginBottom: 8 }}
        onClick={(e) => {
          // Don't trigger card click if clicking on buttons
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('.ant-btn')) {
            onClick(post);
          }
        }}
        actions={[
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post);
            }}
          >
            Edit
          </Button>,
          post.status === 'failed' ? (
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                onRetry(post._id);
              }}
            >
              Retry
            </Button>
          ) : null,
          <Popconfirm
            title="Delete this post?"
            onConfirm={() => onDelete(post._id)}
            okText="Yes"
            cancelText="No"
            onClick={(e) => e.stopPropagation()}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>,
        ].filter(Boolean)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            {statusIcons[post.status]}
            <Tag>{post.status.toUpperCase()}</Tag>
          </Space>
          <Paragraph ellipsis={{ rows: 3 }}>{post.content}</Paragraph>
          {post.scheduledAt && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              📅 {dayjs(post.scheduledAt).format('MMM D, YYYY h:mm A')}
            </Text>
          )}
          {post.publishedAt && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ✅ Published {dayjs(post.publishedAt).format('MMM D, YYYY')}
            </Text>
          )}
          {post.metrics && post.status === 'published' && (
            <Space size="small">
              <Text style={{ fontSize: 12 }}>
                👍 {post.metrics.likes}
              </Text>
              <Text style={{ fontSize: 12 }}>
                💬 {post.metrics.comments}
              </Text>
              <Text style={{ fontSize: 12 }}>
                🔄 {post.metrics.shares}
              </Text>
            </Space>
          )}
        </Space>
      </Card>
    </div>
  );
}

export default function ContentKanban() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [generatingBulk, setGeneratingBulk] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [generateForm] = Form.useForm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await postApi.getPosts();
      setPosts(allPosts);
    } catch (error: any) {
      message.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = () => {
    setEditingPost(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.setFieldsValue({
      content: post.content,
      postIdeaId: post.postIdeaId,
      status: post.status,
      scheduledAt: post.scheduledAt ? dayjs(post.scheduledAt) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await postApi.deletePost(id);
      message.success('Post deleted');
      loadPosts();
    } catch (error: any) {
      message.error('Failed to delete post');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data: any = {
        content: values.content,
        postIdeaId: values.postIdeaId || undefined,
        scheduledAt: values.scheduledAt
          ? values.scheduledAt.toISOString()
          : undefined,
      };

      if (editingPost) {
        data.status = values.status;
        await postApi.updatePost(editingPost._id, data);
        message.success('Post updated');
      } else {
        await postApi.createPost(data);
        message.success('Post created');
      }
      setModalVisible(false);
      loadPosts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await postApi.retryFailedPost(id);
      message.success('Post retry scheduled');
      loadPosts();
    } catch (error: any) {
      message.error('Failed to retry post');
    }
  };

  const handleBulkGenerate = async (values: any) => {
    setGeneratingBulk(true);
    try {
      const response = await postApi.generateBulkPosts({
        count: values.count,
        topic: values.topic || undefined,
        tone: 'professional',
        maxWords: 300,
      });

      message.success(response.message);
      setGenerateModalVisible(false);
      generateForm.resetFields();
      loadPosts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to generate posts');
    } finally {
      setGeneratingBulk(false);
    }
  };

  const handleCardClick = (post: Post) => {
    setViewingPost(post);
    setDetailsModalVisible(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Drag ended:', { activeId: active.id, overId: over?.id });

    setActiveId(null);

    if (!over) {
      console.log('No drop target');
      return;
    }

    const activePost = posts.find((p) => p._id === active.id);
    if (!activePost) {
      console.log('Active post not found');
      return;
    }

    console.log('Active post:', activePost);

    // Valid statuses
    const validStatuses = ['draft', 'scheduled', 'published', 'failed'];

    // Check if we're dropping over a column or a card
    let targetStatus: string | null = null;

    // If dropping over a column directly
    if (validStatuses.includes(over.id as string)) {
      targetStatus = over.id as string;
      console.log('Dropped over column:', targetStatus);
    } else {
      // If dropping over another card, find its status
      const overPost = posts.find((p) => p._id === over.id);
      if (overPost) {
        targetStatus = overPost.status;
        console.log('Dropped over card, target status:', targetStatus);
      }
    }

    console.log('Target status:', targetStatus, 'Current status:', activePost.status);

    if (targetStatus && activePost.status !== targetStatus) {
      try {
        console.log('Updating post status...');
        await postApi.updatePost(activePost._id, {
          status: targetStatus as 'draft' | 'scheduled' | 'published' | 'failed'
        });
        message.success(`Post moved to ${targetStatus}`);
        loadPosts();
      } catch (error: any) {
        console.error('Error updating post:', error);
        message.error('Failed to update post status');
      }
    } else {
      console.log('No status change needed or same status');
    }
  };

  const getPostsByStatus = (status: string) => {
    return posts.filter((post) => post.status === status);
  };

  const columns = [
    { title: 'Draft', status: 'draft', color: '#f0f0f0' },
    { title: 'Scheduled', status: 'scheduled', color: '#e6f7ff' },
    { title: 'Published', status: 'published', color: '#f6ffed' },
    { title: 'Failed', status: 'failed', color: '#fff1f0' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Content Kanban</Title>
        <Space>
          <Button
            icon={<BulbOutlined />}
            onClick={() => setGenerateModalVisible(true)}
            size="large"
          >
            Generate Posts
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            New Post
          </Button>
        </Space>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {columns.map((column) => {
            const columnPosts = getPostsByStatus(column.status);
            return (
              <DroppableColumn
                key={column.status}
                id={column.status}
                title={column.title}
                count={columnPosts.length}
                style={{
                  background: column.color,
                  padding: 16,
                  borderRadius: 8,
                  minHeight: 400,
                }}
              >
                <SortableContext
                  items={columnPosts.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {columnPosts.map((post) => (
                    <SortableCard
                      key={post._id}
                      post={post}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onRetry={handleRetry}
                      onClick={handleCardClick}
                    />
                  ))}
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeId ? (
            <Card size="small" style={{ opacity: 0.8 }}>
              Dragging...
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        title="Post Details"
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setViewingPost(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              if (viewingPost) {
                setDetailsModalVisible(false);
                handleEdit(viewingPost);
              }
            }}
          >
            Edit
          </Button>,
        ]}
        width={700}
      >
        {viewingPost && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Text strong>Status: </Text>
              <Tag color={
                viewingPost.status === 'published' ? 'green' :
                viewingPost.status === 'scheduled' ? 'blue' :
                viewingPost.status === 'failed' ? 'red' : 'default'
              }>
                {viewingPost.status.toUpperCase()}
              </Tag>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Content:</Text>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {viewingPost.content}
              </Paragraph>
            </div>

            {viewingPost.scheduledAt && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text strong>Scheduled For: </Text>
                  <Text>
                    📅 {dayjs(viewingPost.scheduledAt).format('MMMM D, YYYY [at] h:mm A')}
                  </Text>
                </div>
              </>
            )}

            {viewingPost.publishedAt && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text strong>Published At: </Text>
                  <Text>
                    ✅ {dayjs(viewingPost.publishedAt).format('MMMM D, YYYY [at] h:mm A')}
                  </Text>
                </div>
              </>
            )}

            {viewingPost.metrics && viewingPost.status === 'published' && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Metrics:</Text>
                  <Space size="large">
                    <div>
                      <Text style={{ fontSize: 24 }}>👍</Text>
                      <Text strong style={{ marginLeft: 8, fontSize: 16 }}>
                        {viewingPost.metrics.likes}
                      </Text>
                      <Text type="secondary" style={{ marginLeft: 4 }}>likes</Text>
                    </div>
                    <div>
                      <Text style={{ fontSize: 24 }}>💬</Text>
                      <Text strong style={{ marginLeft: 8, fontSize: 16 }}>
                        {viewingPost.metrics.comments}
                      </Text>
                      <Text type="secondary" style={{ marginLeft: 4 }}>comments</Text>
                    </div>
                    <div>
                      <Text style={{ fontSize: 24 }}>🔄</Text>
                      <Text strong style={{ marginLeft: 8, fontSize: 16 }}>
                        {viewingPost.metrics.shares}
                      </Text>
                      <Text type="secondary" style={{ marginLeft: 4 }}>shares</Text>
                    </div>
                  </Space>
                </div>
              </>
            )}

            {viewingPost.linkedInUrl && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text strong>LinkedIn URL: </Text>
                  <a href={viewingPost.linkedInUrl} target="_blank" rel="noopener noreferrer">
                    View on LinkedIn
                  </a>
                </div>
              </>
            )}
          </Space>
        )}
      </Modal>

      <Modal
        title={editingPost ? 'Edit Post' : 'New Post'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: 'Please enter post content' },
              { min: 1, max: 3000, message: 'Content must be 1-3000 characters' },
            ]}
          >
            <TextArea
              rows={8}
              placeholder="Write your LinkedIn post here..."
              showCount
              maxLength={3000}
            />
          </Form.Item>

          {editingPost && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="scheduled">Scheduled</Select.Option>
                <Select.Option value="published">Published</Select.Option>
                <Select.Option value="failed">Failed</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="postIdeaId"
            label="Post Idea Reference (Optional)"
            help="Enter a post idea ID or reference"
          >
            <Input placeholder="e.g., 507f1f77bcf86cd799439011" />
          </Form.Item>

          <Form.Item
            name="scheduledAt"
            label="Schedule For (Optional)"
            help="Leave empty to save as draft"
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Generate Multiple Posts"
        open={generateModalVisible}
        onCancel={() => setGenerateModalVisible(false)}
        onOk={() => generateForm.submit()}
        confirmLoading={generatingBulk}
        width={600}
      >
        <Form
          form={generateForm}
          layout="vertical"
          onFinish={handleBulkGenerate}
          initialValues={{ count: 5 }}
        >
          <Form.Item
            name="count"
            label="How many posts do you want to generate?"
            rules={[
              { required: true, message: 'Please enter number of posts' },
            ]}
          >
            <Select placeholder="Select number of posts">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <Select.Option key={num} value={num}>{num} post{num > 1 ? 's' : ''}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="topic"
            label="Topic (Optional)"
            help="Leave empty to generate posts based on your skills"
          >
            <Input
              placeholder="e.g., API Design, Clean Code, DevOps..."
            />
          </Form.Item>

          <div style={{
            background: '#f0f2f5',
            padding: '12px 16px',
            borderRadius: 8,
            marginTop: 16
          }}>
            <Text type="secondary">
              <BulbOutlined /> Posts will be generated as <strong>drafts</strong> and you can edit them before scheduling.
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

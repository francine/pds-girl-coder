import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Calendar as AntCalendar,
  Badge,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  List,
  Space,
  Tag,
  Popconfirm,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { Appointment } from '../types/api';
import * as appointmentApi from '../services/appointmentApi';
import * as jobOpportunityApi from '../services/jobOpportunityApi';
import * as postApi from '../services/postApi';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [form] = Form.useForm();

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentApi.getAppointments();
      setAppointments(data);
    } catch (error: any) {
      message.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadOpportunities = async () => {
    try {
      const data = await jobOpportunityApi.getJobOpportunities();
      setOpportunities(data.filter(opp => opp.stage !== 'archived'));
    } catch (error) {
      console.error('Failed to load opportunities');
    }
  };

  const loadScheduledPosts = async () => {
    try {
      const data = await postApi.getScheduledPostsForCalendar();
      setScheduledPosts(data);
    } catch (error) {
      console.error('Failed to load scheduled posts');
    }
  };

  useEffect(() => {
    loadAppointments();
    loadOpportunities();
    loadScheduledPosts();
  }, []);

  const handleCreate = (date?: Dayjs) => {
    setEditingAppointment(null);
    form.resetFields();
    if (date) {
      form.setFieldsValue({
        startTime: date.hour(9).minute(0),
        endTime: date.hour(10).minute(0),
      });
    }
    setModalVisible(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    form.setFieldsValue({
      title: appointment.title,
      description: appointment.description,
      type: appointment.type,
      startTime: dayjs(appointment.startTime),
      endTime: dayjs(appointment.endTime),
      jobOpportunityId: appointment.jobOpportunityId,
      company: appointment.company,
      location: appointment.location,
      attendees: appointment.attendees?.join(', '),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await appointmentApi.deleteAppointment(id);
      message.success('Appointment deleted');
      loadAppointments();
    } catch (error: any) {
      message.error('Failed to delete appointment');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        title: values.title,
        description: values.description,
        type: values.type,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        jobOpportunityId: values.jobOpportunityId,
        company: values.company,
        location: values.location,
        attendees: values.attendees
          ? values.attendees.split(',').map((email: string) => email.trim())
          : [],
      };

      if (editingAppointment) {
        await appointmentApi.updateAppointment(editingAppointment._id, data);
        message.success('Appointment updated');
      } else {
        await appointmentApi.createAppointment(data);
        message.success('Appointment created');
      }
      setModalVisible(false);
      loadAppointments();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const getAppointmentsForDate = (date: Dayjs) => {
    return appointments.filter((apt) => {
      const aptDate = dayjs(apt.startTime);
      return aptDate.isSame(date, 'day');
    });
  };

  const getScheduledPostsForDate = (date: Dayjs) => {
    return scheduledPosts.filter((post) => {
      const postDate = dayjs(post.startTime);
      return postDate.isSame(date, 'day');
    });
  };

  const getAllEventsForDate = (date: Dayjs) => {
    const appts = getAppointmentsForDate(date);
    const posts = getScheduledPostsForDate(date);
    return [...appts, ...posts];
  };

  const dateCellRender = (value: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(value);
    const dayPosts = getScheduledPostsForDate(value);

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayAppointments.map((apt) => (
          <li key={apt._id} style={{ marginBottom: 2 }}>
            <Badge
              status={apt.type === 'interview' ? 'error' : 'processing'}
              text={
                <span style={{ fontSize: 12 }}>
                  {dayjs(apt.startTime).format('HH:mm')} {apt.title}
                </span>
              }
            />
          </li>
        ))}
        {dayPosts.map((post) => (
          <li key={post._id} style={{ marginBottom: 2 }}>
            <Badge
              status={post.status === 'published' ? 'success' : 'processing'}
              text={
                <span style={{ fontSize: 12 }}>
                  {dayjs(post.startTime).format('HH:mm')} LinkedIn ({post.status === 'published' ? '✓' : '⏰'})
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const selectedDateEvents = getAllEventsForDate(selectedDate);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Calendar</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleCreate(selectedDate)}
          size="large"
        >
          New Appointment
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <Card>
          <AntCalendar
            dateCellRender={dateCellRender}
            onSelect={(date) => setSelectedDate(date)}
            value={selectedDate}
          />
        </Card>

        <Card title={`Events on ${selectedDate.format('MMMM D, YYYY')}`}>
          {selectedDateEvents.length === 0 ? (
            <Text type="secondary">No events for this day</Text>
          ) : (
            <List
              dataSource={selectedDateEvents}
              renderItem={(event: any) => {
                const isPost = event.type === 'linkedin_post';
                const isAppointment = !isPost;

                return (
                  <List.Item
                    actions={
                      isAppointment
                        ? [
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(event)}
                            />,
                            <Popconfirm
                              title="Delete this appointment?"
                              onConfirm={() => handleDelete(event._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="link" danger icon={<DeleteOutlined />} />
                            </Popconfirm>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          {isPost ? (
                            <>
                              <Tag color={event.status === 'published' ? 'green' : 'blue'}>
                                LinkedIn Post
                              </Tag>
                              <Tag color={event.status === 'published' ? 'success' : 'processing'}>
                                {event.status === 'published' ? '✓ Published' : '⏰ Scheduled'}
                              </Tag>
                            </>
                          ) : (
                            <Tag color={event.type === 'interview' ? 'red' : 'blue'}>
                              {event.type === 'interview' ? 'Interview' : 'Study'}
                            </Tag>
                          )}
                          {event.title}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text>
                            <ClockCircleOutlined />{' '}
                            {dayjs(event.startTime).format('HH:mm')}
                            {isAppointment && event.endTime && ` - ${dayjs(event.endTime).format('HH:mm')}`}
                          </Text>
                          {isAppointment && event.company && <Text>🏢 {event.company}</Text>}
                          {isAppointment && event.location && (
                            <Text>
                              <EnvironmentOutlined /> {event.location}
                            </Text>
                          )}
                          {event.description && (
                            <Text type="secondary" ellipsis>
                              {event.description.substring(0, 100)}
                              {event.description.length > 100 ? '...' : ''}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </Card>
      </div>

      <Modal
        title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g., Technical Interview with Company X" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select appointment type">
              <Select.Option value="interview">Interview</Select.Option>
              <Select.Option value="study_session">Study Session</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: 'Please select end time' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="jobOpportunityId" label="Related Job Opportunity">
            <Select placeholder="Select opportunity (optional)" allowClear>
              {opportunities.map((opp) => (
                <Select.Option key={opp._id} value={opp._id}>
                  {opp.position} - {opp.company}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="company" label="Company">
            <Input placeholder="Company name" />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="e.g., Zoom link, office address" />
          </Form.Item>

          <Form.Item
            name="attendees"
            label="Attendees"
            help="Comma-separated email addresses"
          >
            <Input placeholder="email1@example.com, email2@example.com" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Spin, List, Tag, Space, Empty } from 'antd';
import {
  FileTextOutlined,
  BulbOutlined,
  FundProjectionScreenOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import * as postApi from '../services/postApi';
import * as postIdeaApi from '../services/postIdeaApi';
import * as jobOpportunityApi from '../services/jobOpportunityApi';
import * as appointmentApi from '../services/appointmentApi';
import { Post, JobOpportunity, Appointment } from '../types/api';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    weeklyPosts: 0,
    activeIdeas: 0,
    activeOpportunities: 0,
    interviews: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<JobOpportunity[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [weeklyPostCount, postIdeas, opportunities, posts, appointments] = await Promise.all([
        postApi.getWeeklyPostCount(),
        postIdeaApi.getPostIdeas({ status: 'active' }),
        jobOpportunityApi.getJobOpportunities(),
        postApi.getPosts(),
        appointmentApi.getAppointments(),
      ]);

      const interviews = opportunities.filter(
        (opp) => opp.stage === 'interview'
      ).length;

      const activeOpps = opportunities.filter(
        (opp) => opp.stage !== 'archived' && opp.stage !== 'deal_closed'
      ).length;

      // Get recent posts (last 5)
      const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentPosts(sortedPosts.slice(0, 5));

      // Get recent opportunities (last 5)
      const sortedOpps = [...opportunities].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOpportunities(sortedOpps.slice(0, 5));

      // Get upcoming appointments (next 7 days)
      const now = dayjs();
      const upcoming = appointments
        .filter(apt => dayjs(apt.startTime).isAfter(now))
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 5);
      setUpcomingAppointments(upcoming);

      setStats({
        weeklyPosts: weeklyPostCount.count,
        activeIdeas: postIdeas.length,
        activeOpportunities: activeOpps,
        interviews,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Posts This Week"
              value={stats.weeklyPosts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix="/ 5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Post Ideas"
              value={stats.activeIdeas}
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Opportunities"
              value={stats.activeOpportunities}
              prefix={<FundProjectionScreenOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Interviews Scheduled"
              value={stats.interviews}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<Space><FileTextOutlined /> Recent Posts</Space>}>
            {recentPosts.length > 0 ? (
              <List
                dataSource={recentPosts}
                renderItem={(post) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color={
                            post.status === 'published' ? 'green' :
                            post.status === 'scheduled' ? 'blue' :
                            post.status === 'draft' ? 'default' : 'red'
                          }>
                            {post.status.toUpperCase()}
                          </Tag>
                          {post.linkedinUrl && (
                            <a href={post.linkedinUrl} target="_blank" rel="noopener noreferrer">
                              <LinkedinOutlined style={{ color: '#0077b5' }} />
                            </a>
                          )}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%'
                          }}>
                            {post.content}
                          </div>
                          <Space style={{ fontSize: '12px', color: '#888' }}>
                            <ClockCircleOutlined />
                            {post.publishedAt
                              ? `Published ${dayjs(post.publishedAt).format('MMM D, YYYY')}`
                              : `Created ${dayjs(post.createdAt).format('MMM D, YYYY')}`
                            }
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No posts yet" />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<Space><FundProjectionScreenOutlined /> Recent Job Opportunities</Space>}>
            {recentOpportunities.length > 0 ? (
              <List
                dataSource={recentOpportunities}
                renderItem={(opp) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <strong>{opp.position}</strong>
                          <Tag color="blue">{opp.stage.replace(/_/g, ' ').toUpperCase()}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>{opp.company}</div>
                          <Space style={{ fontSize: '12px', color: '#888' }}>
                            <ClockCircleOutlined />
                            {dayjs(opp.createdAt).format('MMM D, YYYY')}
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No opportunities yet" />
            )}
          </Card>
        </Col>

        <Col xs={24}>
          <Card title={<Space><CalendarOutlined /> Upcoming Appointments</Space>}>
            {upcomingAppointments.length > 0 ? (
              <List
                dataSource={upcomingAppointments}
                renderItem={(apt) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <strong>{apt.title}</strong>
                          <Tag color={apt.type === 'interview' ? 'orange' : 'purple'}>
                            {apt.type.toUpperCase()}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {apt.description && <div>{apt.description}</div>}
                          <Space style={{ fontSize: '12px', color: '#888' }}>
                            <ClockCircleOutlined />
                            {dayjs(apt.startTime).format('MMM D, YYYY [at] h:mm A')}
                            {apt.company && ` - ${apt.company}`}
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No upcoming appointments" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

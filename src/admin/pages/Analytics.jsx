import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiHeart, FiTrendingUp, FiCalendar, FiGlobe, FiMonitor, FiClock } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { useAllLikes } from '../../hooks/usePortfolioLikes';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.color || props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const Section = styled.div`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
`;

const ChartTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BarLabel = styled.div`
  min-width: 100px;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
`;

const LikesTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  color: ${props => props.theme.colors.lightText};
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
`;

const Analytics = () => {
  const { likes, stats, loading } = useAllLikes();

  if (loading) {
    return (
      <AdminLayout title="Portfolio Analytics">
        <EmptyState>Loading analytics...</EmptyState>
      </AdminLayout>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTopItems = (obj, limit = 5) => {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  };

  const maxValue = (obj) => Math.max(...Object.values(obj), 1);

  return (
    <AdminLayout title="Portfolio Analytics">
      <Grid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <IconWrapper color="linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)">
            <FiHeart size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Likes</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <IconWrapper color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <FiCalendar size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{stats.today}</StatValue>
            <StatLabel>Today</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <IconWrapper color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
            <FiTrendingUp size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{stats.thisWeek}</StatValue>
            <StatLabel>This Week</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <IconWrapper color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <FiClock size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{stats.thisMonth}</StatValue>
            <StatLabel>This Month</StatLabel>
          </StatContent>
        </StatCard>
      </Grid>

      <Section>
        <SectionTitle>
          <FiMonitor />
          Visitor Insights
        </SectionTitle>
        <ChartGrid>
          <ChartCard>
            <ChartTitle>Top Browsers</ChartTitle>
            <BarChart>
              {getTopItems(stats.browsers).map(([browser, count]) => (
                <BarRow key={browser}>
                  <BarLabel>{browser}</BarLabel>
                  <BarContainer>
                    <BarFill
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxValue(stats.browsers)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {count}
                    </BarFill>
                  </BarContainer>
                </BarRow>
              ))}
            </BarChart>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Operating Systems</ChartTitle>
            <BarChart>
              {getTopItems(stats.os).map(([os, count]) => (
                <BarRow key={os}>
                  <BarLabel>{os}</BarLabel>
                  <BarContainer>
                    <BarFill
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxValue(stats.os)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {count}
                    </BarFill>
                  </BarContainer>
                </BarRow>
              ))}
            </BarChart>
          </ChartCard>
        </ChartGrid>
      </Section>

      <Section>
        <SectionTitle>
          <FiGlobe />
          Geographic Distribution
        </SectionTitle>
        <ChartCard>
          <ChartTitle>Top Timezones</ChartTitle>
          <BarChart>
            {getTopItems(stats.timezones, 10).map(([timezone, count]) => (
              <BarRow key={timezone}>
                <BarLabel>{timezone}</BarLabel>
                <BarContainer>
                  <BarFill
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxValue(stats.timezones)) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {count}
                  </BarFill>
                </BarContainer>
              </BarRow>
            ))}
          </BarChart>
        </ChartCard>
      </Section>

      <Section>
        <SectionTitle>
          <FiHeart />
          Recent Likes
        </SectionTitle>
        {likes.length === 0 ? (
          <EmptyState>No likes yet. Share your portfolio to get started!</EmptyState>
        ) : (
          <LikesTable>
            <Table>
              <thead>
                <tr>
                  <Th>Date & Time</Th>
                  <Th>Browser</Th>
                  <Th>OS</Th>
                  <Th>Timezone</Th>
                  <Th>Screen</Th>
                </tr>
              </thead>
              <tbody>
                {likes.slice(0, 50).map((like) => (
                  <tr key={like.id}>
                    <Td>{formatDate(like.timestamp)}</Td>
                    <Td>{like.browser || 'Unknown'}</Td>
                    <Td>{like.os || 'Unknown'}</Td>
                    <Td>{like.timezone || 'Unknown'}</Td>
                    <Td>{like.screenResolution || 'Unknown'}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </LikesTable>
        )}
      </Section>
    </AdminLayout>
  );
};

export default Analytics;

import { useState } from 'react';
import { Card, Statistic, Tag, Segmented, Text, Space } from '@cobos/react';
import {
  LineChart,
  AreaChart,
  BarChart,
  DonutChart,
  PieChart,
  Sparkline,
} from '@cobos/charts';
import { Example, DemoStack } from './_demo';

/* -------------------------------------------------------------------------- */
/* Sample data — a fictional "Voltaflow" SaaS analytics surface.              */
/* -------------------------------------------------------------------------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

/** Monthly recurring revenue, in thousands of dollars. */
const REVENUE_BY_MONTH = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 51 },
  { label: 'Mar', value: 47 },
  { label: 'Apr', value: 63 },
  { label: 'May', value: 71 },
  { label: 'Jun', value: 78 },
  { label: 'Jul', value: 86 },
  { label: 'Aug', value: 94 },
  { label: 'Sep', value: 108 },
];

/** Active-user growth across the same window. */
const GROWTH = MONTHS.map((x, i) => ({
  x,
  y: [4200, 4600, 5100, 5900, 6400, 7200, 8100, 9300, 10800][i],
}));

const TRAFFIC_SOURCES = [
  { label: 'Direct', value: 48 },
  { label: 'Organic search', value: 27 },
  { label: 'Referral', value: 15 },
  { label: 'Social', value: 10 },
];

/** Small trend series that ride along each stat card. */
const STATS: {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  delta: string;
  up: boolean;
  spark: number[];
  color?: string;
}[] = [
  {
    title: 'MRR',
    value: 108200,
    prefix: '$',
    precision: 0,
    delta: '+14.9%',
    up: true,
    spark: [42, 51, 47, 63, 71, 78, 86, 94, 108],
  },
  {
    title: 'Active users',
    value: 10843,
    delta: '+33.3%',
    up: true,
    spark: [4.2, 4.6, 5.1, 5.9, 6.4, 7.2, 8.1, 9.3, 10.8],
    color: 'var(--ec-color-success)',
  },
  {
    title: 'ARR',
    value: 1298400,
    prefix: '$',
    precision: 0,
    delta: '+18.2%',
    up: true,
    spark: [504, 612, 564, 756, 852, 936, 1032, 1128, 1298],
    color: 'var(--ec-color-warning)',
  },
  {
    title: 'Churn',
    value: 1.8,
    suffix: '%',
    precision: 1,
    delta: '-0.6 pts',
    up: false,
    spark: [3.1, 2.9, 2.8, 2.6, 2.4, 2.3, 2.1, 2.0, 1.8],
    color: 'var(--ec-color-danger)',
  },
];

/* -------------------------------------------------------------------------- */
/* The product-style analytics dashboard.                                     */
/* -------------------------------------------------------------------------- */

function Dashboard() {
  const [range, setRange] = useState<string | number>('9m');

  return (
    <div className="dash" role="group" aria-label="Voltaflow analytics dashboard">
      <div className="dash__bar">
        <div>
          <Text tag="strong" size="large">
            Voltaflow Analytics
          </Text>
          <div className="dash__sub">
            <Text type="info" size="small">
              Revenue, growth and acquisition at a glance
            </Text>
          </div>
        </div>
        <Segmented
          options={[
            { label: '30d', value: '30d' },
            { label: '90d', value: '90d' },
            { label: '9m', value: '9m' },
            { label: 'YTD', value: 'ytd' },
          ]}
          value={range}
          onChange={setRange}
          size="small"
          aria-label="Date range"
        />
      </div>

      {/* Row of stat cards, each with its own sparkline. */}
      <div className="dash__stats">
        {STATS.map((s) => (
          <Card key={s.title} shadow="hover" className="dash__stat">
            <div className="dash__stat-head">
              <Statistic
                title={s.title}
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                precision={s.precision}
                groupSeparator=","
              />
              <Tag
                type={s.up ? 'success' : 'danger'}
                effect="light"
                size="small"
                round
              >
                {s.delta}
              </Tag>
            </div>
            <Sparkline
              data={s.spark}
              width={260}
              height={40}
              area
              smooth
              color={s.color}
              ariaLabel={`${s.title} trend over the last 9 months`}
              style={{ width: '100%' }}
            />
          </Card>
        ))}
      </div>

      {/* Main chart grid. */}
      <div className="dash__grid">
        <Card
          className="dash__panel dash__panel--wide"
          shadow="never"
          header={
            <div className="dash__panel-head">
              <Text tag="strong">Revenue by month</Text>
              <Tag effect="plain" size="small">
                $k
              </Tag>
            </div>
          }
        >
          <BarChart
            data={REVENUE_BY_MONTH}
            height={280}
            radius={6}
            formatValue={(v) => `$${v}k`}
            ariaLabel="Monthly recurring revenue by month, in thousands of dollars"
          />
        </Card>

        <Card
          className="dash__panel"
          shadow="never"
          header={
            <div className="dash__panel-head">
              <Text tag="strong">Traffic sources</Text>
              <Tag effect="plain" size="small">
                share
              </Tag>
            </div>
          }
        >
          <DonutChart
            data={TRAFFIC_SOURCES}
            size={208}
            thickness={30}
            gap={0.02}
            centerLabel={
              <div className="dash__donut-center">
                <span className="dash__donut-value">100%</span>
                <span className="dash__donut-label">tracked</span>
              </div>
            }
            showLegend
            formatValue={(v) => `${v}%`}
            ariaLabel="Traffic sources by share of total visits"
          />
        </Card>

        <Card
          className="dash__panel dash__panel--wide"
          shadow="never"
          header={
            <div className="dash__panel-head">
              <Text tag="strong">Active users</Text>
              <Tag type="success" effect="light" size="small" round>
                +33% this quarter
              </Tag>
            </div>
          }
        >
          <LineChart
            data={GROWTH}
            height={260}
            smooth
            area
            showDots
            formatY={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
            ariaLabel="Monthly active users, trending up across nine months"
          />
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* A gallery of each chart type, individually, with captions.                 */
/* -------------------------------------------------------------------------- */

const LINE_DATA = MONTHS.slice(0, 6).map((x, i) => ({
  x,
  y: [120, 200, 150, 320, 280, 410][i],
}));

const BAR_DATA = [
  { label: 'Q1', value: 120 },
  { label: 'Q2', value: 200 },
  { label: 'Q3', value: 150 },
  { label: 'Q4', value: 240 },
];

const PIE_DATA = [
  { label: 'Pro', value: 58 },
  { label: 'Team', value: 26 },
  { label: 'Free', value: 16 },
];

function GalleryCard({
  name,
  caption,
  children,
}: {
  name: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gallery__card" shadow="never">
      <div className="gallery__head">
        <Text tag="strong">{name}</Text>
        <Text type="info" size="small">
          {caption}
        </Text>
      </div>
      <div className="gallery__stage">{children}</div>
    </Card>
  );
}

function Gallery() {
  return (
    <div className="gallery">
      <GalleryCard name="LineChart" caption="Smooth single series with dots.">
        <LineChart data={LINE_DATA} height={180} smooth showDots ariaLabel="Line chart example" />
      </GalleryCard>

      <GalleryCard name="AreaChart" caption="A LineChart with the area fill on by default.">
        <AreaChart data={LINE_DATA} height={180} smooth ariaLabel="Area chart example" />
      </GalleryCard>

      <GalleryCard name="BarChart" caption="Vertical bars with rounded leading corners.">
        <BarChart data={BAR_DATA} height={180} radius={6} ariaLabel="Bar chart example" />
      </GalleryCard>

      <GalleryCard name="DonutChart" caption="Center label with a legend.">
        <DonutChart
          data={PIE_DATA}
          size={172}
          thickness={26}
          centerLabel="100%"
          showLegend
          ariaLabel="Donut chart example"
        />
      </GalleryCard>

      <GalleryCard name="PieChart" caption="A donut with no inner radius.">
        <PieChart data={PIE_DATA} size={172} showLegend ariaLabel="Pie chart example" />
      </GalleryCard>

      <GalleryCard name="Sparkline" caption="Tiny inline trend for cards and tables.">
        <Space direction="vertical" size="large" fill>
          <Sparkline data={[3, 7, 4, 9, 6, 11, 8, 13]} width={240} height={44} area smooth style={{ width: '100%' }} />
          <Sparkline
            data={[12, 10, 11, 8, 9, 6, 7, 4]}
            width={240}
            height={44}
            smooth
            color="var(--ec-color-danger)"
            style={{ width: '100%' }}
          />
        </Space>
      </GalleryCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export default function ChartsDemo() {
  return (
    <DemoStack>
      <Example
        title="Analytics dashboard"
        description="A product-style dashboard composed from Cobos UI Card, Statistic, Tag and Segmented, with @cobos/charts for the data. Every color follows the active brand theme and light/dark mode."
      >
        <Dashboard />
      </Example>

      <Example title="Chart gallery" description="Each chart type on its own, with a one-line caption.">
        <Gallery />
      </Example>
    </DemoStack>
  );
}

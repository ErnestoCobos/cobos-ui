import { Row, Col } from '@cobos/react';
import { Example, DemoStack } from './_demo';

function Block({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 'var(--ec-border-radius-base)',
        background: dark ? 'var(--ec-color-primary-light-3)' : 'var(--ec-color-primary-light-7)',
        color: dark ? '#fff' : 'var(--ec-color-primary-dark-2)',
        textAlign: 'center',
        padding: '14px 0',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export default function LayoutDemo() {
  return (
    <DemoStack>
      <Example title="Basic 24-column grid">
        <Row gutter={16}>
          <Col span={24}>
            <Block dark>span 24</Block>
          </Col>
        </Row>
      </Example>

      <Example title="Equal columns" description="Four columns of span 6 with a gutter.">
        <Row gutter={16}>
          {[0, 1, 2, 3].map((i) => (
            <Col span={6} key={i}>
              <Block>span 6</Block>
            </Col>
          ))}
        </Row>
      </Example>

      <Example title="Offsets" description="Push columns with offset.">
        <Row gutter={16}>
          <Col span={8}>
            <Block>span 8</Block>
          </Col>
          <Col span={8} offset={8}>
            <Block dark>span 8, offset 8</Block>
          </Col>
        </Row>
      </Example>

      <Example title="Responsive" description="Stacks on small screens, sits side-by-side from md up.">
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Block dark>xs 24 / md 16</Block>
          </Col>
          <Col xs={24} md={8}>
            <Block>xs 24 / md 8</Block>
          </Col>
        </Row>
      </Example>
    </DemoStack>
  );
}

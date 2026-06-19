import { useState } from 'react';
import { Pagination, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function PaginationDemo() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  return (
    <DemoStack>
      <Example title="Basic" description="Prev / pager / next.">
        <Pagination total={100} layout="prev, pager, next" />
      </Example>

      <Example title="With total" description="Show the item count.">
        <Pagination total={420} pageSize={20} layout="total, prev, pager, next" />
      </Example>

      <Example title="Background buttons">
        <Pagination total={250} background layout="prev, pager, next" />
      </Example>

      <Example title="Full controls" description="Sizes selector and jumper, fully controlled.">
        <Space direction="vertical" align="start">
          <Pagination
            total={368}
            currentPage={page}
            pageSize={size}
            pageSizes={[10, 20, 50, 100]}
            background
            layout="total, sizes, prev, pager, next, jumper"
            onCurrentChange={setPage}
            onSizeChange={(s) => {
              setSize(s);
              setPage(1);
            }}
          />
          <Text type="info" size="small">
            page {page}, {size} per page
          </Text>
        </Space>
      </Example>
    </DemoStack>
  );
}

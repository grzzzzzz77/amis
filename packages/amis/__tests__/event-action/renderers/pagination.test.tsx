import {fireEvent, render} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('pagination: pageNum change event', async () => {
  const mockFn = jest.fn();
  const pageChange = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'pagination',
        layout: 'total,perPage,pager,go',
        mode: 'normal',
        activePage: 2,
        lastPage: 99999,
        total: 999,
        perPage: 10,
        maxButtons: 7,
        showPerPage: true,
        perPageAvailable: [10, 20, 50, 100],
        showPageInput: true,
        disabled: false,
        id: 'u:1bf323bc4dbd',
        onPageChange: pageChange,
        onEvent: {
          change: {
            weight: 0,
            actions: [
              {
                actionType: 'custom',
                preventDefault: true, // 阻止事件默认行为
                script: mockFn
              }
            ]
          }
        }
      },
      {},
      makeEnv({})
    )
  );
  // 当前页码改变
  const prev = container.querySelector('.cxd-Pagination-prev')!;
  fireEvent.click(prev); // 上一页
  await wait(100);
  expect(mockFn).toBeCalledTimes(1);
  await wait(200);
  expect(pageChange).not.toBeCalled();

  const next = container.querySelector('.cxd-Pagination-next')!;
  fireEvent.click(next); // 下一页
  await wait(300);
  expect(mockFn).toBeCalledTimes(2);

  const go = container.querySelector('.cxd-Pagination-inputGroup')!;
  fireEvent.change(go.querySelector('.cxd-Pagination-inputGroup-input')!, {
    target: {value: 9}
  });
  await wait(400);
  fireEvent.click(go.querySelector('.cxd-Pagination-inputGroup-right')!); // 输入后点击go
  await wait(500);
  expect(mockFn).toBeCalledTimes(3);

  function getPagerItem() {
    const pager = container.querySelectorAll(
      '.cxd-Pagination > .cxd-Pagination-pager-item'
    );
    return pager[3];
  }
  fireEvent.click(getPagerItem()!); // 点击页码切换
  await wait(600);
  expect(mockFn).toBeCalledTimes(4);
});

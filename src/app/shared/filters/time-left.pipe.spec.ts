import { TimeLeftPipe } from './time-left.pipe';

describe('TimeLeftPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeLeftPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(1000)).toEqual('silly', 'Should be silly.');
  });
});

import { TimeLeftPipe } from './time-left.pipe';

describe('TimeLeftPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeLeftPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(1000)).toEqual('00:00:01', 'Should display 1 second.');
  });
});

import { SecToTimePipe } from './sec-to-time.pipe';

describe('SecToTimePipe', () => {
  it('create an instance', () => {
    const pipe = new SecToTimePipe();
    expect(pipe).toBeTruthy();
  });
});

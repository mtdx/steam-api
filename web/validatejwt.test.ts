import 'jest';
import { validatejwt } from './validatejwt';

describe('#validatejwt()', () => {
    it('returns a user based on a decoded token', async done => {
        const callback = jest.fn();
        const decodedToken = { id: '1', username: 'admin', scope: 'u' };
        await validatejwt(null, decodedToken, callback);
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][1]).toBe(true);
        done();
    });
});

describe('#validatejwt()', () => {
    it('fail to return a user based on a decoded token (wrong username)', async done => {
        const callback = jest.fn();
        const decodedToken = { id: '1', username: 'fakeadmin', scope: 'u' };
        await validatejwt(null, decodedToken, callback);
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][1]).toBe(false);
        done();
    });
});

describe('#validatejwt()', () => {
    it('fail to return a user based on a decoded token (wrong id)', async done => {
        const callback = jest.fn();
        const decodedToken = { id: '2', username: 'admin', scope: 'u' };
        await validatejwt(null, decodedToken, callback);
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][1]).toBe(false);
        done();
    });
});

describe('#validatejwt()', () => {
    it('fail to return a user based on a decoded token (wrong scope)', async done => {
        const callback = jest.fn();
        const decodedToken = { id: '1', username: 'admin', scope: 'x' };
        await validatejwt(null, decodedToken, callback);
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][1]).toBe(false);
        done();
    });
});

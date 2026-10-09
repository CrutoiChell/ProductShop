import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

async function controller() {
    const queries = [];
    const hashes = [];
    const row = { id: 7, name: 'User', surname: '', email: 'user@example.test', phone_number: '', address: '', role: 'user' };
    const pool = { query: async (sql, values) => {
        queries.push({ sql, values });
        // PostgreSQL only returns the columns requested by SELECT/RETURNING.
        return { rows: [{ ...row, ...(/SELECT \*|RETURNING \*/.test(sql) ? { password: 'stored-hash' } : {}) }] };
    } };
    const bcrypt = { hash: async (value, cost) => { hashes.push({ value, cost }); return 'new-hash'; } };
    const source = await readFile(new URL('../Controllers/userController.js', import.meta.url), 'utf8');
    const module = new SourceTextModule(source);
    await module.link(specifier => {
        const exports = specifier === '../db.js' ? { pool } : { default: specifier === 'bcrypt' ? bcrypt : {} };
        return new SyntheticModule(Object.keys(exports), function () {
            for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
        });
    });
    await module.evaluate();
    const res = { code: 200, body: undefined, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    return { handlers: module.namespace, queries, hashes, res };
}

test('self-profile rejects role changes and alternate SQL identifiers before querying', async () => {
    for (const key of ['role', 'id', 'ROLE', 'role = \'admin\' --', '__proto__']) {
        const { handlers, queries, res } = await controller();
        const body = JSON.parse(JSON.stringify({ name: 'User', email: 'user@example.test', [key]: 'admin' }));
        await handlers.edit_profile({ user: { userId: 7 }, body }, res);
        assert.equal(res.code, 400, key);
        assert.equal(queries.length, 0, key);
    }
});

test('malformed bodies and missing required fields return 400 without SQL', async () => {
    for (const body of [null, [], 'text', {}, { name: 'User' }]) {
        const { handlers, queries, res } = await controller();
        await handlers.edit_profile({ user: { userId: 7 }, body }, res);
        assert.equal(res.code, 400);
        assert.equal(queries.length, 0);
    }
});

test('ordinary edits remain parameterized, scoped to the authenticated user, and hash new passwords', async () => {
    const { handlers, queries, hashes, res } = await controller();
    const body = { name: "O'Reilly", email: 'user@example.test', surname: '', address: 'Street', phone_number: '', password: 'new-password' };
    await handlers.edit_profile({ user: { userId: 7 }, body }, res);
    assert.equal(res.code, 200);
    assert.deepEqual(hashes, [{ value: 'new-password', cost: 10 }]);
    assert.deepEqual(queries[0].values, [body.name, body.email, '', 'Street', '', 'new-hash', 7]);
    assert.match(queries[0].sql, /WHERE id = \$7/);
    assert.doesNotMatch(queries[0].sql, /O'Reilly|new-password|role\s*=/);
    assert.equal(res.body.role, 'user');
    assert.equal(Object.hasOwn(res.body, 'password'), false);
});

test('editing without a new password preserves the stored password', async () => {
    const { handlers, queries, hashes, res } = await controller();
    await handlers.edit_profile({ user: { userId: 7 }, body: { name: 'User', email: 'user@example.test' } }, res);
    assert.equal(res.code, 200);
    assert.equal(hashes.length, 0);
    assert.doesNotMatch(queries[0].sql.split('RETURNING')[0], /password/);
});

test('fetch and delete profile responses exclude password hashes and keep profile fields', async () => {
    for (const name of ['fetch_profile_data', 'delete_profile']) {
        const { handlers, queries, res } = await controller();
        await handlers[name]({ user: { userId: 7 } }, res);
        assert.equal(res.code, 200);
        assert.deepEqual(queries[0].values, [7]);
        assert.doesNotMatch(queries[0].sql, /\*|password/);
        assert.equal(Object.hasOwn(res.body, 'password'), false);
        assert.equal(res.body.id, 7);
        assert.equal(res.body.email, 'user@example.test');
        assert.equal(res.body.role, 'user');
    }
});

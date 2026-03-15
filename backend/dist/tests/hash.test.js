import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSha256FromBuffer, maskEmail } from '../src/utils/hash.js';
test('generateSha256FromBuffer returns stable sha256 digest', async () => {
    const digest = await generateSha256FromBuffer(Buffer.from('secure document'));
    assert.equal(digest, '27400401c177a59ad774e180ca9299bf35c209bf277a63abb472e57e88fff2d9');
});
test('maskEmail hides the local part while preserving the domain', () => {
    assert.equal(maskEmail('johndoe@example.com'), 'j***@example.com');
});

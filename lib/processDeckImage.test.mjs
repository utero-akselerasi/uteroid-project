import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";

import { processDeckImage } from "./processDeckImage.ts";

async function solidImage(background, width = 1200, height = 800) {
  return sharp({
    create: { width, height, channels: 3, background },
  }).png().toBuffer();
}

test("adds an adaptive centered watermark and returns WebP", async () => {
  const light = await processDeckImage(await solidImage("#ffffff"));
  const dark = await processDeckImage(await solidImage("#000000"));

  assert.equal(light.watermarkColor, "black");
  assert.equal(dark.watermarkColor, "white");
  assert.equal((await sharp(light.buffer).metadata()).format, "webp");
  assert.equal((await sharp(dark.buffer).metadata()).format, "webp");

  const lightStats = await sharp(light.buffer).extract({ left: 300, top: 200, width: 600, height: 400 }).stats();
  const darkStats = await sharp(dark.buffer).extract({ left: 300, top: 200, width: 600, height: 400 }).stats();
  assert.ok(lightStats.channels[0].min < 245, "black watermark should darken light image center");
  assert.ok(darkStats.channels[0].max > 10, "white watermark should lighten dark image center");
});

test("keeps small images and caps large images at 3840 px", async () => {
  const small = await processDeckImage(await solidImage("#ffffff", 640, 360));
  const large = await processDeckImage(await solidImage("#ffffff", 4000, 2000));

  assert.deepEqual([small.width, small.height], [640, 360]);
  assert.deepEqual([large.width, large.height], [3840, 1920]);
});
test("rejects malformed images and unsupported formats", async () => {
  await assert.rejects(processDeckImage(Buffer.from("not an image")), /bukan gambar yang valid/);
  const gif = await sharp({ create: { width: 20, height: 20, channels: 3, background: "#ffffff" } }).gif().toBuffer();
  await assert.rejects(processDeckImage(gif), /hanya boleh berupa JPEG, PNG, atau WebP/);
});

test("applies EXIF orientation before calculating output dimensions", async () => {
  const jpeg = await sharp({
    create: { width: 300, height: 200, channels: 3, background: "#ffffff" },
  }).withMetadata({ orientation: 6 }).jpeg().toBuffer();
  const result = await processDeckImage(jpeg);
  assert.deepEqual([result.width, result.height], [200, 300]);
});
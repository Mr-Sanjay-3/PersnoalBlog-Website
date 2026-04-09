import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function test() {
  try {
    const formData = new FormData();
    formData.append('media', Buffer.from('test'), {
      filename: 'test.jpg',
      contentType: 'image/jpeg',
    });

    // we need to bypass auth for a moment in the test script, or we can just see if it fails from Multer first
    // Actually, I can just modify uploadRoutes to bypass auth for a quick test
  } catch (e) {
    console.error(e);
  }
}
test();

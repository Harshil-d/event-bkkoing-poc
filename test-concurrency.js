const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const EVENT_ID = '28fb6be5-2c94-4582-9313-71802b74d920';

async function loginUser(email, password) {
  const response = await axios.post(`${BASE_URL}/auth/user/login`, {
    email,
    password
  });
  return response.data.tokens.accessToken;
}

async function bookEvent(token, seats) {
  try {
    const response = await axios.post(`${BASE_URL}/bookings`, {
      eventId: EVENT_ID,
      seats: seats
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

async function testConcurrency() {
  console.log('🧪 Testing Concurrency Protection...\n');
  
  // Login as two different users
  const token1 = await loginUser('test@example.com', 'Test123!');
  const token2 = await loginUser('test2@example.com', 'Test123!');
  
  console.log('✅ Both users logged in successfully');
  
  // Try to book 300 seats each simultaneously (event has 500 total)
  console.log('\n🚀 Attempting concurrent bookings...');
  console.log('User 1: Booking 300 seats');
  console.log('User 2: Booking 300 seats');
  console.log('Total requested: 600 seats (Event has 500 available)\n');
  
  const [result1, result2] = await Promise.all([
    bookEvent(token1, 300),
    bookEvent(token2, 300)
  ]);
  
  console.log('📊 Results:');
  console.log('User 1:', result1.success ? '✅ SUCCESS' : '❌ FAILED - ' + result1.error);
  console.log('User 2:', result2.success ? '✅ SUCCESS' : '❌ FAILED - ' + result2.error);
  
  // Check remaining seats
  const eventResponse = await axios.get(`${BASE_URL}/events/${EVENT_ID}`, {
    headers: { Authorization: `Bearer ${token1}` }
  });
  
  console.log(`\n📈 Event Status:`);
  console.log(`Available seats: ${eventResponse.data.seatsAvailable}`);
  console.log(`Total seats: ${eventResponse.data.totalSeats}`);
  
  if (result1.success && result2.success) {
    console.log('\n❌ CONCURRENCY ISSUE: Both bookings succeeded!');
  } else if (result1.success || result2.success) {
    console.log('\n✅ CONCURRENCY PROTECTION WORKING: Only one booking succeeded');
  } else {
    console.log('\n⚠️  Both bookings failed (unexpected)');
  }
}

testConcurrency().catch(console.error);

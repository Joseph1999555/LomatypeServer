const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const http = require('http'); // เพิ่มสำหรับ WebSocket
const WebSocket = require('ws'); // เพิ่มสำหรับ WebSocket

const env = require('dotenv').config();
const app = express();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World! The server is running.');
});


// เชื่อมต่อ MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// สร้าง HTTP server จาก Express เพื่อใช้กับ WebSocket
const server = http.createServer(app);

// สร้าง WebSocket server ที่เชื่อมต่อกับ HTTP server
const wss = new WebSocket.Server({ server });

const waitingPlayers = []; // เก็บผู้เล่นที่รอจับคู่
const matchedPlayers = new Map();
const { RandomCodeSnippet } = require('./controllers/CodeSnippet');

const fetchRandomCodeSnippet = async () => {
  try {
    const randomSnippet = await RandomCodeSnippet(); // ส่ง req และ res ให้ถูกต้อง
    return randomSnippet; // หรือดำเนินการใด ๆ ที่คุณต้องการทำกับ randomSnippet
  } catch (error) {
    console.error('Error fetching random snippet:', error);
  }
};




// เมื่อมีการเชื่อมต่อ WebSocket
wss.on('connection', (ws) => {
  //console.log('WebSocket client connected');

  // ฟังก์ชันเพื่อจับคู่ผู้เล่น
  const matchPlayer = async () => {
    waitingPlayers.push(ws);

    if (waitingPlayers.length >= 2) {
      const player1 = waitingPlayers.shift();
      const player2 = waitingPlayers.shift();

      // ดึงโค้ดตัวอย่าง
      const codeSnippet = await fetchRandomCodeSnippet(); // ปรับเรียกใช้งานฟังก์ชันให้เหมาะสม

      // จับคู่ผู้เล่นและเก็บข้อมูลใน matchedPlayers
      matchedPlayers.set(player1.id, player2);
      matchedPlayers.set(player2.id, player1);

      // ส่งข้อมูลการจับคู่กลับไปยังผู้เล่นทั้งสองคนพร้อมชื่อ
      player1.send(JSON.stringify({
        event: 'match_found',
        data: {
          id: player2.id,
          name: player2.username,
          codeSnippet: codeSnippet
        }
      }));

      player2.send(JSON.stringify({
        event: 'match_found',
        data: {
          id: player1.id,
          name: player1.username,
          codeSnippet: codeSnippet
        }
      }));
      return;
    }
  };


  // รับข้อความจาก client
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // ตรวจสอบประเภทของ event
    if (data.event === 'request_match') {
      ws.id = data.userId; // กำหนด id ของผู้เล่น
      ws.username = data.username; // กำหนด username ของผู้เล่น
      matchPlayer(); // เรียกฟังก์ชันจับคู่ผู้เล่น
    } else if (data.event === 'player_ready') {
      // ตรวจสอบว่าผู้เล่นมีคู่แข่งที่จับคู่แล้วหรือยัง
      const opponent = matchedPlayers.get(ws.id);
      if (opponent) {
        // ส่งสัญญาณ readiness ให้กับคู่แข่ง
        opponent.send(JSON.stringify({ event: 'opponent_ready' }));
      }
    } else if (data.type === 'typing') {
      const opponent = matchedPlayers.get(ws.id);
      if (opponent) {
        // ส่งข้อความการพิมพ์ไปยังคู่แข่ง
        opponent.send(JSON.stringify({
          event: 'typing_update',
          input: data.input,
          playerId: ws.id,
        }));
      }
    } else if (data.event === 'player_stats_update') {
      if (data.stats && typeof data.stats.wpm === 'number' && typeof data.stats.accuracy === 'number') {
        // อัพเดตสถิติของผู้เล่น
        ws.wpm = data.stats.wpm;
        ws.accuracy = data.stats.accuracy;

        const opponent = matchedPlayers.get(ws.id);
        if (opponent) {
          opponent.send(JSON.stringify({
            event: 'opponent_stats_update',
            stats: {
              userId: ws.id,
              wpm: ws.wpm,
              accuracy: ws.accuracy,
            }
          }));
        }
      } else {
        console.error("Invalid stats format received:", data.stats);
      }
    } else if (data.event === 'match_end') {
      const opponent = matchedPlayers.get(ws.id);
      if (opponent) {
  
          // ส่งสถิติของ Player 1 ไปยังทั้ง Player 1 และ Player 2
          const player1Stats = {
              event: 'update_final_stats',
              userId: ws.id,
              username: ws.username,
              wpm: ws.wpm,
              accuracy: ws.accuracy,
          };
  
          // ส่งสถิติของ Player 2
          const player2Stats = {
              event: 'update_final_stats',
              userId: opponent.id,
              username: opponent.username,
              wpm: opponent.wpm,
              accuracy: opponent.accuracy,
          };
  
          // ส่งข้อมูลไปยังทั้งคู่
          ws.send(JSON.stringify(player1Stats));
          opponent.send(JSON.stringify(player1Stats));
          
          ws.send(JSON.stringify(player2Stats));
          opponent.send(JSON.stringify(player2Stats));
      }
  }
  
  });

  // เมื่อปิดการเชื่อมต่อ
  ws.on('close', () => {
    //console.log('WebSocket client disconnected');

    // ลบผู้เล่นที่ออกจาก waitingPlayers
    const index = waitingPlayers.indexOf(ws);
    if (index > -1) {
      waitingPlayers.splice(index, 1);
    }

    // ลบคู่แข่งที่จับคู่ไว้แล้วใน matchedPlayers
    matchedPlayers.delete(ws.id);
  });
});

// รัน HTTP และ WebSocket server
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
